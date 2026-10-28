import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './styles/base.css';
import { AppErrorBoundary } from './app/ErrorBoundary';
import { router } from './app/router';
import { applyInitialTheme } from './app/theme';
import { openDb, resolveDemoFlag } from './db/index';
import { initInstallPrompt } from './features/instalacao/installPrompt';

applyInitialTheme();
initInstallPrompt();
openDb(resolveDemoFlag(window.location.search));

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </StrictMode>,
  );
}
