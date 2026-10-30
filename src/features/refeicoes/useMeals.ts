import { useMemo } from 'react';
import { useFodmap, useMeta, useProfile } from '../../app/data';
import { cleanPantry, lowFodmapReason, menuForPath, type MealFilters } from '../../logic/meals';

/** Tudo que as telas de refeições precisam: a lista de casa, os filtros e o contexto. */
export function useMeals() {
  const meta = useMeta();
  const profile = useProfile();
  const fodmap = useFodmap();
  return useMemo(() => {
    if (meta === undefined || profile === undefined || fodmap === undefined) return undefined;
    const reason = lowFodmapReason(profile, fodmap);
    const saved = meta.mealFilters ?? {};
    const filters: MealFilters = {
      semLactose: Boolean(saved.semLactose),
      semGluten: Boolean(saved.semGluten),
      vegetariano: Boolean(saved.vegetariano),
      baixoFodmap: saved.baixoFodmap ?? Boolean(reason),
    };
    return {
      pantry: new Set(cleanPantry(meta.pantry)),
      filters,
      lowReason: reason,
      lowContext: Boolean(reason),
      menu: menuForPath(profile?.path),
      path: profile?.path,
      waterGoalMl: profile?.waterGoalMl,
      myDay: meta.myDay ?? {},
    };
  }, [meta, profile, fodmap]);
}
