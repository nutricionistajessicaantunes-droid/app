import { describe, expect, it } from 'vitest';
import {
  automaticNotices,
  constantAlternation,
  constipationNotResponding,
  dailyBloating,
  noEvacuationRun,
  persistentDiarrhea,
} from '../../src/logic/checks';
import { addDays, daysBetween } from '../../src/logic/dates';
import { classifyFood, searchFodmap, suggestFoods } from '../../src/logic/fodmapLookup';
import { findPatterns, rateText } from '../../src/logic/patterns';
import { createBlocks, planHabits } from '../../src/logic/plan';
import { computeReevaluation, scenarioSignals, suggestScenario } from '../../src/logic/reevaluation';
import { findSuspects, foodsBeforeSymptoms, suspectContext } from '../../src/logic/suspects';
import {
  aula11Combinations,
  aula1Days,
  aula1Highlights,
  aula2Result,
  aula4Result,
  aula8Foods,
  dailyTaskIds,
  habitsTaskResult,
  isTaskActiveOn,
  isTaskResultReady,
  otherRunningTask,
  taskProgress,
  taskWindow,
  TASK_FIELD,
} from '../../src/logic/tasks';
import type { DayRecord, DiaryEntry, LessonProgress, PlanState } from '../../src/types';
import { rec, week } from '../helpers';

const D1 = '2026-11-02';
const lesson = (lessonId: number, over: Partial<LessonProgress['task']> = {}): LessonProgress => ({
  lessonId,
  watched: true,
  task: { status: 'em_andamento', startDate: D1, data: {}, ...over },
  updatedAt: '',
});

describe('cenário (seção 7.15)', () => {
  it('melhorou bastante', () => {
    expect(
      suggestScenario(
        { modes: [2], symptomAverage: 6.1, energyAverage: 4, effortOrIncompleteDays: 5 },
        { modes: [4], symptomAverage: 2.5, energyAverage: 6.5, effortOrIncompleteDays: 1 },
      ),
    ).toBe('bastante');
  });
  it('não mudou quase nada', () => {
    expect(
      suggestScenario(
        { modes: [2], symptomAverage: 6, energyAverage: 5, effortOrIncompleteDays: 3 },
        { modes: [2], symptomAverage: 5.5, energyAverage: 5, effortOrIncompleteDays: 3 },
      ),
    ).toBe('nao_mudou');
  });
  it('melhorou em parte', () => {
    expect(suggestScenario({ modes: [2], symptomAverage: 6 }, { modes: [4], symptomAverage: 5 })).toBe('em_parte');
  });
  it('sem dado o sinal é falso; S1 já saudável conta para "bastante"', () => {
    expect(suggestScenario({ modes: [] }, { modes: [] })).toBe('nao_mudou');
    expect(suggestScenario({ modes: [4], symptomAverage: 2 }, { modes: [4], symptomAverage: 2 })).toBe('bastante');
    expect(scenarioSignals({ modes: [1] }, { modes: [2] }).bristolMelhorou).toBe(true);
    expect(scenarioSignals({ modes: [6] }, { modes: [6] }).bristolMelhorou).toBe(false);
  });
});

describe('reavaliação com registros', () => {
  const plan: PlanState = { id: 'plan', status: 'ativo', semanaZero: {}, day1: D1, blocks: createBlocks(D1), updatedAt: '' };
  const s1 = week(D1, Array.from({ length: 7 }, (_, i) => ({ evacuated: true, bristol: 2 as const, effort: i < 5, symptoms: { estufamento: 6 }, energy: 4, habits: { p1: i < 3, p2: i < 4 } })));
  const s3 = week(addDays(D1, 14), Array.from({ length: 7 }, (_, i) => ({ evacuated: true, bristol: 4 as const, effort: i < 1, symptoms: { estufamento: 2 }, energy: 7, habits: { p1: true, p2: true, p3: true, p4: true, p5: i < 5, p6: i < 5 } })));
  it('compara S1 e S3, calcula a média de hábitos e sugere o cenário', () => {
    const r = computeReevaluation(plan, [...s1, ...s3], planHabits(plan), {
      abdominal: [{ date: addDays(D1, 20), cm: 81 }, { date: D1, cm: 84 }],
    });
    expect(r.s1?.modes).toEqual([2]);
    expect(r.s3?.modes).toEqual([4]);
    expect(r.s1?.effortOrIncompleteDays).toBe(5);
    expect(r.s1?.habitAverage).toBe(3.5);
    expect(r.s2?.registeredDays).toBe(0);
    expect(r.bigBristolChange).toBe(true);
    expect(r.suggested).toBe('bastante');
    expect(r.abdominal).toEqual({ first: { date: D1, cm: 84 }, last: { date: addDays(D1, 20), cm: 81 } });
    expect(r.notTested).toBe(true); // semana 2 sem registro: média (3,5 + 0 + 6,33) / 3
  });
});

