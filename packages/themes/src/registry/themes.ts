import type { ThemePreset, ThemeSource } from '../schema/theme'
import { presetCss, presetFontsHref } from './css'
import { resolvePreset } from './resolve'
import { tailwindThemeCss } from './tailwind'

export type ThemeRegistryItem = {
  name: string
  title: string
  source: ThemeSource
  fontsHref?: string
  css: string
}

/** The installable form of a preset: one stylesheet under `:root` and `.dark`. */
export function themeRegistryItem(
  preset: ThemePreset,
  base: ThemePreset,
): ThemeRegistryItem {
  const fontsHref = presetFontsHref(preset)
  return {
    name: preset.name,
    title: preset.title,
    source: preset.source,
    ...(fontsHref ? { fontsHref } : {}),
    css: `/* tc96 theme: ${preset.name}. Written by \`tc96 add --theme ${preset.name}\`. */\n\n${tailwindThemeCss()}\n\n${presetCss(resolvePreset(preset, base), 'root')}\n`,
  }
}

/** Every preset under its `data-theme-preset`, the default also on `:root`. */
export function presetsCss(presets: ThemePreset[], base: ThemePreset): string {
  return presets
    .map((preset) =>
      presetCss(
        resolvePreset(preset, base),
        'preset',
        preset.name === base.name,
      ),
    )
    .join('\n\n')
}
