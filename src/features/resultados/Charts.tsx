import { useId } from 'react';
import { formatDayShort } from '../../logic/dates';
import { formatDecimal, joinPt } from '../../logic/format';
import { niceMax } from '../../logic/charts';
import type { WeekSummary } from '../../logic/week';
import type { Bristol, DayKey } from '../../types';
import styles from './Charts.module.css';

/** Gráficos de Resultados em SVG (seção 6.10), com texto alternativo. */

const W = 320;
const H = 170;
const L = 28;
const R = 8;
const T = 10;
const B = 26;
const plotW = W - L - R;
const plotH = H - T - B;

function Svg({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {children}
    </svg>
  );
}

const weekLabel = (w: WeekSummary) => formatDayShort(w.start);

export function BristolChart({ points }: { points: { date: DayKey; type?: Bristol }[] }) {
  const y = (t: number) => T + plotH - ((t - 0.5) / 7) * plotH;
  const x = (i: number) => L + (i + 0.5) * (plotW / points.length);
  const band = (from: number, to: number, cls?: string) => (
    <rect
      x={L}
      width={plotW}
      y={y(to + 0.5)}
      height={y(from - 0.5) - y(to + 0.5)}
      className={cls}
    />
  );
  const withType = points.filter((p) => p.type);
  const desc =
    withType.length === 0
      ? 'Nenhum tipo registrado nos últimos 28 dias.'
      : `${withType.length} dias com tipo registrado nos últimos 28 dias. ${withType.filter((p) => (p.type as number) >= 3 && (p.type as number) <= 5).length} na faixa saudável.`;
  return (
    <figure className={styles.figura}>
      <Svg title="Tipo de Bristol por dia, últimos 28 dias" desc={desc}>
        {band(1, 2, styles.faixaLenta)}
        {band(3, 5, styles.faixaSaudavel)}
        {band(6, 7, styles.faixaRapida)}
        {[1, 2, 3, 4, 5, 6, 7].map((t) => (
          <text key={t} x={L - 8} y={y(t) + 4} className={styles.eixo} textAnchor="end">
            {t}
          </text>
        ))}
        {points.map((p, i) =>
          p.type ? (
            <circle key={p.date} cx={x(i)} cy={y(p.type)} r={4} className={styles.ponto} />
          ) : null,
        )}
        {points.length > 0 ? (
          <>
            <text x={L} y={H - 8} className={styles.eixo}>
              {formatDayShort(points[0]?.date ?? '')}
            </text>
            <text x={W - R} y={H - 8} className={styles.eixo} textAnchor="end">
              {formatDayShort(points[points.length - 1]?.date ?? '')}
            </text>
          </>
        ) : null}
      </Svg>
      <figcaption className={styles.legenda}>
        <span>
          <i className={styles.chaveLenta} />1 e 2, trânsito lento
        </span>
        <span>
          <i className={styles.chaveSaudavel} />3 a 5, faixa saudável
        </span>
        <span>
          <i className={styles.chaveRapida} />6 e 7, trânsito acelerado
        </span>
      </figcaption>
    </figure>
  );
}

function lineFor(values: (number | undefined)[], max: number): string {
  const step = plotW / Math.max(1, values.length - 1);
  let d = '';
  let pen = false;
  values.forEach((v, i) => {
    if (v === undefined) {
      pen = false;
      return;
    }
    const px = L + i * step;
    const py = T + plotH - (v / max) * plotH;
    d += `${pen ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)} `;
    pen = true;
  });
  return d.trim();
}

