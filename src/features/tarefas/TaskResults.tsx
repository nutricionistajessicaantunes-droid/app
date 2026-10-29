import { BAND_LABEL } from '../../content/bristol';
import { LEVEL_LABEL } from '../../content/fodmap';
import { useDiary } from '../../app/data';
import { commonFactorsSentence } from '../../logic/commonFactors';
import { formatDayShort } from '../../logic/dates';
import { joinPt } from '../../logic/format';
import { findSuspects, suspectContext } from '../../logic/suspects';
import {
  aula11Combinations,
  aula11Days,
  aula1Days,
  aula1Highlights,
  aula2Result,
  aula4Result,
  aula8Foods,
  habitsTaskResult,
  type TaskWindow,
} from '../../logic/tasks';
import { summarizeWeek } from '../../logic/week';
import type { ActiveHabit } from '../../logic/habits';
import type { Bristol, DayRecord, LessonProgress } from '../../types';
import styles from '../processo/Processo.module.css';

const tipos = (t: Bristol[]) =>
  t.length === 0 ? 'nenhum tipo registrado' : `tipos ${joinPt(t.map(String))}`;
const modaTexto = (modes: Bristol[]) =>
  modes.length === 0
    ? 'Nenhum tipo registrado no período.'
    : modes.length === 1
      ? `Tipo mais frequente: ${modes[0]}.`
      : `Os tipos ${joinPt(modes.map(String))} apareceram o mesmo número de vezes.`;

