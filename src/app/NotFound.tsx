import { ButtonLink } from '../ui/Button';
import { Screen } from '../ui/Screen';

export function Component() {
  return (
    <Screen title="Página não encontrada" back="/">
      <p>Esse endereço não existe no app.</p>
      <ButtonLink to="/" variant="primary" block>
        Ir para Hoje
      </ButtonLink>
    </Screen>
  );
}
