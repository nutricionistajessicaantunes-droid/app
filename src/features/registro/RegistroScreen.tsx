import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { COPOS_POR_DIA, REGISTRO_DIAS_PARA_TRAS } from '../../config';
import { BRISTOL_TEXTOS } from '../../content/bristol';
import { FRASES_DEPOIS_DO_REGISTRO } from '../../content/frases';
import { REGISTRO_TEXTOS, SYMPTOM_LABEL, TAGS } from '../../content/registro';
import { saveProfile } from '../../db/repo';
import { addDays, diffDays, formatDayShort, isValidDayKey } from '../../logic/dates';
import { habitDone } from '../../logic/habits';
import { formatInt } from '../../logic/format';
import { reachedCupGoal, waterGoal } from '../../logic/water';
import type { Bristol, DayRecord, RedFlagId, SymptomId, TagId } from '../../types';
import { useActiveHabits, useDay, useProfile } from '../../app/data';
import { useToday } from '../../app/useToday';
import { BottomSheet } from '../../ui/BottomSheet';
import { BristolPicker, BristolScale } from '../../ui/BristolPicker';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Chip, ChipGroup } from '../../ui/Chip';
import { Choice } from '../../ui/Choice';
import { Counter } from '../../ui/Counter';
import { SavedIndicator } from '../../ui/Misc';
import { ScaleSlider } from '../../ui/ScaleSlider';
import { RedFlagChecklist } from '../alertas/RedFlagChecklist';
import { addRedFlagNotice } from './registroActions';
import styles from './Registro.module.css';
import { useDayDraft, useSavedFlash } from './useDayDraft';

function titleFor(date: string, today: string): string {
  const d = diffDays(today, date);
  if (d === 0) return 'Registro de hoje';
  if (d === 1) return 'Registro de ontem';
  return `Registro de ${formatDayShort(date)}`;
}

export function Component() {
  const params = useParams();
  const today = useToday();
  const raw = params.data;
  const minDate = addDays(today, -REGISTRO_DIAS_PARA_TRAS);
  if (raw && (!isValidDayKey(raw) || raw > today || raw < minDate)) {
    return <Navigate to="/registro" replace />;
  }
  const date = raw ?? today;
  return <Registro date={date} today={today} key={date} />;
}

