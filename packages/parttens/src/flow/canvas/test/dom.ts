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

class ResizeObserverMock {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: { width: 800, height: 600 } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver,
    )
  }
  unobserve() {}
  disconnect() {}
}

class DOMMatrixReadOnlyMock {
  m22: number
  constructor(transform?: string) {
    const scale = transform?.match(/scale\(([1-9.]+)\)/)?.[1]
    this.m22 = scale === undefined ? 1 : Number(scale)
  }
}

Object.assign(globalThis, {
  ResizeObserver: ResizeObserverMock,
  DOMMatrixReadOnly: DOMMatrixReadOnlyMock,
})
Object.defineProperties(window.HTMLElement.prototype, {
  offsetHeight: {
    configurable: true,
    get() {
      return Number.parseFloat(this.style.height) || 1
    },
  },
  offsetWidth: {
    configurable: true,
    get() {
      return Number.parseFloat(this.style.width) || 1
    },
  },
})
Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
  configurable: true,
  value: () => ({ x: 0, y: 0, width: 0, height: 0 }),
})
