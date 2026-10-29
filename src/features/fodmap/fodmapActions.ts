import { getDb } from '../../db/index';
import { nowIso } from '../../db/repo';
import { addDays, diffDays } from '../../logic/dates';
import { pauseEnd, planTests } from '../../logic/fodmap';
import type {
  DayKey,
  FodmapGroup,
  FodmapProtocol,
  FodmapResult,
  FodmapSuggestion,
} from '../../types';
import { concludeTask } from '../processo/actions';

/** Ações do protocolo low FODMAP (seção 6.13). */

async function current(): Promise<FodmapProtocol> {
  return (
    (await getDb().fodmap.get('fodmap')) ?? {
      id: 'fodmap',
      phase: 'planejamento',
      tests: [],
      updatedAt: nowIso(),
    }
  );
}

export async function saveProtocol(patch: Partial<FodmapProtocol>): Promise<void> {
  const p = await current();
  await getDb().fodmap.put({ ...p, ...patch, id: 'fodmap', updatedAt: nowIso() });
}

export async function acknowledgeCare(): Promise<void> {
  await saveProtocol({ acknowledgedCare: true });
}

export async function savePlanning(input: {
  phase1Start: DayKey;
  evaluationDate: DayKey;
  foods: Partial<Record<FodmapGroup, string>>;
  preparations: Record<string, boolean>;
}): Promise<void> {
  await saveProtocol({
    phase: 'fase1',
    phase1Start: input.phase1Start,
    evaluationDate: input.evaluationDate,
    preparations: input.preparations,
    tests: planTests(input.foods),
    baseline: undefined,
    responded: undefined,
  });
  await concludeTask(12);
}

/** Resposta da avaliação da fase 1. */
export async function answerPhase1(
  responded: boolean,
  today: DayKey,
  baseline: number | undefined,
): Promise<void> {
  const p = await current();
  if (responded) {
    await saveProtocol({ phase: 'fase2', responded: true, baseline });
    return;
  }
  const weeks4 = p.phase1Start ? diffDays(today, p.phase1Start) >= 27 : true;
  if (weeks4) await saveProtocol({ phase: 'encerrado', responded: false, baseline });
  else if (p.phase1Start) await saveProtocol({ evaluationDate: addDays(p.phase1Start, 27) });
}

async function updateTest(
  index: number,
  fn: (t: FodmapProtocol['tests'][number]) => FodmapProtocol['tests'][number],
) {
  const p = await current();
  const tests = p.tests.map((t, i) => (i === index ? fn(t) : t));
  const allDone = tests.length > 0 && tests.every((t) => t.result);
  await saveProtocol({ tests, phase: allDone ? 'fase3' : p.phase });
}

export async function startTest(index: number, today: DayKey): Promise<void> {
  await updateTest(index, (t) => ({
    ...t,
    start: today,
    notBefore: undefined,
    days: t.days.map((d) => ({ portion: d.portion })),
  }));
}

export async function setAtypical(index: number, day: number, value: boolean): Promise<void> {
  await updateTest(index, (t) => ({
    ...t,
    days: t.days.map((d, i) => (i === day ? { ...d, atypical: value || undefined } : d)),
  }));
}

export async function setPauseDays(index: number, pauseDays: 2 | 3): Promise<void> {
  await updateTest(index, (t) => ({ ...t, pauseDays }));
}

export async function concludeTest(
  index: number,
  result: FodmapResult,
  baseline: number | undefined,
  suggested: FodmapSuggestion,
): Promise<void> {
  await updateTest(index, (t) => ({ ...t, result, baseline, suggested }));
}

/** Inconclusivo: repete o mesmo grupo depois da pausa. */
export async function repeatTest(index: number): Promise<void> {
  await updateTest(index, (t) => {
    const end = pauseEnd(t);
    return {
      ...t,
      start: undefined,
      notBefore: end ? addDays(end, 1) : undefined,
      days: t.days.map((d) => ({ portion: d.portion })),
    };
  });
}

export async function resetProtocol(): Promise<void> {
  const p = await current();
  await getDb().fodmap.put({
    id: 'fodmap',
    phase: 'planejamento',
    acknowledgedCare: p.acknowledgedCare,
    tests: [],
    updatedAt: nowIso(),
  });
}
