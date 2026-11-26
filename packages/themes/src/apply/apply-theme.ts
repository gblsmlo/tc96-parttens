import { defaultPreset } from '../presets'
import { colorEntries } from '../registry/resolve'
import type { ResolvedThemePreset } from '../schema/theme'
import { applyStyleToElement } from './apply-style-to-element'

const fontsLinkId = 'tc96-theme-fonts'

const applyFonts = (root: HTMLElement, href: string | undefined) => {
  const document = root.ownerDocument
  const current = document.getElementById(fontsLinkId)
  if (current?.getAttribute('href') === href) return
  current?.remove()
  if (!href) return
  const link = document.createElement('link')
  link.id = fontsLinkId
  link.rel = 'stylesheet'
  link.href = href
  document.head.append(link)
}

/**
 * Selects a preset whose rules are already in the stylesheet, through
 * `data-theme-preset`, and loads its web fonts.
 */
export function applyThemePreset(
  root: HTMLElement,
  preset: { name: string; fontsHref?: string } | undefined,
  defaultName = defaultPreset.name,
) {
  if (!preset || preset.name === defaultName) delete root.dataset.themePreset
  else root.dataset.themePreset = preset.name
  applyFonts(root, preset?.fontsHref)
}

/**
 * Writes a preset's tokens for one mode as inline custom properties, for a
 * preview of a preset whose rules are not in the stylesheet. Tailwind palette
 * values (`var(--color-stone-800)`) resolve only when the page's Tailwind
 * build emitted them.
 */
export function applyThemeStyles(
  element: HTMLElement,
  preset: ResolvedThemePreset,
  mode: 'light' | 'dark',
) {
  const { typography, other } = preset
  if (other.radius) applyStyleToElement(element, 'radius', other.radius)
  for (const [token, value] of Object.entries(typography))
    if (value && token !== 'letter-spacing')
      applyStyleToElement(element, token, value)
  for (const [token, value] of colorEntries(preset[mode]))
    applyStyleToElement(element, token, value)
}