function Registro({ date, today }: { date: string; today: string }) {
  const navigate = useNavigate();
  const profile = useProfile();
  const habits = useActiveHabits(date);
  const stored = useDay(date);
  const { draft, update, flush, savedAt } = useDayDraft(date, stored);
  const saved = useSavedFlash(savedAt);
  const [bristolSheet, setBristolSheet] = useState(false);
  const [flagSheet, setFlagSheet] = useState(false);
  const [simpleSheet, setSimpleSheet] = useState(false);
  const [missing, setMissing] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  if (!profile || !draft || !habits) return null;

  const simple = profile.simpleMode;
  const minDate = addDays(today, -REGISTRO_DIAS_PARA_TRAS);
  const goal = profile.weightKg ? waterGoal(profile.weightKg) : undefined;
  const hasWaterGoal = Boolean(profile.waterGoalMl);
  const waterHabit = habits.find((h) => h.isWater);
  const tags = TAGS.filter((t) => !t.cycle || profile.showCycleTags);

  const setSymptom = (id: SymptomId, v: number) =>
    update({ symptoms: { ...(draft.symptoms ?? {}), [id]: v } });
  const toggleTag = (id: TagId, on: boolean) => {
    const cur = draft.tags ?? [];
    update({ tags: on ? [...cur, id] : cur.filter((t) => t !== id) });
  };

  const goDay = (n: number) => {
    void flush();
    const target = addDays(date, n);
    navigate(target === today ? '/registro' : `/registro/${target}`, { replace: true });
  };

  const finish = async () => {
    if (draft.evacuated === undefined && !missing) {
      setMissing(true);
      questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      questionRef.current?.querySelector('input')?.focus();
      return;
    }
    await flush();
    const registered = draft.evacuated !== undefined;
    const idx = Math.abs(diffDays(date, '2026-01-01')) % FRASES_DEPOIS_DO_REGISTRO.length;
    navigate('/', { state: registered ? { registrado: FRASES_DEPOIS_DO_REGISTRO[idx] } : null });
  };

  const onRedFlags = (flags: RedFlagId[]) => {
    const before = new Set(draft.redFlags ?? []);
    const added = flags.filter((f) => !before.has(f));
    update({ redFlags: flags.length > 0 ? flags : undefined });
    if (added.length > 0) void addRedFlagNotice(date, added);
  };

  return (
    <main className={styles.tela} id="conteudo">
      <div className={styles.topo}>
        <Link to="/" className={styles.voltar} onClick={() => void flush()}>
          <ChevronLeft size={22} aria-hidden="true" />
          Hoje
        </Link>
        <SavedIndicator visible={saved} />
      </div>

      <header className={styles.cabecalho}>
        <button
          type="button"
          className={styles.seta}
          onClick={() => goDay(-1)}
          disabled={date <= minDate}
          aria-label="Dia anterior"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <h1 className={styles.titulo}>{titleFor(date, today)}</h1>
        <button
          type="button"
          className={styles.seta}
          onClick={() => goDay(1)}
          disabled={date >= today}
          aria-label="Dia seguinte"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </header>

      <div className={styles.blocos}>
        <Card label="Intestino">
          <div ref={questionRef}>
            <Choice
              legend={REGISTRO_TEXTOS.evacuou}
              options={[
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' },
              ]}
              value={draft.evacuated === undefined ? undefined : draft.evacuated ? 'sim' : 'nao'}
              onChange={(v) => {
                setMissing(false);
                update({ evacuated: v === 'sim' });
              }}
            />
          </div>
          {draft.evacuated ? (
            <div className={styles.sub}>
              {!simple ? (
                <Choice
                  legend={REGISTRO_TEXTOS.quantasVezes}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3 ou mais' },
                  ]}
                  value={draft.evacuationCount ? String(draft.evacuationCount) : undefined}
                  onChange={(v) => update({ evacuationCount: Number(v) as 1 | 2 | 3 })}
                />
              ) : null}
              <BristolPicker
                legend={REGISTRO_TEXTOS.comoEstavam}
                help={REGISTRO_TEXTOS.ajudaBristol}
                value={draft.bristol}
                onChange={(t: Bristol) => update({ bristol: t })}
              />
              <Button variant="link" onClick={() => setBristolSheet(true)}>
                {REGISTRO_TEXTOS.comoECadaTipo}
              </Button>
              {!simple ? (
                <ChipGroup label="Como foi">
                  <Chip
                    pressed={Boolean(draft.effort)}
                    onToggle={(on) => update({ effort: on || undefined })}
                  >
                    {REGISTRO_TEXTOS.fizEsforco}
                  </Chip>
                  <Chip
                    pressed={Boolean(draft.incomplete)}
                    onToggle={(on) => update({ incomplete: on || undefined })}
                  >
                    {REGISTRO_TEXTOS.naoEsvaziei}
                  </Chip>
                </ChipGroup>
              ) : null}
            </div>
          ) : null}
        </Card>

        {!simple ? (
          <Card label={REGISTRO_TEXTOS.sintomas}>
            <div className={styles.sliders}>
              {profile.trackedSymptoms.map((id) => (
                <ScaleSlider
                  key={id}
                  label={SYMPTOM_LABEL[id]}
                  value={draft.symptoms?.[id]}
                  onChange={(v) => setSymptom(id, v)}
                />
              ))}
            </div>
            <Button
              onClick={() =>
                update({
                  symptoms: Object.fromEntries(
                    profile.trackedSymptoms.map((id) => [id, 0]),
                  ) as DayRecord['symptoms'],
                })
              }
            >
              {REGISTRO_TEXTOS.semSintomas}
            </Button>
          </Card>
        ) : null}

        {!simple ? (
          <Card label={REGISTRO_TEXTOS.energia}>
            <ScaleSlider
              label="Energia e disposição"
              hideLabel
              value={draft.energy}
              onChange={(v) => update({ energy: v })}
            />
          </Card>
        ) : null}

        {!simple && habits.length > 0 ? (
          <Card label={REGISTRO_TEXTOS.habitos}>
            <ul className={styles.habitos}>
              {habits.map((h) => {
                const done = habitDone(draft as DayRecord, h.id);
                return (
                  <li key={h.id}>
                    <Chip
                      pressed={done}
                      onToggle={(on) => update({ habits: { ...(draft.habits ?? {}), [h.id]: on } })}
                      className={styles.habito}
                    >
                      {h.label}
                    </Chip>
                  </li>
                );
              })}
            </ul>
            <p className={styles.nota}>{REGISTRO_TEXTOS.metaHabitos}</p>
          </Card>
        ) : null}

        {!simple && hasWaterGoal ? (
          <Card label={REGISTRO_TEXTOS.agua}>
            <Counter
              label="Copos de água"
              value={draft.waterCups ?? 0}
              onChange={(n) => {
                const prev = draft.waterCups ?? 0;
                const patch: Partial<DayRecord> = { waterCups: n };
                if (waterHabit && reachedCupGoal(prev, n))
                  patch.habits = { ...(draft.habits ?? {}), [waterHabit.id]: true };
                update(patch);
              }}
              valueText={`${draft.waterCups ?? 0} de ${COPOS_POR_DIA} copos`}
            />
            {goal ? (
              <p className={styles.nota}>Copo de cerca de {formatInt(goal.cupMl)} ml.</p>
            ) : null}
          </Card>
        ) : null}

        <Card label={REGISTRO_TEXTOS.diaEmUmaLinha}>
          <ChipGroup label={REGISTRO_TEXTOS.diaEmUmaLinha}>
            {tags.map((t) => (
              <Chip
                key={t.id}
                pressed={(draft.tags ?? []).includes(t.id)}
                onToggle={(on) => toggleTag(t.id, on)}
              >
                {t.label}
              </Chip>
            ))}
          </ChipGroup>
          <label className={styles.campo}>
            <span className="sr-only">O dia em uma linha, por escrito</span>
            <input
              type="text"
              value={draft.note ?? ''}
              maxLength={200}
              placeholder={REGISTRO_TEXTOS.exemploLinha}
              onChange={(e) => update({ note: e.target.value || undefined })}
            />
          </label>
        </Card>

        <div className={styles.links}>
          <Button variant="link" onClick={() => setFlagSheet(true)}>
            {REGISTRO_TEXTOS.notouAlgo}
          </Button>
          {simple ? (
            <Button variant="link" onClick={() => void saveProfile({ simpleMode: false })}>
              Usar o registro completo
            </Button>
          ) : (
            <Button variant="link" onClick={() => setSimpleSheet(true)}>
              {REGISTRO_TEXTOS.simplificar}
            </Button>
          )}
        </div>

        <div className={styles.final}>
          {missing ? (
            <p className={styles.falta} role="status">
              Para o dia contar como registrado, responda se você evacuou. Se preferir, toque de
              novo para sair assim mesmo.
            </p>
          ) : null}
          <Button variant="primary" block onClick={() => void finish()}>
            {REGISTRO_TEXTOS.pronto}
          </Button>
        </div>
      </div>

      <BottomSheet
        open={bristolSheet}
        onClose={() => setBristolSheet(false)}
        title="Escala de Bristol"
      >
        <p>{BRISTOL_TEXTOS.retrato}</p>
        <BristolScale />
        <p className="secundario">{BRISTOL_TEXTOS.faixas}</p>
        <p className="secundario">{BRISTOL_TEXTOS.padrao}</p>
      </BottomSheet>

      <BottomSheet
        open={flagSheet}
        onClose={() => setFlagSheet(false)}
        title="Notou algo preocupante?"
      >
        <p>Marque o que está acontecendo. A data fica guardada para a ficha da consulta.</p>
        <RedFlagChecklist value={draft.redFlags ?? []} onChange={onRedFlags} />
        <Button variant="primary" block onClick={() => setFlagSheet(false)}>
          Fechar
        </Button>
      </BottomSheet>

      <BottomSheet
        open={simpleSheet}
        onClose={() => setSimpleSheet(false)}
        title="Registro simples"
      >
        <p>{REGISTRO_TEXTOS.textoModoSimples}</p>
        <p className="secundario">
          No registro simples ficam só "Você evacuou?", o tipo de Bristol e o dia em uma linha.
        </p>
        <Button
          variant="primary"
          block
          onClick={() => {
            void saveProfile({ simpleMode: true });
            setSimpleSheet(false);
          }}
        >
          Usar o registro simples
        </Button>
        <Button variant="ghost" block onClick={() => setSimpleSheet(false)}>
          Continuar como está
        </Button>
      </BottomSheet>
    </main>
  );
}
