import { expect, test } from 'bun:test'
import { webFonts } from '../fonts/stacks'
import { colorGroups, surfaceShadows } from '../schema/tokens'
import { defaultPreset, presets } from '.'

test('every preset has a unique kebab-case name', () => {
  const names = presets.map((preset) => preset.name)
  expect(new Set(names).size).toBe(names.length)
  for (const name of names) expect(name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
})

test('the default preset defines every token the others may leave out', () => {
  for (const mode of ['light', 'dark'] as const)
    expect(Object.keys(defaultPreset[mode].status ?? {}).sort()).toEqual(
      [...colorGroups.status].sort(),
    )
  expect(
    defaultPreset.light.destructive['destructive-foreground'],
  ).toBeDefined()
  for (const mode of ['light', 'dark'] as const)
    for (const [group, token] of Object.entries(surfaceShadows))
      expect(
        (defaultPreset[mode] as Record<string, Record<string, string>>)[
          group
        ]?.[token],
      ).toBeDefined()
  expect(defaultPreset.other?.radius).toBeDefined()
  expect(defaultPreset.typography?.['font-sans']).toBeDefined()
})

test('a preset loads only web fonts its stacks name first', () => {
  for (const preset of presets) {
    const { typography = {} } = preset
    const named = webFonts([
      typography['font-sans'],
      typography['font-serif'],
      typography['font-mono'],
    ])
    for (const font of preset.fonts ?? []) expect(named).toContain(font)
  }
})
