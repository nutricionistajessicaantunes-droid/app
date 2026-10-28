/**
 * Função sem estado que devolve um lembrete .ics (seção 3.6). Recebe só título,
 * horário e repetição. Nunca recebe nem guarda dado de saúde. Usada pelo botão
 * "Agenda do iPhone" quando o app está instalado no iPhone.
 */

const TITULOS = new Set([
  'Registro do dia',
  'Leitura da semana',
  'Dia 1 do plano de 21 dias',
  'Dia 21 do plano de 21 dias',
  'Avaliação da fase 1 do protocolo',
  'Testar de novo os gatilhos',
  'Revisão do mês',
]);

const REPETIR =
  /^FREQ=(DAILY;COUNT=\d{1,3}|WEEKLY;BYDAY=(SU|MO|TU|WE|TH|FR|SA)|MONTHLY;BYMONTHDAY=([1-9]|1\d|2[0-8]))$/;

function addMinutes(stamp, minutes) {
  // stamp: AAAAMMDDTHHMM
  const y = Number(stamp.slice(0, 4));
  const mo = Number(stamp.slice(4, 6)) - 1;
  const d = Number(stamp.slice(6, 8));
  const h = Number(stamp.slice(9, 11));
  const mi = Number(stamp.slice(11, 13));
  const dt = new Date(Date.UTC(y, mo, d, h, mi + minutes));
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}00`;
}

export default async (req) => {
  const url = new URL(req.url);
  const titulo = url.searchParams.get('titulo') ?? '';
  const inicio = url.searchParams.get('inicio') ?? '';
  const duracao = Math.min(120, Math.max(5, Number(url.searchParams.get('duracao') ?? '15') || 15));
  const repetir = url.searchParams.get('repetir') ?? '';
  const id =
    (url.searchParams.get('id') ?? 'lembrete').replace(/[^a-z0-9-]/gi, '').slice(0, 40) ||
    'lembrete';

  if (
    !TITULOS.has(titulo) ||
    !/^\d{8}T\d{4}$/.test(inicio) ||
    (repetir && !REPETIR.test(repetir))
  ) {
    return new Response('Pedido inválido.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const agora = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Modulacao Intestinal na Pratica//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@modulacao-intestinal`,
    `DTSTAMP:${agora}`,
    `DTSTART:${inicio}00`,
    `DTEND:${addMinutes(inicio, duracao)}`,
  ];
  if (repetir) linhas.push(`RRULE:${repetir}`);
  linhas.push(
    `SUMMARY:${titulo}`,
    'DESCRIPTION:Abra o app Modulação.',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${titulo}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  );

  return new Response(linhas.join('\r\n') + '\r\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${id}.ics"`,
      'Cache-Control': 'no-store',
    },
  });
};
