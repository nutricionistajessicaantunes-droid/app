import { createBrowserRouter } from 'react-router';
import { HojeScreen } from '../features/hoje/HojeScreen';
import { ErrorScreen } from './ErrorScreen';
import { Root } from './Root';
import { Splash } from './Splash';

/** Rotas com endereço próprio, para linkar de dentro da Kiwify (seção 6.2). */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorScreen />,
    hydrateFallbackElement: <Splash />,
    children: [
      { index: true, element: <HojeScreen /> },
      { path: 'registro', lazy: () => import('../features/registro/RegistroScreen') },
      { path: 'registro/:data', lazy: () => import('../features/registro/RegistroScreen') },
      { path: 'caminho', lazy: () => import('../features/caminho/CaminhoScreen') },
      { path: 'aula/:n', lazy: () => import('../features/caminho/AulaScreen') },
      { path: 'resultados', lazy: () => import('../features/resultados/ResultadosScreen') },
      { path: 'guia', lazy: () => import('../features/guia/GuiaScreen') },
      { path: 'guia/:secao', lazy: () => import('../features/guia/GuiaSecaoScreen') },
      { path: 'guia/:secao/:sub', lazy: () => import('../features/guia/GuiaSecaoScreen') },
      { path: 'alertas', lazy: () => import('../features/alertas/AlertasScreen') },
      { path: 'ajustes', lazy: () => import('../features/ajustes/AjustesScreen') },
      { path: 'ajustes/:secao', lazy: () => import('../features/ajustes/AjustesSecaoScreen') },
      { path: '*', lazy: () => import('./NotFound') },
    ],
  },
]);