export function SymptomEnergyChart({ weeks }: { weeks: WeekSummary[] }) {
  const step = plotW / Math.max(1, weeks.length - 1);
  const s = weeks.map((w) => w.symptomAverage);
  const e = weeks.map((w) => w.energyAverage);
  const last = weeks[weeks.length - 1];
  const desc = last
    ? `Na última semana: sintomas ${last.symptomAverage === undefined ? 'sem dado' : formatDecimal(last.symptomAverage)}, energia ${last.energyAverage === undefined ? 'sem dado' : formatDecimal(last.energyAverage)}.`
    : '';
  return (
    <figure className={styles.figura}>
      <Svg title="Sintomas e energia por semana, de 0 a 10" desc={desc}>
        {[0, 5, 10].map((v) => (
          <g key={v}>
            <line
              x1={L}
              x2={W - R}
              y1={T + plotH - (v / 10) * plotH}
              y2={T + plotH - (v / 10) * plotH}
              className={styles.grade}
            />
            <text
              x={L - 8}
              y={T + plotH - (v / 10) * plotH + 4}
              className={styles.eixo}
              textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}
        <path d={lineFor(s, 10)} className={styles.linhaSintomas} />
        <path d={lineFor(e, 10)} className={styles.linhaEnergia} />
        {s.map((v, i) =>
          v === undefined ? null : (
            <circle
              key={`s${i}`}
              cx={L + i * step}
              cy={T + plotH - (v / 10) * plotH}
              r={3.5}
              className={styles.pontoSintomas}
            />
          ),
        )}
        {e.map((v, i) =>
          v === undefined ? null : (
            <rect
              key={`e${i}`}
              x={L + i * step - 3}
              y={T + plotH - (v / 10) * plotH - 3}
              width={6}
              height={6}
              className={styles.pontoEnergia}
            />
          ),
        )}
        {weeks.map((w, i) =>
          i % 2 === weeks.length % 2 ? null : (
            <text
              key={w.start}
              x={L + i * step}
              y={H - 8}
              className={styles.eixo}
              textAnchor="middle"
            >
              {weekLabel(w)}
            </text>
          ),
        )}
      </Svg>
      <figcaption className={styles.legenda}>
        <span>
          <i className={styles.chaveSintomas} />
          Sintomas (círculo)
        </span>
        <span>
          <i className={styles.chaveEnergia} />
          Energia (quadrado)
        </span>
      </figcaption>
    </figure>
  );
}

function Bars({
  values,
  max,
  goal,
  title,
  desc,
  labels,
}: {
  values: number[];
  max: number;
  goal?: number;
  title: string;
  desc: string;
  labels: string[];
}) {
  const slot = plotW / Math.max(1, values.length);
  const y = (v: number) => T + plotH - (v / max) * plotH;
  return (
    <Svg title={title} desc={desc}>
      <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} className={styles.grade} />
      <text x={L - 8} y={y(max) + 4} className={styles.eixo} textAnchor="end">
        {max}
      </text>
      <text x={L - 8} y={y(0) + 4} className={styles.eixo} textAnchor="end">
        0
      </text>
      {values.map((v, i) => (
        <rect
          key={i}
          x={L + i * slot + slot * 0.2}
          width={slot * 0.6}
          y={y(v)}
          height={y(0) - y(v)}
          className={styles.barra}
        />
      ))}
      {goal !== undefined ? (
        <>
          <line x1={L} x2={W - R} y1={y(goal)} y2={y(goal)} className={styles.meta} />
          <text x={W - R} y={y(goal) - 4} className={styles.eixo} textAnchor="end">
            meta {goal}
          </text>
        </>
      ) : null}
      {labels.map((l, i) =>
        i % 2 === labels.length % 2 ? null : (
          <text
            key={i}
            x={L + i * slot + slot / 2}
            y={H - 8}
            className={styles.eixo}
            textAnchor="middle"
          >
            {l}
          </text>
        ),
      )}
    </Svg>
  );
}

export function HabitsChart({ weeks }: { weeks: WeekSummary[] }) {
  const ids = new Map<string, string>();
  for (const w of weeks) for (const h of w.habits) ids.set(h.id, h.label);
  if (ids.size === 0) return <p className="secundario">Nenhum hábito ativo nessas semanas.</p>;
  return (
    <div className={styles.pequenos}>
      {[...ids.entries()].map(([id, label]) => {
        const values = weeks.map((w) => w.habits.find((h) => h.id === id)?.done ?? 0);
        return (
          <figure key={id} className={styles.figura}>
            <figcaption className={styles.rotulo}>{label}</figcaption>
            <Bars
              values={values}
              max={7}
              goal={5}
              labels={weeks.map(weekLabel)}
              title={`Dias de ${label.toLowerCase()} por semana`}
              desc={`Dias por semana, da mais antiga para a mais recente: ${joinPt(values.map(String))}. A meta é 5.`}
            />
          </figure>
        );
      })}
    </div>
  );
}

export function EvacuationsChart({ weeks }: { weeks: WeekSummary[] }) {
  const values = weeks.map((w) => w.evacuations.total);
  return (
    <figure className={styles.figura}>
      <Bars
        values={values}
        max={niceMax(values, 7)}
        labels={weeks.map(weekLabel)}
        title="Evacuações por semana"
        desc={`Evacuações por semana, da mais antiga para a mais recente: ${joinPt(values.map(String))}.`}
      />
    </figure>
  );
}