/** O que o app calculou no fim do prazo (seção 6.6). */
export function TaskResult({
  p,
  records,
  w,
  habits,
}: {
  p: LessonProgress;
  records: DayRecord[];
  w: TaskWindow;
  habits: ActiveHabit[];
}) {
  const diary = useDiary(w.start, w.end);
  const id = p.lessonId;
  if (id === 1) {
    const days = aula1Days(records, w);
    const hl = aula1Highlights(days);
    const cell = (v: unknown) => (v === undefined || v === '' ? 'sem dado' : String(v));
    const rows: [string, (d: (typeof days)[number]) => string][] = [
      ['Evacuou', (d) => (d.evacuated === undefined ? 'sem dado' : d.evacuated ? 'sim' : 'não')],
      ['Tipo', (d) => cell(d.bristol)],
      ['Sono (h)', (d) => cell(d.sleep?.toString().replace('.', ','))],
      ['Estresse', (d) => cell(d.stress)],
      ['Copos de água', (d) => cell(d.water)],
      ['O que comi', (d) => cell(d.food)],
    ];
    return (
      <div className={styles.pilha}>
        <div className={styles.tabelaCaixa}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th scope="col">Dia</th>
                {days.map((d) => (
                  <th key={d.date} scope="col">
                    {formatDayShort(d.date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, f]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {days.map((d) => (
                    <td key={d.date}>{f(d)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hl.length > 0 ? (
          <ul className={styles.lista}>
            {hl.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : (
          <p className="secundario">Nada se repetiu nos três dias registrados.</p>
        )}
      </div>
    );
  }
  if (id === 2) {
    const r = aula2Result(records, w);
    return (
      <ul className={styles.lista}>
        <li>
          Sentou em {r.satDays} de {r.total} dias.
        </li>
        <li>
          Evacuou em {r.evacuatedDays} de {r.total} dias.
        </li>
        <li>No período: {tipos(r.types)}.</li>
      </ul>
    );
  }
  if (id === 3) {
    const s = summarizeWeek({ records, habits: [], start: w.start, end: w.end });
    return (
      <ul className={styles.lista}>
        <li>
          {modaTexto(s.bristol.modes)}{' '}
          {s.bristol.band ? `Faixa: ${BAND_LABEL[s.bristol.band]}.` : ''}
        </li>
        <li>
          Dias com desconforto: {s.symptomDays.length}
          {s.symptomDays.length === 0 && s.mildSymptomDays.length > 0
            ? `, e ${s.mildSymptomDays.length} com sintoma leve`
            : ''}
          .
        </li>
        {s.commonFactors.length > 0 ? <li>{commonFactorsSentence(s.commonFactors)}</li> : null}
      </ul>
    );
  }
  if (id === 4) {
    const fibras = (p.task.data.fibras as string[] | undefined) ?? [];
    return (
      <div className={styles.pilha}>
        <ul className={styles.lista}>
          {aula4Result(records, w, fibras).map((f) => (
            <li key={f.fiber}>
              <strong>{f.fiber}</strong>: {f.days === 1 ? '1 dia' : `${f.days} dias`},{' '}
              {tipos(f.types)}.
            </li>
          ))}
        </ul>
        <p className="secundario">Sete dias são uma pista, ainda não são conclusão.</p>
      </div>
    );
  }
  if (id === 5 || id === 8 || id === 13) {
    const r = habitsTaskResult(records, w, habits);
    return (
      <div className={styles.pilha}>
        {id === 5 ? <p>{modaTexto(r.modes)}</p> : null}
        <ul className={styles.lista}>
          {r.stats.map((h) => (
            <li key={h.id} className={styles.item}>
              <span>{h.label}</span>
              <span className={styles.numero}>
                {h.done} de {h.activeDays} dias
              </span>
            </li>
          ))}
        </ul>
        {id === 8 ? <Aula8 records={records} w={w} /> : null}
      </div>
    );
  }
  if (id === 7) {
    if (!diary) return null;
    const s = findSuspects(diary, w.start, w.end);
    if (s.length === 0) return <p>Nenhum alimento apareceu antes de sintoma em mais de um dia.</p>;
    return (
      <ul className={styles.lista}>
        {s.map((x) => (
          <li key={x.key}>
            <strong>{x.label}</strong>: {suspectContext(x)}.
            {x.fodmap ? (
              <span className="secundario">
                {' '}
                Na lista de FODMAPs: {LEVEL_LABEL[x.fodmap.level].toLowerCase()},{' '}
                {x.fodmap.categoryTitle.toLowerCase()}.
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
  if (id === 11) {
    const days = aula11Days(records, w);
    const combos = aula11Combinations(days);
    return (
      <div className={styles.pilha}>
        <ul className={styles.barras} aria-label="Gases e estufamento nos 7 dias">
          {days.map((d) => (
            <li key={d.date}>
              <span>{formatDayShort(d.date)}</span>
              <span className={styles.pilha} style={{ gap: 4 }}>
                <span className={styles.trilho} aria-hidden="true">
                  <span
                    className={styles.cheio}
                    style={{ display: 'block', width: `${(d.gases ?? 0) * 10}%` }}
                  />
                </span>
                <span className={styles.trilho} aria-hidden="true">
                  <span
                    className={styles.cheio}
                    style={{
                      display: 'block',
                      width: `${(d.estufamento ?? 0) * 10}%`,
                      opacity: 0.55,
                    }}
                  />
                </span>
              </span>
              <span className="sr-only">
                Gases {d.gases ?? 'sem dado'}, estufamento {d.estufamento ?? 'sem dado'}
              </span>
              <span className={styles.numero} aria-hidden="true">
                {d.gases ?? '·'}/{d.estufamento ?? '·'}
              </span>
            </li>
          ))}
        </ul>
        <p className="secundario pequeno">
          Barra cheia: gases. Barra clara: estufamento. De 0 a 10.
        </p>
        {combos.length > 0 ? (
          <ul className={styles.lista}>
            {combos.map((c) => (
              <li key={c.label} className={styles.item}>
                <span>{c.label}</span>
                <span className={styles.numero}>{c.days === 1 ? '1 dia' : `${c.days} dias`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="secundario">Nenhuma combinação anotada.</p>
        )}
      </div>
    );
  }
  return null;
}

function Aula8({ records, w }: { records: DayRecord[]; w: TaskWindow }) {
  const foods = aula8Foods(records, w);
  if (foods.length === 0) return <p>Nada apareceu antes do sintoma em mais de um dia.</p>;
  return (
    <ul className={styles.lista}>
      {foods.map((f) => (
        <li key={f.key} className={styles.item}>
          <span>{f.label}</span>
          <span className={styles.numero}>{f.days} dias com sintoma</span>
        </li>
      ))}
    </ul>
  );
}
