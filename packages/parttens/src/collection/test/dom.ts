import { JSDOM, VirtualConsole } from 'jsdom'

const virtualConsole = new VirtualConsole().sendTo(console, {
  omitJSDOMErrors: true,
})
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
  virtualConsole,
})

const { window } = dom
if (!window.PointerEvent) {
  Object.defineProperty(window, 'PointerEvent', { value: window.MouseEvent })
}
window.Element.prototype.getAnimations ??= () => []
window.Document.prototype.getAnimations ??= () => []
window.matchMedia ??= (query: string) =>
  ({
    addEventListener() {},
    addListener() {},
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener() {},
    removeListener() {},
  }) as MediaQueryList
class MockResizeObserver implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}
class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

Object.assign(globalThis, {
  AbortController: window.AbortController,
  AbortSignal: window.AbortSignal,
  window,
  document: window.document,
  Document: window.Document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
  Node: window.Node,
  ShadowRoot: window.ShadowRoot,
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
  IntersectionObserver: MockIntersectionObserver,
  ResizeObserver: MockResizeObserver,
})
