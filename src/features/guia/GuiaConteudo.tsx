import type { ReactNode } from 'react';
import { ButtonLink } from '../../ui/Button';
import { BreathingGuide } from './BreathingGuide';
import { FiberDayTool } from './FiberDayTool';
import { FodmapSearch } from './FodmapSearch';
import { Link } from 'react-router';
import {
  ATENDIMENTO,
  INSTAGRAM_TEXTO,
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
  NUTRI_CRN,
  NUTRI_NOME,
  WHATSAPP_EXIBICAO,
  WHATSAPP_URL,
} from '../../config';
import {
  AGUA_TEXTOS,
  DIA_MODELO_FIBRAS,
  DIA_MODELO_TITULO,
  FIBRA_TEXTOS,
  FIBRAS,
  REFEICOES,
} from '../../content/agua-fibras';
import {
  ACOMPANHAMENTO_TEXTO,
  ALERTA_TEXTOS,
  RED_FLAGS,
  SEGUNDO_GRUPO,
} from '../../content/alertas';
import { AVISOS_IMPORTANTES } from '../../content/avisos';
import { BRISTOL_TEXTOS } from '../../content/bristol';
import {
  AVISO_CARDAPIO,
  CARDAPIOS,
  COMO_LER_CARDAPIO,
  GATILHOS,
  type Menu,
} from '../../content/cardapios';
import { KIT_CRISE_ITENS } from '../../content/curso';
import { DIARREIA, VOLTA_ETAPAS } from '../../content/diarreia';
import {
  ANTES_DE_COMECAR,
  CINCO_ERROS,
  EFEITO_ACUMULATIVO,
  FASE1_TEXTOS,
  FASE2_TEXTOS,
  FASE3_TEXTOS,
  FODMAP_AVISOS,
  FODMAP_CATEGORIAS,
  FODMAP_COMO_USAR,
  FODMAP_CUIDADO,
  TABELA_TESTE,
  TABELA_TESTE_TEXTOS,
  USE_SEM_CONTAR,
} from '../../content/fodmap';
import { PADROES, PADROES_FECHO, PADROES_INTRO } from '../../content/padroes';
import {
  CAMINHOS,
  PLAN_HABITS,
  PLAN_THEMES,
  PLANO_TEXTOS,
  RECADO_DIA4,
  REGRAS,
  SEMANA_ZERO_ITENS,
} from '../../content/plano';
import {
  COMBINACOES_PRONTAS,
  PREBIOTICOS,
  PREBIOTICOS_TEXTOS,
  PROBIOTICOS,
  SIMBIOTICOS,
} from '../../content/prebioticos';
import { COMENDO_FORA, LISTA_BASE, PRATO, PRATO_POR_QUEIXA } from '../../content/prato';
import {
  CENARIOS,
  MANUTENCAO_TEXTOS,
  PLANO_MINIMO_TEXTOS,
  REAVALIACAO_TEXTOS,
} from '../../content/reavaliacao';
import { LEITURA_TEXTOS, REGISTRO_CURSO } from '../../content/registro';
import {
  COMECE_COM_DOIS,
  ESTRESSE,
  HORARIOS,
  IMPLANTACAO,
  MOVIMENTO,
  PLANO_SONO,
  RESPIRACAO,
  ROTEIRO_REFEICAO,
  ROTEIRO_TESTE,
  TABELA_IMPLANTACAO,
  TEMPO_RESULTADO,
} from '../../content/rotina';
import { useProfile } from '../../app/data';
import { formatCompact } from '../../logic/format';
import type { PlanTheme } from '../../types';
import { BristolScale } from '../../ui/BristolPicker';
import { Card } from '../../ui/Card';
import { Filete } from '../../ui/Filete';
import { BulletList, ExternalLink, Note, Quote } from '../../ui/Misc';
import styles from './Guia.module.css';
import { WaterCalculator } from './WaterCalculator';

