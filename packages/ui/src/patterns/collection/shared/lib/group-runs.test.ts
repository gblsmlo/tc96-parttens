import { describe, expect, test } from 'bun:test'
import { splitGroupSections } from './group-runs'

const rows = (ids: string[]) => ids.map((id) => ({ id, original: { id } }))

describe('splitGroupSections', () => {
  test('opens a section per run of equal consecutive groups', () => {
    const groups = new Map([
      ['1', 'A'],
      ['2', 'A'],
      ['3', 'B'],
      ['4', 'A'],
    ])
    const sections = splitGroupSections(rows(['1', '2', '3', '4']), groups)
    expect(
      sections.map((section) => [
        section.group,
        section.rows.map((row) => row.id),
      ]),
    ).toEqual([
      ['A', ['1', '2']],
      ['B', ['3']],
      ['A', ['4']],
    ])
  })

  test('a null group neither opens nor closes a run', () => {
    const groups = new Map<string, string | null>([
      ['1', null],
      ['2', 'A'],
      ['3', null],
      ['4', 'A'],
      ['5', 'B'],
    ])
    const sections = splitGroupSections(rows(['1', '2', '3', '4', '5']), groups)
    expect(
      sections.map((section) => [
        section.group,
        section.rows.map((row) => row.id),
      ]),
    ).toEqual([
      [null, ['1']],
      ['A', ['2', '3', '4']],
      ['B', ['5']],
    ])
  })

  test('returns no section without rows', () => {
    expect(splitGroupSections([], new Map())).toEqual([])
  })
})
