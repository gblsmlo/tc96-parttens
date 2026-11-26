import type {
  ResolvedThemePreset,
  ThemeColors,
  ThemePreset,
} from '../schema/theme'
import {
  type ColorToken,
  colorGroupNames,
  type ShadowToken,
} from '../schema/tokens'

const mergeColors = (base: ThemeColors, preset: ThemeColors) =>
  Object.fromEntries(
    colorGroupNames.map((group) => [
      group,
      { ...base[group], ...preset[group] },
    ]),
  ) as Required<ThemeColors>

/** A preset with every token, the ones it leaves out taken from `base`. */
export function resolvePreset(
  preset: ThemePreset,
  base: ThemePreset,
): ResolvedThemePreset {
  return {
    ...preset,
    typography: { ...base.typography, ...preset.typography },
    other: { ...base.other, ...preset.other },
    light: mergeColors(base.light, preset.light),
    dark: mergeColors(base.dark, preset.dark),
  }
}

/** The color tokens of one mode, in group order. */
export function colorEntries(colors: Required<ThemeColors>) {
  return colorGroupNames.flatMap(
    (group) =>
      Object.entries(colors[group]) as [ColorToken | ShadowToken, string][],
  )
}
