import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { createBlocks } from '../src/logic/plan';
import {
  clearStore,
  day,
  HOJE,
  META,
  profile,
  readStore,
  seed,
  setClock,
  tapSlider,
} from './helpers';

test.beforeEach(async ({ page }) => {
  await setClock(page, HOJE);
});

test('1. primeira vez completa, com o código pelo link, até a tela Hoje', async ({
  page,
}, info) => {
  await page.goto('/?acesso=NAPRATICA');
  if (info.project.name === 'iphone-13') {
    await page.getByRole('button', { name: 'Usar no navegador mesmo assim' }).click();
    await page.getByRole('button', { name: 'Continuar no navegador' }).click();
  } else {
    await page.getByRole('button', { name: 'Agora não' }).click();
  }
  await page.getByRole('button', { name: 'Começar' }).click();
  await page.getByRole('button', { name: 'Pular' }).click();
  await page.getByText('Intestino preso', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('Nenhum destes').click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByText('Estou começando').click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Ir para Hoje' }).click();
  await expect(page.getByRole('heading', { name: 'Oi' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Registrar meu dia' })).toBeVisible();
});

test('2. dia típico da semana 1 do plano em até 12 toques', async ({ page }) => {
  await seed(page, {
    meta: [META],
    profile: [profile()],
    plan: [
      {
        id: 'plan',
        status: 'ativo',
        semanaZero: {},
        day1: HOJE,
        blocks: createBlocks(HOJE),
        seenNotes: ['semana1'],
        updatedAt: '',
      },
    ],
  });
  let taps = 0;
  const tap = async (l: ReturnType<typeof page.getByRole>) => {
    taps++;
    await l.click();
  };
  await tap(page.getByRole('link', { name: 'Registrar meu dia' }));
  await tap(page.getByText('Sim', { exact: true }).first());
  await tap(page.getByText('1', { exact: true }).first());
  await tap(page.getByText('Lisa e macia'));
  for (const [i, f] of [
    [0, 0.5],
    [1, 0.3],
    [2, 0.2],
    [3, 0.7],
  ] as const) {
    taps++;
    await tapSlider(page, i, f);
  }
  await tap(page.getByRole('button', { name: 'Água distribuída no dia' }));
  await tap(page.getByRole('button', { name: 'Rotina de banheiro depois do café' }));
  await tap(page.getByRole('button', { name: 'Dormi mal' }));
  await tap(page.getByRole('button', { name: 'Pronto' }));
  await expect(page.getByText('Dia registrado.')).toBeVisible();
  expect(taps).toBeLessThanOrEqual(12);
  const [rec] = await readStore<Record<string, unknown>>(page, 'days');
  expect(rec).toMatchObject({
    date: HOJE,
    evacuated: true,
    evacuationCount: 1,
    bristol: 4,
    tags: ['dormi_mal'],
    habits: { p1: true, p2: true },
  });
  expect(Object.keys(rec?.symptoms as object)).toHaveLength(3);
  expect(typeof rec?.energy).toBe('number');
});

test('3. sete dias registrados e a leitura da semana', async ({ page }) => {
  await setClock(page, '2026-11-09');
  const tipos = [4, 4, 2, 4, 6, null, 3];
  await seed(
    page,
    {
      meta: [META],
      profile: [profile()],
      days: tipos.flatMap((t, i) =>
        t === null
          ? []
          : [
              day(`2026-11-0${2 + i}`, {
                evacuated: true,
                evacuationCount: 1,
                bristol: t,
                symptoms: { estufamento: i === 2 ? 6 : 2 },
              }),
            ],
      ),
    },
    '/leitura?manual=1',
  );
  await expect(page.getByText('6 dias registrados')).toBeVisible();
  await expect(page.getByText('6 evacuações na semana, em 6 dias.')).toBeVisible();
  await expect(
    page.getByText('Teve dia de fezes ressecadas e dia de fezes amolecidas na mesma semana.'),
  ).toBeVisible();
  await expect(page.getByText('nota 6')).toBeVisible();
  await page.getByRole('button', { name: 'Salvar a leitura' }).click();
  await expect(page.getByText('Leitura da semana salva.')).toBeVisible();
});

test('4. plano: semana zero, leitura com repetição e reavaliação', async ({ page }) => {
  await seed(page, { meta: [META], profile: [profile()] }, '/plano/semana-zero');
  await page.getByRole('button', { name: 'Começar o plano em 2/11' }).click();
  await expect(page.getByText('Plano · dia 1 de 21 · semana 1, base')).toBeVisible();

  // Fim da primeira semana: água em 3 dias (abaixo da meta), banheiro em 6.
  await setClock(page, '2026-11-08');
  const semana1 = Array.from({ length: 7 }, (_, i) =>
    day(`2026-11-0${2 + i}`, {
      evacuated: true,
      bristol: 2,
      effort: true,
      symptoms: { estufamento: 6 },
      energy: 4,
      habits: { p1: i < 3, p2: i < 6 },
    }),
  );
  await seed(page, { days: semana1 });
  await page.getByRole('link', { name: 'Fazer a leitura da semana' }).first().click();
  await page.getByRole('button', { name: 'Repetir a semana' }).click();
  await expect(page.getByText('Leitura da semana salva.')).toBeVisible();
  await page.goto('/plano');
  await expect(page.getByText('Semana 2, repetição')).toBeVisible();

  // Depois do último bloco (23 a 29/11): semana 3 com tipo 4 e poucos sintomas.
  await setClock(page, '2026-11-30');
  const semana3 = Array.from({ length: 7 }, (_, i) =>
    day(`2026-11-${23 + i}`, {
      evacuated: true,
      bristol: 4,
      symptoms: { estufamento: 2 },
      energy: 7,
      habits: { p1: true, p2: true },
    }),
  );
  await seed(page, { days: semana3 }, '/plano/reavaliacao');
  await expect(page.getByText('o cenário que mais combina é: Melhorou bastante')).toBeVisible();
  await page.getByRole('button', { name: 'Concluir a reavaliação' }).click();
  await expect(page.getByText('Constância vale mais do que intensidade.')).toBeVisible();
});

test('5. tarefa da aula 7 com refeições, sintomas e os suspeitos', async ({ page }) => {
  await seed(page, { meta: [META], profile: [profile({ path: 'gases_sii' })] }, '/aula/7');
  await page.getByRole('button', { name: 'Começar a tarefa' }).click();
  await expect(page.getByText('Dia 1 de 7')).toBeVisible();
  const e = (id: string, date: string, time: string, x: Record<string, unknown>) => ({
    id,
    date,
    time,
    createdAt: '',
    updatedAt: '',
    ...x,
  });
  await setClock(page, '2026-11-09');
  await seed(
    page,
    {
      diary: [
        e('1', '2026-11-02', '08:00', { kind: 'refeicao', foods: ['maçã', 'pão'] }),
        e('2', '2026-11-02', '10:00', {
          kind: 'sintoma',
          symptom: { type: 'estufamento', intensity: 6 },
        }),
        e('3', '2026-11-03', '12:00', { kind: 'refeicao', text: 'maçã e arroz' }),
        e('4', '2026-11-03', '15:00', {
          kind: 'sintoma',
          symptom: { type: 'gases', intensity: 5 },
        }),
        e('5', '2026-11-04', '12:00', { kind: 'refeicao', foods: ['maçã'] }),
      ],
    },
    '/aula/7',
  );
  await expect(
    page.getByText('apareceu antes de sintoma em 2 das 3 vezes em que você comeu'),
  ).toBeVisible();
  await expect(page.getByText(/Na lista de FODMAPs: alto teor, frutas/)).toBeVisible();
});

test('6. sugestão do modo crise depois de dois dias com tipo 6', async ({ page }) => {
  await seed(page, {
    meta: [META],
    profile: [profile()],
    days: [
      day('2026-11-01', { evacuated: true, bristol: 6 }),
      day(HOJE, { evacuated: true, bristol: 6 }),
    ],
  });
  await expect(
    page.getByText(
      'Teus registros mostram fezes tipo 6 ou 7 há dois dias. Quer abrir o guia da crise?',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Abrir' }).click();
  await expect(page.getByRole('heading', { name: 'Modo crise' })).toBeVisible();
});

test('7. sem internet: abrir, ficar offline, recarregar e registrar', async ({ page, context }) => {
  await seed(page, { meta: [META], profile: [profile()] });
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForTimeout(500);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('link', { name: 'Registrar meu dia' }).click();
  await page.getByText('Sim', { exact: true }).first().click();
  await page.getByRole('button', { name: 'Pronto' }).click();
  await expect(page.getByText('Dia registrado.')).toBeVisible();
  const days = await readStore(page, 'days');
  expect(days[0]).toMatchObject({ date: HOJE, evacuated: true });
  await context.setOffline(false);
});

test('8. salvar a cópia e restaurar', async ({ page }) => {
  await seed(
    page,
    { meta: [META], profile: [profile()], days: [day(HOJE, { evacuated: true, bristol: 4 })] },
    '/ajustes',
  );
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Salvar uma cópia' }).first().click(),
  ]);
  const file = await download.path();
  expect(download.suggestedFilename()).toBe(`modulacao-copia-${HOJE}.txt`);
  await clearStore(page, 'days');
  await page.goto('/ajustes/restaurar');
  await page.locator('input[type=file]').setInputFiles(file);
  await page.getByRole('button', { name: 'Restaurar esta cópia' }).click();
  await page.getByRole('button', { name: 'Sim, restaurar' }).click();
  await expect(page.getByText('Teus registros estão de volta.')).toBeVisible();
  const days = await readStore(page, 'days');
  expect(days[0]).toMatchObject({ date: HOJE, bristol: 4 });
});

test('acessibilidade: sem violações graves nas telas principais', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.waitForTimeout(1500);
  const telas = [
    '/',
    '/registro',
    '/caminho',
    '/aula/3',
    '/resultados',
    '/guia',
    '/guia/rotina',
    '/ajustes',
    '/plano',
    '/leitura?manual=1',
    '/ficha',
    '/fodmap',
    '/crise',
  ];
  const graves: string[] = [];
  for (const t of telas) {
    await page.goto(t);
    await page.waitForTimeout(700);
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    for (const v of r.violations)
      if (v.impact === 'serious' || v.impact === 'critical')
        graves.push(`${t}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`);
  }
  expect(graves).toEqual([]);
});
