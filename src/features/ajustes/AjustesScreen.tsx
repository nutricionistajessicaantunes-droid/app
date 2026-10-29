import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { APP_VERSION, COPOS_POR_DIA } from '../../config';
import { PATH_OPTIONS } from '../../content/onboarding';
import { ALL_SYMPTOMS, DEFAULT_SYMPTOMS_BY_PATH, SYMPTOM_LABEL } from '../../content/registro';
import { saveProfile } from '../../db/repo';
import { formatDayMonth, toDayKey, weekdayFullName } from '../../logic/dates';
import { formatCompact } from '../../logic/format';
import type { Path, SymptomId, Theme } from '../../types';
import { useMeta, useProfile } from '../../app/data';
import { useToday } from '../../app/useToday';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CheckList } from '../../ui/CheckList';
import { Choice } from '../../ui/Choice';
import { Filete } from '../../ui/Filete';
import { Screen } from '../../ui/Screen';
import { Switch } from '../../ui/Switch';
import { TEXTO_APOIO_COPIA, useSaveBackup } from '../copia/useSaveBackup';
import { CalendarButtons } from '../lembretes/CalendarButtons';
import { leituraEvent, registroEvent, revisaoMesEvent } from '../lembretes/reminders';
import styles from './Ajustes.module.css';

function Item({ to, label, detail }: { to: string; label: string; detail?: string }) {
  return (
    <li>
      <Link to={to} className={styles.item}>
        <span className={styles.itemTexto}>
          <span>{label}</span>
          {detail ? <span className={styles.itemDetalhe}>{detail}</span> : null}
        </span>
        <ChevronRight size={20} className={styles.seta} aria-hidden="true" />
      </Link>
    </li>
  );
}

