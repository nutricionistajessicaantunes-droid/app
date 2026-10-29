import figtree400 from '../../assets/pdf/figtree-400.ttf?url';
import figtree700 from '../../assets/pdf/figtree-700.ttf?url';
import { APP_NAME, ASSINATURA } from '../../config';
import { FICHA_TEXTOS } from '../../content/ficha';
import type { FichaSection, WeekRow } from './fichaData';

/** PDF da ficha (A4), com a fonte do app embutida. Carregado só quando a aluna pede. */

const VINHO: [number, number, number] = [110, 43, 61];
const TINTA: [number, number, number] = [43, 26, 32];
const CINZA: [number, number, number] = [110, 96, 101];

async function toBase64(url: string): Promise<string> {
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000)
    bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

export async function buildFichaPdf(
  sections: FichaSection[],
  weeks: WeekRow[],
  fileName: string,
): Promise<File> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  try {
    doc.addFileToVFS('Figtree-Regular.ttf', await toBase64(figtree400));
    doc.addFont('Figtree-Regular.ttf', 'Figtree', 'normal');
    doc.addFileToVFS('Figtree-Bold.ttf', await toBase64(figtree700));
    doc.addFont('Figtree-Bold.ttf', 'Figtree', 'bold');
    doc.setFont('Figtree', 'normal');
  } catch {
    doc.setFont('helvetica', 'normal');
  }
  const font = doc.getFont().fontName;
  const W = 210;
  const M = 18;
  let y = 20;
  const ensure = (h: number) => {
    if (y + h > 280) {
      doc.addPage();
      y = 20;
    }
  };
  const text = (t: string, size: number, style: 'normal' | 'bold', color = TINTA, indent = 0) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(t, W - 2 * M - indent) as string[];
    for (const l of lines) {
      ensure(size * 0.45);
      doc.text(l, M + indent, y);
      y += size * 0.45;
    }
  };

  doc.setFillColor(...VINHO);
  doc.rect(0, 0, W, 6, 'F');
  text('Ficha para a consulta', 20, 'bold', VINHO);
  y += 1;
  text(APP_NAME, 10, 'normal', CINZA);
  y += 4;

  for (const s of sections) {
    ensure(14);
    doc.setDrawColor(...VINHO);
    doc.setLineWidth(0.3);
    doc.line(M, y, W - M, y);
    y += 5;
    text(s.title, 11, 'bold', VINHO);
    y += 1;
    for (const [k, v] of s.lines) {
      if (k) text(k, 9, 'bold', CINZA);
      text(v || '-', 10.5, 'normal', TINTA);
      y += 1.5;
    }
    y += 2;
  }

  ensure(30);
  doc.line(M, y, W - M, y);
  y += 5;
  text('Últimas 3 semanas', 11, 'bold', VINHO);
  y += 1;
  const cols = ['Período', 'Dias', 'Tipo', 'Evacuações', 'Sintomas', 'Energia'];
  const xs = [M, M + 62, M + 78, M + 98, M + 125, M + 150];
  doc.setFontSize(9);
  doc.setFont(font, 'bold');
  doc.setTextColor(...CINZA);
  cols.forEach((c, i) => doc.text(c, xs[i] as number, y));
  y += 5;
  doc.setFont(font, 'normal');
  doc.setTextColor(...TINTA);
  for (const w of weeks) {
    ensure(6);
    [w.periodo, w.dias, w.tipo || '-', w.evacuacoes, w.sintomas || '-', w.energia || '-'].forEach(
      (c, i) => doc.text(c, xs[i] as number, y),
    );
    y += 6;
  }
  y += 3;
  text('O que levar', 11, 'bold', VINHO);
  for (const i of FICHA_TEXTOS.oQueLevar) text(`• ${i}`, 10.5, 'normal', TINTA, 2);
  y += 2;
  text(FICHA_TEXTOS.oQueLevarFecho, 9.5, 'normal', CINZA);

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont(font, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...CINZA);
    doc.text(ASSINATURA, M, 290);
    doc.text(`${i} de ${pages}`, W - M, 290, { align: 'right' });
  }
  return new File([doc.output('blob')], fileName, { type: 'application/pdf' });
}
