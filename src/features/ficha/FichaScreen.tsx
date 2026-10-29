import { Check } from 'lucide-react';
import { useState } from 'react';
import { FICHA_EVENTOS_INICIO, FICHA_SINTOMAS, FICHA_TEXTOS } from '../../content/ficha';
import { WHATSAPP_URL } from '../../config';
import {
  useAllDays,
  useConsult,
  useDiary,
  useFodmap,
  useLessons,
  usePlan,
  useProfile,
  useStoredHabits,
} from '../../app/data';
import { useToday } from '../../app/useToday';
import { allHabits } from '../../logic/activeHabits';
import { consultAutofill } from '../../logic/consult';
import { addDays, formatDateFull } from '../../logic/dates';
import { computeReevaluation } from '../../logic/reevaluation';
import { shareOrDownload } from '../../db/backup';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { BulletList, ExternalLink, Note } from '../../ui/Misc';
import { Screen } from '../../ui/Screen';
import { concludeTask } from '../processo/actions';
import styles from '../processo/Processo.module.css';
import {
  autofillFields,
  fichaSections,
  fichaText,
  fieldValue,
  saveConsultFields,
  weekRows,
  type FichaFields,
} from './fichaData';

/** Ficha para a consulta (seção 6.14). */
export function Component() {
  const today = useToday();
  const profile = useProfile();
  const records = useAllDays();
  const lessons = useLessons();
  const plan = usePlan();
  const stored = useStoredHabits();
  const diary = useDiary(addDays(today, -365), today);
  const fodmap = useFodmap();
  const consult = useConsult();
  if (
    !profile ||
    !records ||
    !lessons ||
    plan === undefined ||
    !stored ||
    !diary ||
    fodmap === undefined ||
    consult === undefined
  )
    return null;
  const reeval =
    plan && (plan.status === 'concluido' || plan.blocks.length > 0)
      ? computeReevaluation(plan, records, allHabits(plan, stored), profile)
      : undefined;
  const auto = consultAutofill({
    records,
    today,
    lessons,
    reeval: plan?.status === 'concluido' ? reeval : undefined,
    diary,
    fodmap,
  });
  return (
    <Ficha
      today={today}
      stored={consult?.fields ?? {}}
      savedAt={consult?.savedAt}
      autoFields={autofillFields(auto, profile.name)}
      weeks={weekRows(auto)}
    />
  );
}

