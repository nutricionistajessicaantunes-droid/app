import type { MealId } from '../../content/agua-fibras';
import { getMeta, updateMeta } from '../../db/repo';
import { cleanPantry } from '../../logic/meals';
import type { Meta } from '../../types';

/** Marca ou desmarca um ingrediente em "tenho em casa". */
export async function togglePantry(id: string, on: boolean): Promise<void> {
  const meta = await getMeta();
  const current = new Set(cleanPantry(meta.pantry));
  if (on) current.add(id);
  else current.delete(id);
  await updateMeta({ pantry: [...current] });
}

export async function clearPantry(): Promise<void> {
  await updateMeta({ pantry: [] });
}

export async function setMealFilters(patch: NonNullable<Meta['mealFilters']>): Promise<void> {
  const meta = await getMeta();
  await updateMeta({ mealFilters: { ...(meta.mealFilters ?? {}), ...patch } });
}

/** Coloca (ou tira, com undefined) uma receita numa refeição do dia. */
export async function setDayMeal(slot: MealId, recipeId: string | undefined): Promise<void> {
  const meta = await getMeta();
  const next = { ...(meta.myDay ?? {}) };
  if (recipeId) next[slot] = recipeId;
  else delete next[slot];
  await updateMeta({ myDay: next });
}

export async function clearDay(): Promise<void> {
  await updateMeta({ myDay: {} });
}
