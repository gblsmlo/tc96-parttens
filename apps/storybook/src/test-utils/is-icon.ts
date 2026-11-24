import type { Icon } from '@phosphor-icons/react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const pathsOf = (markup: string) =>
  [...markup.matchAll(/\sd="([^"]*)"/g)].map(([, path]) => path)

export function isIcon(element: Element | null | undefined, icon: Icon) {
  if (!(element instanceof SVGElement)) return false
  const expected = pathsOf(renderToStaticMarkup(createElement(icon)))
  const actual = [...element.querySelectorAll('path')].map(
    (path) => path.getAttribute('d') ?? '',
  )
  return expected.length > 0 && expected.join('\n') === actual.join('\n')
}
