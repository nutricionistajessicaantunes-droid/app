import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router';
import { CARDAPIOS } from '../../content/cardapios';
import { Screen } from '../../ui/Screen';
import {
  AguaGuia,
  AlertasGuia,
  AvisoCardapio,
  AvisosGuia,
  BristolGuia,
  CardapiosIndex,
  DiarreiaGuia,
  FibrasGuia,
  FodmapGuia,
  GatilhosView,
  MenuView,
  PlanoGuia,
  PratoGuia,
  PrebioticosGuia,
  RegistroGuia,
  RotinaGuia,
  SobreGuia,
} from './GuiaConteudo';
import { ReceitasFodmapGuia } from '../refeicoes/ReceitasFodmapGuia';
import { getSection } from './sections';

function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 50);
  }, [hash]);
}

export function Component() {
  const { secao = '', sub } = useParams();
  useHashScroll();
  const section = getSection(secao);
  if (!section) return <Navigate to="/guia" replace />;
  if (secao === 'refeicoes') return <Navigate to="/refeicoes" replace />;

  if (secao === 'cardapios') {
    if (sub === 'gatilhos') {
      return (
        <Screen title="Gatilhos e substituições" back="/guia/cardapios">
          <GatilhosView />
          <AvisoCardapio />
        </Screen>
      );
    }
    const menu = CARDAPIOS.find((m) => m.id === sub);
    if (sub && !menu) return <Navigate to="/guia/cardapios" replace />;
    if (menu) {
      return (
        <Screen
          title={`Cardápio modelo · ${menu.titulo}`}
          docTitle={`Cardápio ${menu.titulo}`}
          back="/guia/cardapios"
        >
          <AvisoCardapio />
          <MenuView menu={menu} />
        </Screen>
      );
    }
    return (
      <Screen title="Cardápios modelo" back="/guia">
        <AvisoCardapio />
        <CardapiosIndex />
      </Screen>
    );
  }

  const body = (() => {
    switch (secao) {
      case 'bristol':
        return <BristolGuia />;
      case 'plano':
        return <PlanoGuia />;
      case 'registro':
        return <RegistroGuia />;
      case 'agua':
        return <AguaGuia />;
      case 'fibras':
        return <FibrasGuia />;
      case 'prebioticos':
        return <PrebioticosGuia />;
      case 'prato':
        return <PratoGuia />;
      case 'rotina':
        return <RotinaGuia />;
      case 'fodmap':
        return <FodmapGuia />;
      case 'diarreia':
        return <DiarreiaGuia />;
      case 'alertas':
        return <AlertasGuia />;
      case 'avisos':
        return <AvisosGuia />;
      case 'sobre':
        return <SobreGuia />;
      case 'receitas-fodmap':
        return <ReceitasFodmapGuia />;
      default:
        return null;
    }
  })();

  return (
    <Screen title={section.title} back="/guia">
      {body}
    </Screen>
  );
}
