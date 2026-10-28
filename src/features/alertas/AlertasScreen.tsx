import { useEffect, useState } from 'react';
import { useDay } from '../../app/data';
import { useToday } from '../../app/useToday';
import type { RedFlagId } from '../../types';
import { ButtonLink } from '../../ui/Button';
import { Screen } from '../../ui/Screen';
import { RedFlagChecklist } from './RedFlagChecklist';
import { saveRedFlags } from './redFlags';

/** "Notou algo preocupante?": marcar sinais de alerta no dia de hoje. */
export function Component() {
  const today = useToday();
  const record = useDay(today);
  const [flags, setFlags] = useState<RedFlagId[] | null>(null);

  useEffect(() => {
    if (record !== undefined && flags === null) setFlags(record?.redFlags ?? []);
  }, [record, flags]);

  if (flags === null) return null;
  return (
    <Screen title="Notou algo preocupante?" back>
      <p>Marque o que está acontecendo. O app guarda a data para a ficha da consulta.</p>
      <RedFlagChecklist
        value={flags}
        onChange={(f) => {
          setFlags(f);
          void saveRedFlags(today, f);
        }}
      />
      <ButtonLink to="/" variant="primary" block>
        Voltar para Hoje
      </ButtonLink>
    </Screen>
  );
}
