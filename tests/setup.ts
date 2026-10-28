process.env.TZ = 'America/Sao_Paulo';
import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// O jsdom não tem PointerEvent: um substituto simples para os testes de toque.
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventStub extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 1;
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  (window as unknown as { PointerEvent: typeof PointerEventStub }).PointerEvent = PointerEventStub;
  (globalThis as unknown as { PointerEvent: typeof PointerEventStub }).PointerEvent =
    PointerEventStub;
}