function usePersisted(): boolean | undefined {
  const [persisted, setPersisted] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const p = (await navigator.storage?.persisted?.()) ?? false;
        if (alive) setPersisted(p);
      } catch {
        if (alive) setPersisted(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return persisted;
}

export function Component() {
  const profile = useProfile();
  const meta = useMeta();
  const today = useToday();
  const persisted = usePersisted();
  const { save, status, message } = useSaveBackup();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (profile && name === null) setName(profile.name ?? '');
  }, [profile, name]);

  if (!profile || !meta) return null;

  const changePath = (path: Path) => {
    const sameAsDefault =
      [...profile.trackedSymptoms].sort().join() ===
      [...DEFAULT_SYMPTOMS_BY_PATH[profile.path]].sort().join();
    void saveProfile({
      path,
      ...(sameAsDefault ? { trackedSymptoms: [...DEFAULT_SYMPTOMS_BY_PATH[path]] } : {}),
    });
  };

  const toggleSymptom = (id: SymptomId, on: boolean) => {
    const next = on
      ? [...profile.trackedSymptoms, id]
      : profile.trackedSymptoms.filter((s) => s !== id);
    if (next.length === 0) return;
    void saveProfile({ trackedSymptoms: ALL_SYMPTOMS.filter((s) => next.includes(s)) });
  };

  const lastBackup = meta.lastBackupAt
    ? formatDayMonth(toDayKey(new Date(meta.lastBackupAt)))
    : undefined;
  const registerTime = profile.registerTime ?? '21:30';

  return (
    <Screen title="Ajustes" back="/">
      <Card label="Teu perfil">
        <div className={styles.pilha}>
          <label className={styles.campo}>
            <span className={styles.rotulo}>Como posso te chamar?</span>
            <input
              type="text"
              value={name ?? ''}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => void saveProfile({ name: (name ?? '').trim() || undefined })}
            />
          </label>
          <label className={styles.campo}>
            <span className={styles.rotulo}>Queixa principal</span>
            <select value={profile.path} onChange={(e) => changePath(e.target.value as Path)}>
              {PATH_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card label="Registro do dia">
        <div className={styles.pilha}>
          <p className={styles.rotulo} style={{ margin: 0 }}>
            Sintomas que você acompanha
          </p>
          <CheckList
            label="Sintomas acompanhados"
            items={ALL_SYMPTOMS.map((id) => ({ id, label: SYMPTOM_LABEL[id] }))}
            checked={(id) => profile.trackedSymptoms.includes(id as SymptomId)}
            onToggle={(id, on) => toggleSymptom(id as SymptomId, on)}
          />
          <Switch
            label="Marcadores do ciclo menstrual"
            detail="Mostra os chips Pré-menstrual e Menstruada no registro."
            checked={profile.showCycleTags}
            onChange={(v) => void saveProfile({ showCycleTags: v })}
          />
          <Switch
            label="Registro simples"
            detail="Só o tipo de Bristol e uma linha sobre o dia."
            checked={profile.simpleMode}
            onChange={(v) => void saveProfile({ simpleMode: v })}
          />
        </div>
      </Card>

      <Card label="Meta de água">
        <p>
          {profile.waterGoalMl
            ? `Tua meta: ${formatCompact(profile.waterGoalMl)} ml por dia, em ${COPOS_POR_DIA} copos.`
            : 'Você ainda não calculou a tua meta de água.'}
        </p>
        <div style={{ marginTop: 12 }}>
          <Link to="/ajustes/agua">
            {profile.waterGoalMl ? 'Calcular de novo' : 'Calcular minha meta de água'}
          </Link>
        </div>
      </Card>

      <Card label="Lembretes">
        <div className={styles.pilha}>
          <div className={styles.dupla}>
            <label className={styles.campo}>
              <span className={styles.rotulo}>Horário do registro</span>
              <input
                type="time"
                value={registerTime}
                onChange={(e) =>
                  e.target.value && void saveProfile({ registerTime: e.target.value })
                }
              />
            </label>
            <label className={styles.campo}>
              <span className={styles.rotulo}>Dia da leitura</span>
              <select
                value={profile.readingWeekday}
                onChange={(e) => void saveProfile({ readingWeekday: Number(e.target.value) })}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    {weekdayFullName(d)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <CalendarButtons
            label="Registro do dia, todos os dias"
            event={registroEvent(today, registerTime)}
          />
          <CalendarButtons
            label="Leitura da semana"
            event={leituraEvent(today, profile.readingWeekday, registerTime)}
          />
          <label className={styles.campo}>
            <span className={styles.rotulo}>Dia da revisão do mês</span>
            <select
              value={profile.monthlyReviewDay ?? ''}
              onChange={(e) =>
                void saveProfile({
                  monthlyReviewDay: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">Ainda não escolhi</option>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Dia {d}
                </option>
              ))}
            </select>
          </label>
          {profile.monthlyReviewDay ? (
            <CalendarButtons
              label="Revisão do mês"
              event={revisaoMesEvent(today, profile.monthlyReviewDay, registerTime)}
            />
          ) : null}
        </div>
      </Card>

      <Card label="Aparência">
        <Choice<Theme>
          legend="Tema"
          options={[
            { value: 'auto', label: 'Automático' },
            { value: 'claro', label: 'Claro' },
            { value: 'escuro', label: 'Escuro' },
          ]}
          value={profile.theme}
          onChange={(theme) => void saveProfile({ theme })}
          help="No automático, o app segue o tema do celular."
        />
      </Card>

      <Card label="Cópia de segurança">
        <div className={styles.pilha}>
          <p>
            {lastBackup ? `Última cópia: ${lastBackup}.` : 'Você ainda não salvou nenhuma cópia.'}
          </p>
          <Button
            variant="primary"
            block
            onClick={() => void save()}
            disabled={status === 'salvando'}
          >
            Salvar uma cópia dos meus registros
          </Button>
          <p className={styles.ajuda}>{TEXTO_APOIO_COPIA}</p>
          <p role="status" aria-live="polite" className={styles.ajuda}>
            {message}
          </p>
          <p className={styles.ajuda}>
            Armazenamento protegido:{' '}
            {persisted === undefined
              ? 'verificando'
              : persisted
                ? 'sim, o navegador não apaga sozinho'
                : 'não confirmado pelo navegador. Salve uma cópia de vez em quando.'}
          </p>
        </div>
      </Card>

      <ul className={styles.lista}>
        <Item to="/como-usar" label="Como usar o app" />
        <Item to="/ajustes/restaurar" label="Restaurar uma cópia" />
        <Item to="/ajustes/trocar-celular" label="Trocar de celular" />
        <Item to="/ajustes/circunferencia" label="Circunferência abdominal" detail="Opcional" />
      </ul>

      <Filete level={2}>Ajuda</Filete>
      <ul className={styles.lista}>
        <Item to="/ajustes/instalar" label="Como instalar" />
        <Item to="/ajustes/privacidade" label="Privacidade" />
        <Item to="/guia/avisos" label="Avisos importantes" />
        <Item to="/ajustes/sobre" label="Sobre o app" detail={`Versão ${APP_VERSION}`} />
      </ul>

      <ul className={styles.lista}>
        <Item to="/ajustes/apagar" label="Apagar todos os meus dados" />
      </ul>
    </Screen>
  );
}
