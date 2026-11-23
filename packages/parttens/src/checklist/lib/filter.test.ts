import { expect, test } from 'bun:test'
import { checklistFilterNarrows } from './filter'

const options = [
  { label: 'Abertas', value: 'open' },
  { label: 'Concluídas', value: 'done' },
]
const ignore = () => undefined

test('no filter does not narrow', () => {
  expect(checklistFilterNarrows(undefined)).toBe(false)
})

test('every option checked does not narrow', () => {
  expect(
    checklistFilterNarrows({
      filterOptions: options,
      filterValue: ['open', 'done'],
      label: 'Filtrar',
    }),
  ).toBe(false)
})

test('an unchecked option narrows', () => {
  expect(
    checklistFilterNarrows({
      filterOptions: options,
      filterValue: ['open'],
      label: 'Filtrar',
    }),
  ).toBe(true)
})

test('an unchecked option in a section narrows', () => {
  expect(
    checklistFilterNarrows({
      label: 'Filtrar',
      sections: [{ label: 'Status', onChange: ignore, options, value: [] }],
    }),
  ).toBe(true)
})

test('a sort alone does not narrow', () => {
  expect(
    checklistFilterNarrows({
      label: 'Ordenar',
      sortOptions: options,
      sortValue: 'done',
    }),
  ).toBe(false)
})
