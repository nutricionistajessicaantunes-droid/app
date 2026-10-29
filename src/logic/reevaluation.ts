import {
  MIN_DIAS_LEITURA,
  REAV_ENERGIA_SUBIU,
  REAV_ESFORCO_CAIU,
  REAV_HABITOS_BAIXOS,
  REAV_QUEDA_SINTOMA,
  REAV_SINTOMA_BAIXO,
} from '../config';
import type { Bristol, DayKey, DayRecord, PlanBlock, PlanState, Profile, Scenario } from '../types';
import { modesDistanceTo4, modesHealthy } from './bristol';
import { daysBetween } from './dates';
import type { ActiveHabit } from './habits';
import { blockEnd, s1Block, s2Block, s3Block } from './plan';
import { indexByDate } from './records';
import { average } from './symptoms';
import { averageHabitDays, summarizeWeek } from './week';

/** Reavaliação do dia 21 (seções 6.9, 7.7 e 7.8). */

export interface ReevalWeek {
  start: DayKey;
  end: DayKey;
  registeredDays: number;
  weak: boolean;
  modes: Bristol[];
  evacuations: number;
  effortDays: number;
  incompleteDays: number;
  /** Dias com esforço ou evacuação incompleta (sinal "esforço caiu"). */
  effortOrIncompleteDays: number;
  symptomAverage?: number;
  energyAverage?: number;
  habitAverage?: number;
}

export function reevalWeek(records: DayRecord[], habits: ActiveHabit[], block: PlanBlock): ReevalWeek {
  const start = block.start;
  const end = blockEnd(block);
  const s = summarizeWeek({ records, habits, start, end });
  const map = indexByDate(records);
  const effortOrIncompleteDays = daysBetween(start, end).filter((d) => {
    const r = map.get(d);
    return r?.evacuated === true && (r.effort === true || r.incomplete === true);
  }).length;
  return {
    start,
    end,
    registeredDays: s.registeredDays,
    weak: s.registeredDays < MIN_DIAS_LEITURA,
    modes: s.bristol.modes,
    evacuations: s.evacuations.total,
    effortDays: s.effortDays,
    incompleteDays: s.incompleteDays,
    effortOrIncompleteDays,
    symptomAverage: s.symptomAverage,
    energyAverage: s.energyAverage,
    habitAverage: averageHabitDays(s.habits),
  };
}

export interface ScenarioInput {
  modes: Bristol[];
  symptomAverage?: number;
  energyAverage?: number;
  effortOrIncompleteDays?: number;
}

export interface ScenarioSignals {
  bristolMelhorou: boolean;
  bristolSaudavelS3: boolean;
  s1Saudavel: boolean;
  sintomasCairam: boolean;
  sintomasBaixosS3: boolean;
  energiaSubiu: boolean;
  esforcoCaiu: boolean;
}

const EPS = 1e-9;

/** Sinais da seção 7.8. Sinal sem dado conta como falso. */
export function scenarioSignals(s1: ScenarioInput, s3: ScenarioInput): ScenarioSignals {
  const s1Saudavel = modesHealthy(s1.modes);
  const bristolSaudavelS3 = modesHealthy(s3.modes);
  const d1 = modesDistanceTo4(s1.modes);
  const d3 = modesDistanceTo4(s3.modes);
  const both = (a?: number, b?: number): a is number => a !== undefined && b !== undefined;
  return {
    s1Saudavel,
    bristolSaudavelS3,
    bristolMelhorou:
      (s1.modes.length > 0 && !s1Saudavel && bristolSaudavelS3) ||
      (d1 !== undefined && d3 !== undefined && d3 < d1 - EPS),
    sintomasCairam:
      both(s1.symptomAverage, s3.symptomAverage) &&
      s1.symptomAverage - (s3.symptomAverage as number) >= REAV_QUEDA_SINTOMA - EPS,
    sintomasBaixosS3:
      s3.symptomAverage !== undefined && s3.symptomAverage <= REAV_SINTOMA_BAIXO + EPS,
    energiaSubiu:
      both(s3.energyAverage, s1.energyAverage) &&
      s3.energyAverage - (s1.energyAverage as number) >= REAV_ENERGIA_SUBIU - EPS,
    esforcoCaiu:
      both(s1.effortOrIncompleteDays, s3.effortOrIncompleteDays) &&
      s1.effortOrIncompleteDays - (s3.effortOrIncompleteDays as number) >= REAV_ESFORCO_CAIU,
  };
}

export function suggestScenario(s1: ScenarioInput, s3: ScenarioInput): Scenario {
  const s = scenarioSignals(s1, s3);
  const sintomasOk = s3.symptomAverage === undefined || s.sintomasBaixosS3;
  if (s.bristolSaudavelS3 && sintomasOk && (s.bristolMelhorou || s.sintomasCairam || s.s1Saudavel))
    return 'bastante';
  if (!s.bristolMelhorou && !s.sintomasCairam && !s.energiaSubiu && !s.esforcoCaiu)
    return 'nao_mudou';
  return 'em_parte';
}

export interface ReevalResult {
  s1?: ReevalWeek;
  s2?: ReevalWeek;
  s3?: ReevalWeek;
  /** Média de dias cumpridos por hábito nas semanas 1, 2 e 3. */
  habitAverage?: number;
  /** Média abaixo de 4 dias: o plano ainda não foi testado (aula 17). */
  notTested: boolean;
  /** Saiu do tipo 1 ou 2 para o 3 ou 4. */
  bigBristolChange: boolean;
  abdominal?: { first: { date: DayKey; cm: number }; last: { date: DayKey; cm: number } };
  suggested: Scenario;
}

function scenarioInput(w: ReevalWeek | undefined): ScenarioInput {
  return {
    modes: w?.modes ?? [],
    symptomAverage: w?.symptomAverage,
    energyAverage: w?.energyAverage,
    effortOrIncompleteDays: w && w.registeredDays > 0 ? w.effortOrIncompleteDays : undefined,
  };
}

/** S1 = primeiro bloco do tema 1, S3 = último do tema 3; só os hábitos do plano contam. */
export function computeReevaluation(
  plan: PlanState,
  records: DayRecord[],
  habits: ActiveHabit[],
  profile?: Pick<Profile, 'abdominal'>,
): ReevalResult {
  const planOnly = habits.filter((h) => h.source === 'plano');
  const week = (b: PlanBlock | undefined) => (b ? reevalWeek(records, planOnly, b) : undefined);
  const s1 = week(s1Block(plan.blocks));
  const s2 = week(s2Block(plan.blocks));
  const s3 = week(s3Block(plan.blocks));
  const habitAverage = average(
    [s1, s2, s3].map((w) => w?.habitAverage).filter((n): n is number => n !== undefined),
  );
  const ab = [...(profile?.abdominal ?? [])].sort((a, b) => (a.date < b.date ? -1 : 1));
  const first = ab[0];
  const last = ab[ab.length - 1];
  return {
    s1,
    s2,
    s3,
    habitAverage,
    notTested: habitAverage !== undefined && habitAverage < REAV_HABITOS_BAIXOS - EPS,
    bigBristolChange:
      !!s1 &&
      !!s3 &&
      s1.modes.length > 0 &&
      s1.modes.every((m) => m <= 2) &&
      s3.modes.length > 0 &&
      s3.modes.every((m) => m === 3 || m === 4),
    abdominal: first && last && ab.length >= 2 ? { first, last } : undefined,
    suggested: suggestScenario(scenarioInput(s1), scenarioInput(s3)),
  };
}
