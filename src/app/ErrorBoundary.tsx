import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Fica só no console do aparelho. Nada é enviado para fora.
    console.error(error, info.componentStack);
  }

  render() {
    return this.state.failed ? <ErrorScreen /> : this.props.children;
  }
}
