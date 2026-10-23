import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
})

const { window } = dom
if (!window.PointerEvent) {
  Object.defineProperty(window, 'PointerEvent', { value: window.MouseEvent })
}
Object.assign(globalThis, {
  window,
  document: window.document,
  Document: window.Document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  HTMLButtonElement: window.HTMLButtonElement,
  HTMLFormElement: window.HTMLFormElement,
  HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement,
  KeyboardEvent: window.KeyboardEvent,
  MouseEvent: window.MouseEvent,
  InputEvent: window.InputEvent,
  FocusEvent: window.FocusEvent,
  DocumentFragment: window.DocumentFragment,
  Node: window.Node,
  Text: window.Text,
  Comment: window.Comment,
  CustomEvent: window.CustomEvent,
  Event: window.Event,
  PointerEvent: window.PointerEvent ?? window.MouseEvent,
  getComputedStyle: window.getComputedStyle.bind(window),
  requestAnimationFrame:
    window.requestAnimationFrame?.bind(window) ??
    ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(Date.now()), 16)),
  cancelAnimationFrame:
    window.cancelAnimationFrame?.bind(window) ??
    ((handle: number) => window.clearTimeout(handle)),
  MutationObserver: window.MutationObserver,
})

if (!('fonts' in window.document)) {
  Object.defineProperty(window.document, 'fonts', {
    value: {
      addEventListener() {},
      removeEventListener() {},
      ready: Promise.resolve(),
    },
  })
}

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

Object.defineProperty(window.Element.prototype, 'getAnimations', {
  configurable: true,
  value: () => [],
})
