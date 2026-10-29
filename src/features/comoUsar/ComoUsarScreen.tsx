import { COMO_USAR } from '../../content/guiaApp';
import { ButtonLink } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Screen } from '../../ui/Screen';
import styles from '../processo/Processo.module.css';

/** Como usar o app: o caminho inteiro, passo a passo, para quem não assistiu às aulas. */
export function Component() {
  return (
    <Screen title="Como usar o app" back={true}>
      <p>{COMO_USAR.intro}</p>
      <Card label="O caminho, passo a passo">
        <ol className={styles.etapas}>
          {COMO_USAR.passos.map((p, i) => (
            <li key={p.titulo}>
              <strong>
                {i + 1}. {p.titulo}
              </strong>
              {p.texto}
            </li>
          ))}
        </ol>
      </Card>
      <Card label="Onde fica cada coisa">
        <ul className={styles.lista}>
          {COMO_USAR.abas.map((a) => (
            <li key={a.nome}>
              <strong>{a.nome}:</strong> {a.texto}
            </li>
          ))}
        </ul>
      </Card>
      <Card label="Cuidados">
        <ul className={styles.lista}>
          {COMO_USAR.cuidados.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>
      <ButtonLink to="/" variant="primary" block>
        Ir para a tela Hoje
      </ButtonLink>
    </Screen>
  );
}