describe('tarefas das aulas', () => {
  it('prazo, dia X de Y e resultado', () => {
    const p = lesson(1);
    expect(taskWindow(p)).toEqual({ start: D1, end: addDays(D1, 2), days: 3 });
    expect(isTaskActiveOn(p, addDays(D1, 2))).toBe(true);
    expect(isTaskActiveOn(p, addDays(D1, 3))).toBe(false);
    expect(isTaskResultReady(p, addDays(D1, 3))).toBe(true);
    expect(taskProgress(p, addDays(D1, 1))).toEqual({ day: 2, total: 3 });
    expect(taskWindow(lesson(6))).toBeUndefined();
    expect(isTaskActiveOn(lesson(1, { status: 'pausada' }), D1)).toBe(false);
  });
  it('campos diários e aviso de tarefa simultânea', () => {
    const lessons = [lesson(3), lesson(1), lesson(6), lesson(5, { status: 'pausada' })];
    expect(dailyTaskIds(lessons, D1)).toEqual([1]); // a aula 3 usa o próprio registro do dia
    expect(otherRunningTask(lessons, 4, D1)).toBe(3);
    expect(otherRunningTask([lesson(4)], 4, D1)).toBeUndefined();
  });
  it('aula 1: o que se repetiu', () => {
    const records = week(D1, [
      { evacuated: false, taskFields: { [TASK_FIELD.sono]: 5, [TASK_FIELD.estresse]: 8, [TASK_FIELD.comi]: 'pão, café' } },
      { evacuated: true, bristol: 2, taskFields: { [TASK_FIELD.sono]: 5.5, [TASK_FIELD.estresse]: 7, [TASK_FIELD.comi]: 'pão e arroz' } },
      { evacuated: false, taskFields: { [TASK_FIELD.sono]: 8, [TASK_FIELD.estresse]: 3 } },
    ]);
    const w = taskWindow(lesson(1))!;
    expect(aula1Highlights(aula1Days(records, w))).toEqual([
      'Sono abaixo de 6 horas em 2 dias.',
      'Estresse 7 ou mais em 2 dias.',
      '2 dias sem evacuar.',
      'No que você comeu, apareceu em mais de um dia: pão.',
    ]);
  });
  it('aulas 2, 4, 5, 8 e 11', () => {
    const w3 = taskWindow(lesson(2))!;
    const r2 = week(D1, [
      { evacuated: true, bristol: 3, taskFields: { [TASK_FIELD.sentei]: true } },
      { evacuated: false, taskFields: { [TASK_FIELD.sentei]: true } },
      { evacuated: true, bristol: 4, taskFields: { [TASK_FIELD.sentei]: false } },
    ]);
    expect(aula2Result(r2, w3)).toEqual({ total: 3, satDays: 2, evacuatedDays: 2, types: [3, 4] });

    const w7 = taskWindow(lesson(4))!;
    const r4 = week(D1, [
      { evacuated: true, bristol: 3, taskFields: { [TASK_FIELD.fibra]: 'Aveia em flocos' } },
      { evacuated: true, bristol: 4, taskFields: { [TASK_FIELD.fibra]: 'Aveia em flocos' } },
      { evacuated: false, taskFields: { [TASK_FIELD.fibra]: 'Kiwi' } },
    ]);
    expect(aula4Result(r4, w7, ['Aveia em flocos', 'Kiwi', 'Chia'])).toEqual([
      { fiber: 'Aveia em flocos', days: 2, types: [3, 4] },
      { fiber: 'Kiwi', days: 1, types: [] },
      { fiber: 'Chia', days: 0, types: [] },
    ]);

    const habits = [
      { id: 'a', label: 'Água', source: 'aula5', activeFrom: D1, activeTo: addDays(D1, 6) },
      { id: 'b', label: 'Linhaça', source: 'aula5', activeFrom: D1, activeTo: addDays(D1, 6) },
    ];
    const r5 = week(D1, [{ habits: { a: true, b: true }, evacuated: true, bristol: 4 }, { habits: { b: true } }]);
    const res5 = habitsTaskResult(r5, w7, habits);
    expect(res5.modes).toEqual([4]);
    expect(res5.easiest?.label).toBe('Linhaça');
    expect(res5.stats.map((s) => s.done)).toEqual([1, 2]);

    const r8 = week(D1, [
      { taskFields: { [TASK_FIELD.teveSintoma]: true, [TASK_FIELD.comiAntes]: 'Café; pão' } },
      { taskFields: { [TASK_FIELD.teveSintoma]: true, [TASK_FIELD.comiAntes]: 'café e bolo' } },
      { taskFields: { [TASK_FIELD.teveSintoma]: false, [TASK_FIELD.comiAntes]: 'pão' } },
    ]);
    expect(aula8Foods(r8, w7).map((f) => [f.label, f.days])).toEqual([['café', 2]]);

    expect(
      aula11Combinations([
        { date: D1, prebiotico: 'Aveia', fermentado: 'Kefir' },
        { date: D1, prebiotico: 'Aveia', fermentado: 'Kefir' },
        { date: D1, prebiotico: 'Kiwi' },
        { date: D1 },
      ]),
    ).toEqual([
      { label: 'Aveia + Kefir', days: 2 },
      { label: 'Kiwi', days: 1 },
    ]);
  });
});