function Secao({ id, label, children }: { id?: string; label: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.secao} style={{ scrollMarginTop: 16 }}>
      <Filete level={2}>{label}</Filete>
      {children}
    </section>
  );
}

export function BristolGuia() {
  return (
    <>
      <Quote>{BRISTOL_TEXTOS.retrato}</Quote>
      <Card>
        <BristolScale />
      </Card>
      <p>{BRISTOL_TEXTOS.faixas}</p>
      <Secao label="Frequência">
        <p>{BRISTOL_TEXTOS.frequencia}</p>
        <p>{BRISTOL_TEXTOS.qualidade}</p>
        <p>{BRISTOL_TEXTOS.padrao}</p>
      </Secao>
    </>
  );
}

export function PlanoGuia() {
  return (
    <>
      <p>{PLANO_TEXTOS.comoFunciona}</p>
      <Note>{PLANO_TEXTOS.porQue21}</Note>
      <Secao label="Mapa das três semanas">
        {([1, 2, 3] as PlanTheme[]).map((t) => {
          const theme = PLAN_THEMES[t];
          return (
            <Card
              key={t}
              title={`Semana ${t}, ${theme.name} · ${theme.activeCount} hábitos ativos`}
              level={3}
            >
              <p>Entram: {theme.summary}</p>
              <ul style={{ margin: '0 0 12px', paddingLeft: '1.2em' }}>
                {PLAN_HABITS.filter((h) => h.theme === t).map((h) => (
                  <li key={h.id}>
                    <strong>{h.label}.</strong> {h.text}
                  </li>
                ))}
              </ul>
              <Note>{theme.note}</Note>
              <p style={{ marginTop: 12 }}>
                <strong>O que esperar:</strong> {theme.expect}
              </p>
            </Card>
          );
        })}
        <p>{PLANO_TEXTOS.acumulam}</p>
        <Card tone="banda">
          <p>
            <strong>Dia 4.</strong> {RECADO_DIA4}
          </p>
        </Card>
      </Secao>
      <Secao label="As cinco regras">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {REGRAS.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
        <p>{PLANO_TEXTOS.anoteDiaRuim}</p>
      </Secao>
      <Secao label="Ajuste por caminho">
        {Object.values(CAMINHOS).map((c) => (
          <Card key={c.titulo} title={c.titulo} level={3}>
            {c.textos.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Card>
        ))}
      </Secao>
      <Secao label="Semana zero">
        <p>{PLANO_TEXTOS.semanaZero}</p>
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {SEMANA_ZERO_ITENS.map((i) => (
            <li key={i.id}>
              {i.text}
              {i.detail ? <span className="secundario"> ({i.detail.toLowerCase()})</span> : null}
            </li>
          ))}
        </ol>
      </Secao>
      <Secao id="reavaliacao" label="Reavaliação do dia 21">
        <p>{REAVALIACAO_TEXTOS.intro}</p>
        <BulletList items={REAVALIACAO_TEXTOS.oQueComparar} />
        <p>{REAVALIACAO_TEXTOS.fotosCircunferencia}</p>
        {Object.values(CENARIOS).map((c) => (
          <Card key={c.titulo} title={c.titulo} level={3}>
            <p>{c.texto}</p>
            {c.detalhe ? <Note>{c.detalhe}</Note> : null}
          </Card>
        ))}
        <p>{REAVALIACAO_TEXTOS.qualquerCenario}</p>
      </Secao>
      <Secao label="Plano mínimo">
        <p>{PLANO_MINIMO_TEXTOS.intro}</p>
        <BulletList items={PLANO_MINIMO_TEXTOS.exemplos} />
        <p>{PLANO_MINIMO_TEXTOS.revisao}</p>
      </Secao>
      <Secao label="Manutenção">
        <BulletList items={MANUTENCAO_TEXTOS} />
      </Secao>
    </>
  );
}

export function RegistroGuia() {
  return (
    <>
      <Secao label="Registro do dia">
        <p>{REGISTRO_CURSO.campos}</p>
        <Quote>{REGISTRO_CURSO.falhouUmDia}</Quote>
      </Secao>
      <Secao label="Leitura da semana">
        <p>{LEITURA_TEXTOS.intro}</p>
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          <li>
            <strong>{LEITURA_TEXTOS.p1}</strong> {LEITURA_TEXTOS.p1Nota}
          </li>
          <li>
            <strong>{LEITURA_TEXTOS.p2}</strong> {LEITURA_TEXTOS.p2Nota}
          </li>
          <li>
            <strong>{LEITURA_TEXTOS.p3}</strong> {LEITURA_TEXTOS.p3Nota}
          </li>
          <li>
            <strong>{LEITURA_TEXTOS.p4}</strong> {LEITURA_TEXTOS.p4Nota}
          </li>
        </ol>
        <Card tone="banda">
          <p>{LEITURA_TEXTOS.algumAbaixo}</p>
        </Card>
        <p>{REGISTRO_CURSO.usoNaConsulta}</p>
      </Secao>
      <Secao id="padroes" label="Padrões que costumam aparecer">
        <p>{PADROES_INTRO}</p>
        <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
          {PADROES.map((p) => (
            <li key={p.id}>
              <strong>{p.title}:</strong> {p.text} {p.extra ?? ''}
            </li>
          ))}
        </ul>
        <p>{PADROES_FECHO}</p>
      </Secao>
    </>
  );
}

export function AguaGuia() {
  const profile = useProfile();
  return (
    <>
      <Secao label="Meta de água">
        <p>{AGUA_TEXTOS.meta}</p>
        {profile ? (
          <Card>
            <WaterCalculator profile={profile} />
          </Card>
        ) : null}
      </Secao>
      <Secao label="Distribuição">
        <p>{AGUA_TEXTOS.distribuicao}</p>
        <p>{AGUA_TEXTOS.copoAoAcordar}</p>
        <p>{AGUA_TEXTOS.frutas}</p>
      </Secao>
      <Secao label="Conferência">
        <p>{AGUA_TEXTOS.conferencia}</p>
      </Secao>
      <Secao label="Dicas">
        <BulletList items={AGUA_TEXTOS.dicas} />
      </Secao>
      <Card tone="banda">
        <p>{AGUA_TEXTOS.avisoRenal}</p>
      </Card>
    </>
  );
}

export function FibrasGuia() {
  return (
    <>
      <p>
        <strong>Meta de fibra:</strong> {FIBRA_TEXTOS.meta.toLowerCase()}
      </p>
      <Secao label="Tabela de fibras, por 100 g">
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Alimento</th>
              <th scope="col">Fibra em 100 g</th>
            </tr>
          </thead>
          <tbody>
            {FIBRAS.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{formatCompact(f.per100)} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Secao>
      <Secao label={DIA_MODELO_TITULO}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Refeição</th>
              <th scope="col">O que entra</th>
              <th scope="col">Fibra</th>
            </tr>
          </thead>
          <tbody>
            {DIA_MODELO_FIBRAS.map((it, i) => (
              <tr key={i}>
                <td>{REFEICOES.find((r) => r.id === it.meal)?.label}</td>
                <td>{it.measure}</td>
                <td>{it.fiberText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Secao>
      <p>{FIBRA_TEXTOS.campeas}</p>
      <p>{FIBRA_TEXTOS.frutaSozinha}</p>
      <p>{FIBRA_TEXTOS.feijao}</p>
      <p>{FIBRA_TEXTOS.aosPoucos}</p>
      <Secao id="meu-dia" label="Meu dia de fibras">
        <FiberDayTool />
      </Secao>
      <Card tone="banda">
        <p>{FIBRA_TEXTOS.avisoValores}</p>
        <p>{FIBRA_TEXTOS.avisoDiagnostico}</p>
      </Card>
    </>
  );
}

export function PrebioticosGuia() {
  return (
    <>
      <Quote>{PREBIOTICOS_TEXTOS.conceito}</Quote>
      <Secao label="Probióticos">
        <p>{PROBIOTICOS.join(', ')}.</p>
        <Note>{PREBIOTICOS_TEXTOS.probioticosNota}</Note>
      </Secao>
      <Secao label="Prebióticos">
        <p>{PREBIOTICOS.map((p) => p.label).join(', ')}.</p>
        <Note>{PREBIOTICOS_TEXTOS.prebioticosNota}</Note>
      </Secao>
      <Secao label="Simbióticos">
        <p>{SIMBIOTICOS.join(', ')}.</p>
        <Note>{PREBIOTICOS_TEXTOS.simbioticosNota}</Note>
      </Secao>
      <Secao label="Quatro combinações prontas">
        <ul className={styles.opcoes}>
          {COMBINACOES_PRONTAS.map((c, i) => (
            <li key={i}>
              <strong>{c.refeicao}:</strong> {c.texto}
            </li>
          ))}
        </ul>
      </Secao>
      <Card tone="banda">
        <p>{PREBIOTICOS_TEXTOS.aviso}</p>
      </Card>
    </>
  );
}

export function PratoGuia() {
  return (
    <>
      <Secao label="Montagem do prato">
        <p>{PRATO.intro}</p>
        <ul className={styles.opcoes}>
          {PRATO.partes.map((p) => (
            <li key={p.parte}>
              <strong>
                {p.parte}: {p.titulo.toLowerCase()}.
              </strong>{' '}
              {p.texto}
            </li>
          ))}
        </ul>
      </Secao>
      <Secao label="O mesmo prato por queixa">
        <ul className={styles.opcoes}>
          {PRATO_POR_QUEIXA.map((p) => (
            <li key={p.queixa}>
              <strong>{p.queixa}:</strong> {p.texto}
            </li>
          ))}
        </ul>
      </Secao>
      <Secao label="Lista base da semana">
        <ul className={styles.opcoes}>
          {LISTA_BASE.itens.map((it) => (
            <li key={it.grupo}>
              <strong>{it.grupo}</strong>
              {it.texto ? `: ${it.texto}` : ''}
            </li>
          ))}
        </ul>
        <p>{LISTA_BASE.fecho}</p>
      </Secao>
      <Secao label="Comendo fora">
        <ul className={styles.opcoes}>
          {COMENDO_FORA.situacoes.map((s) => (
            <li key={s.onde}>
              <strong>{s.onde}:</strong> {s.texto}
            </li>
          ))}
        </ul>
        <p>{COMENDO_FORA.fecho}</p>
      </Secao>
    </>
  );
}

export function RotinaGuia() {
  return (
    <>
      <Secao label="Roteiro da refeição em 5 passos">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {ROTEIRO_REFEICAO.map((p) => (
            <li key={p.titulo}>
              <strong>{p.titulo}:</strong> {p.texto}
            </li>
          ))}
        </ol>
        <p>{ROTEIRO_TESTE}</p>
      </Secao>
      <Secao id="respiracao" label="Respiração antes de comer">
        <p>{RESPIRACAO}</p>
        <BreathingGuide />
      </Secao>
      <Secao label="Horários">
        <BulletList items={HORARIOS.itens} />
        <Note>{HORARIOS.turnos}</Note>
      </Secao>
      <Secao label="Plano de sono">
        <BulletList items={PLANO_SONO.itens} />
        <p>{PLANO_SONO.fecho}</p>
      </Secao>
      <Secao label="Estresse">
        <BulletList items={ESTRESSE.itens} />
        <Note>{ESTRESSE.aviso}</Note>
      </Secao>
      <Secao label="Movimento">
        <p>{MOVIMENTO.texto}</p>
        <Note>{MOVIMENTO.aviso}</Note>
      </Secao>
      <Secao label="Hábitos com gatilho">
        {IMPLANTACAO.map((t) => (
          <p key={t}>{t}</p>
        ))}
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Hábito</th>
              <th scope="col">Gatilho: depois que eu...</th>
              <th scope="col" style={{ textAlign: 'left' }}>
                Eu faço...
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_IMPLANTACAO.map((r) => (
              <tr key={r.habito}>
                <td>{r.habito}</td>
                <td>{r.gatilho}</td>
                <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{r.faco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Secao>
      <Secao label="Em quanto tempo aparece resultado">
        <ul className={styles.opcoes}>
          {TEMPO_RESULTADO.map((t) => (
            <li key={t.o_que}>
              <strong>{t.o_que}:</strong> {t.quando}.
            </li>
          ))}
        </ul>
        <p>{COMECE_COM_DOIS}</p>
      </Secao>
    </>
  );
}

export function FodmapGuia() {
  return (
    <>
      <Secao label="Como usar esta lista">
        <p>{FODMAP_COMO_USAR.intro}</p>
        {FODMAP_COMO_USAR.fases.map((f) => (
          <Card key={f.titulo} title={f.titulo} level={3}>
            <p>{f.texto}</p>
          </Card>
        ))}
        <Card tone="banda">
          <p>{FODMAP_COMO_USAR.temporaria}</p>
        </Card>
        <Note>{FODMAP_COMO_USAR.colunas}</Note>
      </Secao>
      <ButtonLink to="/fodmap" variant="primary" block>
        Abrir o protocolo low FODMAP
      </ButtonLink>
      <Secao label="Procurar na lista">
        <FodmapSearch />
      </Secao>
      <Secao label="Lista por grupo">
        {FODMAP_CATEGORIAS.map((c) => (
          <Card key={c.id} title={c.title} level={3}>
            <p>
              <strong>Alto teor:</strong> {c.alto.map((i) => i.name).join(', ')}.
            </p>
            <p>
              <strong>Baixo teor:</strong> {c.baixo.map((i) => i.name).join(', ')}.
            </p>
            <Note>{c.dica}</Note>
          </Card>
        ))}
        <Card title={USE_SEM_CONTAR.title} level={3}>
          {USE_SEM_CONTAR.grupos.map((g) => (
            <p key={g.titulo}>
              <strong>{g.titulo}:</strong> {g.itens.map((i) => i.name).join(', ')}.
            </p>
          ))}
          <Note>{USE_SEM_CONTAR.dica}</Note>
        </Card>
      </Secao>
      <Secao id="teste" label="Tabela de teste da fase 2">
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Grupo e alimento</th>
              <th scope="col" style={{ textAlign: 'left' }}>
                Porções dos dias 1, 2 e 3
              </th>
            </tr>
          </thead>
          <tbody>
            {TABELA_TESTE.map((t) => (
              <tr key={t.group}>
                <td>
                  <strong>{t.label}</strong>: {t.foodText}
                </td>
                <td style={{ textAlign: 'left', whiteSpace: 'normal' }}>{t.portions.join('; ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>{TABELA_TESTE_TEXTOS.leitura}</p>
        <p>{TABELA_TESTE_TEXTOS.ordem}</p>
        <p>{TABELA_TESTE_TEXTOS.duracao}</p>
      </Secao>
      <Secao label="Antes de começar">
        <BulletList items={ANTES_DE_COMECAR} />
        <Card tone="alerta">
          <p>{FODMAP_CUIDADO.relacaoComida}</p>
          <p>{FODMAP_CUIDADO.gestanteDiagnostico}</p>
        </Card>
      </Secao>
      <Secao label="Fase 1">
        <p>{FASE1_TEXTOS.completa}</p>
        <p>
          <strong>O que registrar todo dia:</strong> {FASE1_TEXTOS.registrar.toLowerCase()}
        </p>
        <p>{FASE1_TEXTOS.restringirMais}</p>
        <p>{FASE1_TEXTOS.naoFuncionou}</p>
      </Secao>
      <Secao label="Fase 2">
        <p>{FASE2_TEXTOS.umGrupo}</p>
        <p>{FASE2_TEXTOS.pausa}</p>
        <Note>{EFEITO_ACUMULATIVO}</Note>
      </Secao>
      <Secao label="Fase 3">
        <p>{FASE3_TEXTOS.testeDeNovo}</p>
        <p>{FASE3_TEXTOS.objetivo}</p>
      </Secao>
      <Secao label="Os cinco erros mais comuns">
        <ol style={{ margin: 0, paddingLeft: '1.3em' }}>
          {CINCO_ERROS.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
      </Secao>
      <Card tone="banda">
        {FODMAP_AVISOS.map((a) => (
          <p key={a}>{a}</p>
        ))}
      </Card>
    </>
  );
}

export function MenuView({ menu }: { menu: Menu }) {
  return (
    <>
      <p>{menu.intro}</p>
      {menu.refeicoes.map((r) => (
        <Card key={r.refeicao} title={r.refeicao} level={3}>
          <ul className={styles.opcoes}>
            {r.opcoes.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </Card>
      ))}
      {menu.trocas ? (
        <Secao label="O que dá para trocar">
          <ul className={styles.opcoes}>
            {menu.trocas.map((t) => (
              <li key={t.titulo}>
                <strong>{t.titulo}:</strong> {t.texto}
              </li>
            ))}
          </ul>
        </Secao>
      ) : null}
      {menu.regras ? (
        <Secao label={menu.regras.titulo}>
          <BulletList items={menu.regras.itens} />
        </Secao>
      ) : null}
      {menu.fecho?.map((f) => (
        <p key={f}>{f}</p>
      ))}
      {menu.id === 'crise' ? (
        <Card tone="alerta">
          <p>{DIARREIA.quandoProcurar}</p>
          <p>{DIARREIA.quandoProcurarAula6}</p>
          <p>{DIARREIA.temporaria}</p>
        </Card>
      ) : null}
    </>
  );
}

export function GatilhosView() {
  return (
    <>
      <p>{GATILHOS.intro}</p>
      <Card title="Evite enquanto o sintoma estiver ativo" level={3}>
        <BulletList items={GATILHOS.evite} />
      </Card>
      <Card title="Use no lugar" level={3}>
        <BulletList items={GATILHOS.useNoLugar} />
      </Card>
      <Card tone="banda">
        <p>{GATILHOS.aviso}</p>
      </Card>
    </>
  );
}

export function CardapiosIndex() {
  return (
    <>
      <p>{COMO_LER_CARDAPIO}</p>
      <ul className={styles.indice}>
        {CARDAPIOS.map((m) => (
          <li key={m.id}>
            <Link to={`/guia/cardapios/${m.id}`} className={styles.indiceLink}>
              <span>{m.titulo}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link to="/guia/cardapios/gatilhos" className={styles.indiceLink}>
            <span>Gatilhos e substituições</span>
          </Link>
        </li>
        <li>
          <Link to="/refeicoes" className={styles.indiceLink}>
            <span className={styles.indiceTexto}>
              <span>Mais opções de refeição</span>
              <span className={styles.indiceDetalhe}>
                O que eu tenho em casa, receitas e o meu dia montado
              </span>
            </span>
          </Link>
        </li>
      </ul>
    </>
  );
}

export function AvisoCardapio() {
  return (
    <Card tone="banda">
      <p>{AVISO_CARDAPIO}</p>
    </Card>
  );
}

export function DiarreiaGuia() {
  return (
    <>
      <Quote>{DIARREIA.primeiroAgua}</Quote>
      <ButtonLink to="/crise" variant="primary" block>
        Estou com diarreia agora
      </ButtonLink>
      <Secao label="Sintomas que merecem atenção">
        <BulletList items={DIARREIA.sintomasAtencao} />
        <p>{DIARREIA.sinaisPerda}</p>
      </Secao>
      <Secao label="Aguda e crônica">
        <p>{DIARREIA.aguda}</p>
        <p>{DIARREIA.cronica}</p>
        <p>{DIARREIA.passouDuasSemanas}</p>
      </Secao>
      <Card tone="alerta" title="Quando procurar atendimento" level={3}>
        <p>{DIARREIA.quandoProcurar}</p>
        <p>{DIARREIA.quandoProcurarAula6}</p>
      </Card>
      <Secao label="Hidratação na crise">
        <p>{DIARREIA.hidratacaoIntro}</p>
        <BulletList items={DIARREIA.hidratacao} />
        <p>{DIARREIA.hidratacaoComo}</p>
      </Secao>
      <Secao label="Na crise">
        <p>
          <strong>O que entra:</strong> {DIARREIA.entra.join(', ').toLowerCase()}.
        </p>
        <p>
          <strong>O que sai por enquanto:</strong> {DIARREIA.sai.join(', ').toLowerCase()}.
        </p>
        <p>
          <Link to="/guia/cardapios/crise">Ver o cardápio da crise</Link>
        </p>
      </Secao>
      <Secao label="A volta depois da crise">
        <p>{DIARREIA.voltaIntro}</p>
        <ul className={styles.opcoes}>
          {VOLTA_ETAPAS.map((e) => (
            <li key={e.id}>
              <strong>{e.dias}:</strong> {e.texto} {e.fecho ?? ''}
            </li>
          ))}
        </ul>
        <p>{DIARREIA.acompanhe}</p>
        <Note>{DIARREIA.temporaria}</Note>
      </Secao>
      <Secao label="Intestino sempre solto">
        <p>{DIARREIA.sempreSolto}</p>
      </Secao>
      <Secao label="Kit de crise">
        <BulletList items={KIT_CRISE_ITENS} />
        <p>{DIARREIA.kitIntro}</p>
      </Secao>
    </>
  );
}

export function AlertasGuia() {
  return (
    <>
      <Secao label="Pedem avaliação médica">
        <BulletList items={RED_FLAGS.map((f) => f.label)} />
        <Card tone="alerta">
          <p>{ALERTA_TEXTOS.pedemAvaliacao}</p>
        </Card>
        <p>{ALERTA_TEXTOS.historicoFamilia}</p>
        <p>{ALERTA_TEXTOS.naoSignificaGrave}</p>
        <p>
          <Link to="/alertas">Marcar um sinal no registro de hoje</Link>
        </p>
      </Secao>
      <Secao label="Pedem acompanhamento, sem urgência">
        <BulletList items={SEGUNDO_GRUPO.map((g) => g.label)} />
        <p>{ACOMPANHAMENTO_TEXTO}</p>
      </Secao>
    </>
  );
}

export function AvisosGuia() {
  return (
    <ul className={styles.opcoes}>
      {AVISOS_IMPORTANTES.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
  );
}

export function SobreGuia() {
  return (
    <>
      <p>
        <strong>{NUTRI_NOME}</strong>, nutricionista, {NUTRI_CRN}. Atuação em nutrição
        comportamental e esportiva.
      </p>
      <Secao label="Atendimento">
        <ul className={styles.opcoes}>
          <li>{ATENDIMENTO.online}</li>
          {ATENDIMENTO.presencial.map((p) => (
            <li key={p.cidade}>
              Presencial em {p.cidade}: {p.endereco}
            </li>
          ))}
        </ul>
      </Secao>
      <Secao label="Dúvidas sobre o conteúdo">
        <p>{INSTAGRAM_TEXTO}</p>
        <ExternalLink href={INSTAGRAM_URL}>{INSTAGRAM_USUARIO}</ExternalLink>
      </Secao>
      <Secao label="Consulta">
        <ExternalLink href={WHATSAPP_URL} variant="secondary">
          Chamar no WhatsApp
        </ExternalLink>
        <p className="secundario" style={{ userSelect: 'text' }}>
          WhatsApp {WHATSAPP_EXIBICAO}
        </p>
      </Secao>
    </>
  );
}
