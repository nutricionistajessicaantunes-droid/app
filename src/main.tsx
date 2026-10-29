import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './styles/base.css';
import { AppErrorBoundary } from './app/ErrorBoundary';
import { router } from './app/router';
import { applyInitialTheme } from './app/theme';
import { openDb, resolveDemo } from './db/index';
import { initInstallPrompt } from './features/instalacao/installPrompt';

applyInitialTheme();
initInstallPrompt();
const scenario = resolveDemo(window.location.search);
const db = openDb(scenario !== null);

async function start() {
  if (scenario) {
    try {
      const { seedDemoIfEmpty } = await import('./db/demo');
      await seedDemoIfEmpty(db, scenario);
    } catch {
      /* sem dados de demonstração, o app abre vazio */
    }
  }
  const root = document.getElementById('root');
  if (!root) return;
  createRoot(root).render(
    <StrictMode>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </StrictMode>,
  );
}

void start();