describe('lista de FODMAPs e suspeitos (seções 7.10 e 7.11)', () => {
  it('classifica pelo nome do caderno, sem acento e no plural', () => {
    expect(classifyFood('Maçãs')).toMatchObject({ name: 'maçã', level: 'alto', categoryId: 'frutas' });
    expect(classifyFood('banana verde')).toMatchObject({ name: 'banana mais verde', level: 'baixo' });
    expect(classifyFood('xyz')).toBeUndefined();
    expect(suggestFoods('ma')).toContain('maçã');
    expect(suggestFoods('m')).toEqual([]);
    expect(searchFodmap('kiwi').map((e) => e.name)).toContain('kiwi');
  });

  it('alimentos que aparecem antes de sintoma em 2 dias diferentes', () => {
    const e = (id: string, date: string, time: string, data: Partial<DiaryEntry>): DiaryEntry => ({
      id, date, time, kind: 'refeicao', createdAt: '', updatedAt: '', ...data,
    });
    const entries: DiaryEntry[] = [
      e('1', D1, '08:00', { foods: ['maçã', 'pão'] }),
      e('2', D1, '10:00', { kind: 'sintoma', symptom: { type: 'estufamento', intensity: 5 } }),
      e('3', addDays(D1, 1), '12:00', { text: 'Maçãs e arroz' }),
      e('4', addDays(D1, 1), '15:00', { kind: 'sintoma', symptom: { type: 'gases', intensity: 6 } }),
      e('5', addDays(D1, 2), '12:00', { foods: ['maçã', 'arroz'] }),
      e('6', addDays(D1, 2), '20:00', { kind: 'sintoma', symptom: { type: 'dor', intensity: 7 } }),
    ];
    const s = findSuspects(entries);
    expect(s.map((x) => [x.label, x.days, x.timesBefore, x.timesEaten])).toEqual([['maçã', 2, 2, 3]]);
    expect(s[0]?.fodmap?.level).toBe('alto');
    expect(suspectContext(s[0]!)).toBe('apareceu antes de sintoma em 2 das 3 vezes em que você comeu');
  });

  it('"o que comi antes": itens em 2 dias com sintoma', () => {
    const r = foodsBeforeSymptoms([
      { date: D1, symptom: true, text: 'pão, café' },
      { date: addDays(D1, 1), symptom: true, text: 'pães e leite' },
      { date: addDays(D1, 2), symptom: false, text: 'pão' },
    ]);
    expect(r.map((x) => [x.key, x.days])).toEqual([['pao', 2]]);
  });
});

