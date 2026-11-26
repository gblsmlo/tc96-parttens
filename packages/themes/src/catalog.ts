import { presets } from './presets'
import { presetFontsHref } from './registry/css'
import type { ThemeSource } from './schema/theme'

export type ThemeOption = {
  value: string
  title: string
  source: ThemeSource
  fontsHref?: string
}

export const themeOptions: ThemeOption[] = presets.map((preset) => {
  const fontsHref = presetFontsHref(preset)
  return {
    value: preset.name,
    title: preset.title,
    source: preset.source,
    ...(fontsHref ? { fontsHref } : {}),
  }
})