function Ficha({
  today,
  stored,
  savedAt,
  autoFields,
  weeks,
}: {
  today: string;
  stored: FichaFields;
  savedAt?: string;
  autoFields: FichaFields;
  weeks: ReturnType<typeof weekRows>;
}) {
  const [local, setLocal] = useState<FichaFields>({});
  const [msg, setMsg] = useState('');
  const v = (k: string) => local[k] ?? fieldValue(stored, autoFields, k);
  const set = (k: string, val: string) => setLocal((l) => ({ ...l, [k]: val }));
  const persist = (k: string) => {
    if (local[k] !== undefined) void saveConsultFields({ [k]: local[k] as string });
  };
  const all = (): FichaFields => {
    const keys = new Set([
      ...Object.keys(autoFields),
      ...Object.keys(stored),
      ...Object.keys(local),
    ]);
    return Object.fromEntries([...keys].map((k) => [k, v(k)]));
  };
  const sections = () => fichaSections(v, formatDateFull(today));
  const eventos = v('eventos').split('|').filter(Boolean);

  const save = async () => {
    await saveConsultFields(all(), true);
    await concludeTask(9);
    setMsg('Ficha salva.');
  };
  const pdf = async () => {
    setMsg('Gerando o PDF...');
    await saveConsultFields(all(), true);
    const { buildFichaPdf } = await import('./pdf');
    const file = await buildFichaPdf(sections(), weeks, `ficha-consulta-${today}.pdf`);
    const r = await shareOrDownload(file, true);
    setMsg(r === 'baixado' ? 'PDF salvo no aparelho.' : r === 'compartilhado' ? 'PDF pronto.' : '');
  };
  const copy = async () => {
    const text = fichaText(sections(), weeks);
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Texto copiado.');
    } catch {
      setMsg('Não foi possível copiar. Use o PDF ou a impressão.');
    }
  };

  const field = (
    k: string,
    label: string,
    opts: { area?: boolean; type?: string; help?: string } = {},
  ) => (
    <div className={styles.campo}>
      <label htmlFor={`ficha-${k}`}>{label}</label>
      {opts.help ? <p className={styles.ajuda}>{opts.help}</p> : null}
      {opts.area ? (
        <textarea
          id={`ficha-${k}`}
          className={styles.textarea}
          value={v(k)}
          onChange={(e) => set(k, e.target.value)}
          onBlur={() => persist(k)}
        />
      ) : (
        <input
          id={`ficha-${k}`}
          type={opts.type ?? 'text'}
          value={v(k)}
          onChange={(e) => set(k, e.target.value)}
          onBlur={() => persist(k)}
        />
      )}
    </div>
  );

  return (
    <Screen title="Ficha para a consulta" back={true}>
      <p>{FICHA_TEXTOS.comoUsar}</p>
      <BulletList
        items={FICHA_TEXTOS.dicas.map((d) => (d.nota ? `${d.texto} ${d.nota}` : d.texto))}
      />
      <Note>
        Os campos que vêm dos teus registros já aparecem preenchidos. Você pode mudar tudo.
      </Note>

      <Card label="Dados">
        <div className={styles.pilha}>
          {field('nome', 'Nome')}
          <p className="secundario">Data de hoje: {formatDateFull(today)}</p>
          {field('dataConsulta', 'Data da consulta', { type: 'date' })}
          {field('profissional', 'Profissional')}
        </div>
      </Card>

      <Card label="A tua história">
        <div className={styles.pilha}>
          {field('haQuantoTempo', 'Há quanto tempo os sintomas aparecem')}
          <p className={styles.rotulo}>Começaram depois de algum evento?</p>
          <CheckList
            items={FICHA_EVENTOS_INICIO.map((e) => ({ id: e, label: e }))}
            checked={(id) => eventos.includes(id)}
            onToggle={(id, on) => {
              const next = (on ? [...eventos, id] : eventos.filter((x) => x !== id)).join('|');
              set('eventos', next);
              void saveConsultFields({ eventos: next });
            }}
          />
        </div>
      </Card>

      <Card label="Sintomas" title="Vezes por semana e intensidade de 0 a 10">
        <div className={styles.pilha}>
          {FICHA_SINTOMAS.map((s) => (
            <div key={s.id} className={styles.linha}>
              <span style={{ flex: '1 1 100%', fontWeight: 600 }}>{s.label}</span>
              <div className={styles.campo} style={{ flex: 1 }}>
                <label htmlFor={`ficha-sint_${s.id}_vezes`} className="pequeno">
                  Vezes por semana
                </label>
                <input
                  id={`ficha-sint_${s.id}_vezes`}
                  inputMode="decimal"
                  type="text"
                  value={v(`sint_${s.id}_vezes`)}
                  onChange={(e) => set(`sint_${s.id}_vezes`, e.target.value)}
                  onBlur={() => persist(`sint_${s.id}_vezes`)}
                />
              </div>
              {s.id !== 'esforco' && s.id !== 'incompleta' ? (
                <div className={styles.campo} style={{ flex: 1 }}>
                  <label htmlFor={`ficha-sint_${s.id}_int`} className="pequeno">
                    Intensidade
                  </label>
                  <input
                    id={`ficha-sint_${s.id}_int`}
                    inputMode="decimal"
                    type="text"
                    value={v(`sint_${s.id}_int`)}
                    onChange={(e) => set(`sint_${s.id}_int`, e.target.value)}
                    onBlur={() => persist(`sint_${s.id}_int`)}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card label="O que você já observou">
        <div className={styles.pilha}>
          {field('bristol', 'Tipo de Bristol mais frequente nas últimas 3 semanas')}
          {field('padrao', 'Há alternância entre tipos ou o padrão é sempre o mesmo?')}
          {field('testado', 'O que você já testou e o que mudou', { area: true })}
          {field('gatilhos', 'Alimentos que você identificou como gatilho', { area: true })}
        </div>
      </Card>

      <Card label="Medicamentos, exames e família">
        <div className={styles.pilha}>
          {field(
            'medicamentos',
            'Medicamentos e suplementos em uso: o quê, para quê e há quanto tempo',
            { area: true, help: FICHA_TEXTOS.medicamentosNota },
          )}
          {field('exames', 'Exames já realizados, com data', { area: true })}
          {field('familia', 'Histórico de doença intestinal na família', { area: true })}
        </div>
      </Card>

      <Card label="Sinais de alerta presentes">
        {field('alertas', 'Sinais de alerta', {
          area: true,
          help: 'Deixe em branco se nenhum destes.',
        })}
      </Card>

      <Card label="Perguntas que eu quero fazer">
        {field('perguntas', 'Perguntas', { area: true, help: FICHA_TEXTOS.perguntasNota })}
      </Card>

      <Card label="O que levar">
        <BulletList items={FICHA_TEXTOS.oQueLevar} />
        <p className="secundario">{FICHA_TEXTOS.oQueLevarFecho}</p>
      </Card>

      <div className={`${styles.pilha} nao-imprimir`}>
        <Button
          variant="primary"
          block
          icon={savedAt ? <Check size={18} /> : undefined}
          onClick={() => void save()}
        >
          Salvar a ficha
        </Button>
        <div className={styles.linha}>
          <Button onClick={() => void pdf()}>Gerar PDF</Button>
          <Button onClick={() => void copy()}>Copiar texto</Button>
          <Button variant="ghost" onClick={() => window.print()}>
            Imprimir
          </Button>
        </div>
        <p role="status" aria-live="polite" className="secundario">
          {msg}
        </p>
      </div>

      <Card className="nao-imprimir">
        <p>{FICHA_TEXTOS.convite}</p>
        <ExternalLink href={WHATSAPP_URL}>Chamar no WhatsApp</ExternalLink>
      </Card>
    </Screen>
  );
}