describe('padrões que costumam aparecer (seção 7.6)', () => {
  const start = D1;
  const lento = new Set([1, 6, 11, 3, 13]);
  const records: DayRecord[] = daysBetween(start, addDays(start, 21)).map((d, i) =>
    rec(d, {
      evacuated: !lento.has(i),
      bristol: lento.has(i) ? undefined : 4,
      tags: [0, 5, 10, 15].includes(i) ? ['dormi_mal'] : [],
    }),
  );
  it('noite mal dormida com o texto do caderno e os números da aluna', () => {
    const p = findPatterns(records, addDays(start, 21)).find((x) => x.id === 'noite_mal_dormida');
    expect(p?.text).toBe(
      'Noite mal dormida: o intestino trava, às vezes com 1 ou 2 dias de atraso. Nos teus registros, isso aconteceu depois de 3 das 4 noites mal dormidas. Nos outros dias, em 1 de cada 5.',
    );
  });
  it('precisa de 14 dias registrados', () => {
    expect(findPatterns(records.slice(0, 13), addDays(start, 12))).toEqual([]);
  });
  it('proporções em texto', () => {
    expect(rateText(2, 10)).toBe('em 1 de cada 5');
    expect(rateText(1, 3)).toBe('em 1 de cada 3');
    expect(rateText(2, 3)).toBe('em 2 de 3');
    expect(rateText(3, 10)).toBe('em 3 de 10');
    expect(rateText(0, 5)).toBe('nenhuma vez');
  });
  it('semana de estresse compara a nota média', () => {
    const r = daysBetween(start, addDays(start, 13)).map((d, i) =>
      rec(d, { evacuated: true, bristol: 4, symptoms: { dor: i < 3 ? 7 : 2 }, tags: i < 3 ? ['estresse_alto'] : [] }),
    );
    expect(findPatterns(r, addDays(start, 13)).find((p) => p.id === 'estresse')?.text).toContain('7,0 nos dias de estresse alto e 2,0 nos outros dias');
  });
});

describe('verificações automáticas (seção 7.13)', () => {
  const today = addDays(D1, 13);
  const days = daysBetween(D1, today);
  it('diarreia por mais de duas semanas', () => {
    const r = days.map((d, i) => rec(d, i % 3 === 0 ? { evacuated: false } : { evacuated: true, bristol: 6 }));
    expect(persistentDiarrhea(r, today)).toBe(true);
    expect(persistentDiarrhea(r.slice(5), today)).toBe(false);
    expect(persistentDiarrhea([...r.slice(0, -1), rec(today, { evacuated: true, bristol: 4 })], today)).toBe(false);
  });
  it('estufamento diário e alternância por duas semanas', () => {
    const r = days.map((d, i) => rec(d, { evacuated: true, bristol: i % 7 === 0 ? 2 : i % 7 === 1 ? 7 : 4, symptoms: { estufamento: i % 7 === 3 ? 1 : 5 } }));
    expect(dailyBloating(r, today)).toBe(true);
    expect(constantAlternation(r, today)).toBe(true);
    expect(dailyBloating(r.slice(7), today)).toBe(false);
    expect(constantAlternation(r.slice(7), today)).toBe(false);
  });
  it('preso que não responde e avisos automáticos com pausa depois de "Entendi"', () => {
    const plan: PlanState = { id: 'plan', status: 'concluido', semanaZero: {}, blocks: createBlocks(D1), reevaluation: { computedAt: '', chosen: 'nao_mudou' }, updatedAt: '' };
    const r = daysBetween(addDays(D1, 14), addDays(D1, 20)).map((d) => rec(d, { evacuated: true, bristol: 2 }));
    expect(constipationNotResponding({ path: 'preso' }, plan, r)).toBe(true);
    expect(constipationNotResponding({ path: 'solto' }, plan, r)).toBe(false);
    const drafts = automaticNotices({ records: r, today: addDays(D1, 21), profile: { path: 'preso' }, plan, notices: [] });
    expect(drafts.map((d) => d.id)).toEqual(['auto-preso_nao_responde', 'auto-sintomas_persistem']);
    const dismissed = [{ id: 'auto-sintomas_persistem', kind: 'acompanhamento' as const, reason: 'sintomas_persistem', detectedAt: D1, dismissedAt: new Date(2026, 10, 20).toISOString(), updatedAt: '' }];
    expect(automaticNotices({ records: [], today: '2026-11-25', profile: { path: 'solto' }, plan, notices: dismissed })).toEqual([]);
    expect(automaticNotices({ records: [], today: '2026-12-10', profile: { path: 'solto' }, plan, notices: dismissed }).length).toBe(1);
  });
  it('três dias registrados seguidos sem evacuar', () => {
    const r = week(D1, [{ evacuated: false }, { evacuated: false }, { evacuated: false }]);
    expect(noEvacuationRun(r, addDays(D1, 3))).toEqual({ start: D1, days: 3 });
    expect(noEvacuationRun(r, addDays(D1, 2))).toEqual({ start: D1, days: 3 });
    expect(noEvacuationRun([...r, rec(addDays(D1, 3), { evacuated: true, bristol: 4 })], addDays(D1, 3))).toBeUndefined();
    expect(noEvacuationRun(r.slice(1), addDays(D1, 3))).toBeUndefined();
  });
});
