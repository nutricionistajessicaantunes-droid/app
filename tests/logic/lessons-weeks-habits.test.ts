import { describe, expect, it } from 'vitest';
import { activeHabitsOn, allHabits, waterHabitOn } from '../../src/logic/activeHabits';
import { lessonBadge, lessonState, lessonUrl } from '../../src/logic/lessons';
import { createBlocks } from '../../src/logic/plan';
import { currentFreeWeek, freeWeekEndingOn, lastCompleteWeek, shiftWeek } from '../../src/logic/weeks';
import type { Habit, LessonProgress, PlanState } from '../../src/types';

describe('aulas', () => {
  it('selo por caminho', () => {
    expect(lessonBadge(5, 'preso')).toBe('recomendada');
    expect(lessonBadge(5, 'solto')).toBe('opcional');
    expect(lessonBadge(6, 'solto')).toBe('recomendada');
    expect(lessonBadge(7, 'gases_sii')).toBe('recomendada');
    expect(lessonBadge(12, 'gases_sii')).toBe('recomendada');
    expect(lessonBadge(12, 'refluxo')).toBe('opcional');
    expect(lessonBadge(8, 'refluxo')).toBe('recomendada');
    expect(lessonBadge(5, 'indefinido')).toBeUndefined();
    expect(lessonBadge(1, 'preso')).toBeUndefined();
  });

  it('estado da aula', () => {
    const p = (over: Partial<LessonProgress>): LessonProgress => ({
      lessonId: 1,
      watched: false,
      task: { status: 'nao_iniciada', data: {} },
      updatedAt: '',
      ...over,
    });
    expect(lessonState(undefined)).toBe('nao_assistida');
    expect(lessonState(p({}))).toBe('nao_assistida');
    expect(lessonState(p({ watched: true }))).toBe('assistida');
    expect(lessonState(p({ task: { status: 'em_andamento', data: {} } }))).toBe('tarefa_em_andamento');
    expect(lessonState(p({ task: { status: 'concluida', data: {} } }))).toBe('tarefa_concluida');
  });

  it('link da aula: da aula, da área de membros ou nenhum', () => {
    expect(lessonUrl(3, { 3: 'https://k/aula3' }, 'https://k/area')).toBe('https://k/aula3');
    expect(lessonUrl(4, { 3: 'https://k/aula3' }, 'https://k/area')).toBe('https://k/area');
    expect(lessonUrl(4, { 4: '  ' }, '')).toBeUndefined();
  });
});

describe('semanas', () => {
  it('semana livre termina no dia da leitura (domingo: de segunda a domingo)', () => {
    expect(freeWeekEndingOn('2026-11-08')).toEqual({ start: '2026-11-02', end: '2026-11-08' });
    expect(currentFreeWeek('2026-11-04', 0)).toEqual({ start: '2026-11-02', end: '2026-11-08' });
    expect(currentFreeWeek('2026-11-08', 0)).toEqual({ start: '2026-11-02', end: '2026-11-08' });
    expect(currentFreeWeek('2026-11-04', 3)).toEqual({ start: '2026-10-29', end: '2026-11-04' });
    expect(shiftWeek({ start: '2026-11-02', end: '2026-11-08' }, -1)).toEqual({ start: '2026-10-26', end: '2026-11-01' });
    expect(lastCompleteWeek('2026-11-04')).toEqual({ start: '2026-10-28', end: '2026-11-03' });
  });
});

describe('hábitos ativos', () => {
  const plan: PlanState = {
    id: 'plan',
    status: 'ativo',
    semanaZero: {},
    day1: '2026-11-02',
    blocks: createBlocks('2026-11-02'),
    updatedAt: '',
  };
  const stored: Habit[] = [
    { id: 'c1', label: 'Ciclo', source: 'ciclo', activeFrom: '2026-11-03' },
    { id: 'a5', label: 'Linhaça', source: 'aula5', activeFrom: '2026-11-03', activeTo: '2026-11-09', isWater: false },
    { id: 'm1', label: 'Água', source: 'plano_minimo', activeFrom: '2026-12-01', isWater: true },
  ];

  it('junta plano e hábitos guardados, na ordem certa', () => {
    expect(allHabits(plan, stored)).toHaveLength(9);
    expect(activeHabitsOn('2026-11-04', plan, stored).map((h) => h.id)).toEqual(['p1', 'p2', 'a5', 'c1']);
    expect(activeHabitsOn('2026-11-10', plan, stored).map((h) => h.id)).toEqual(['p1', 'p2', 'p3', 'p4', 'c1']);
    expect(activeHabitsOn('2026-11-04', undefined, []).length).toBe(0);
  });

  it('hábito de água do dia', () => {
    expect(waterHabitOn('2026-11-04', plan, stored)?.id).toBe('p1');
    expect(waterHabitOn('2026-12-02', undefined, stored)?.id).toBe('m1');
    expect(waterHabitOn('2026-11-04', undefined, stored)).toBeUndefined();
  });
});
