import { describe, expect, test } from 'bun:test'
import { sortByRegion, summarizeRegion } from './region-summary'
import type { Table6Account } from './types'

const account = (
  id: string,
  arr: number,
  nrr: number,
  renewal: string,
  regionId = 'na',
): Table6Account => ({
  arr,
  health: 'healthy',
  id,
  name: id,
  nrr,
  owner: { id: 'o', label: 'Owner' },
  regionId,
  renewal,
})

describe('summarizeRegion', () => {
  test('sums the ARR and weights the NRR by ARR', () => {
    const summary = summarizeRegion([
      account('a', 300, 1.2, '2026-09-14'),
      account('b', 100, 0.8, '2026-07-02'),
    ])
    expect(summary.arr).toBe(400)
    expect(summary.nrr).toBeCloseTo(1.1)
  })

  test('picks the earliest renewal', () => {
    expect(
      summarizeRegion([
        account('a', 1, 1, '2026-09-14'),
        account('b', 1, 1, '2026-07-02'),
        account('c', 1, 1, '2026-11-21'),
      ]).nextRenewal,
    ).toBe('2026-07-02')
  })

  test('has no NRR and no renewal without accounts', () => {
    expect(summarizeRegion([])).toEqual({
      arr: 0,
      nextRenewal: null,
      nrr: null,
    })
  })
})

describe('sortByRegion', () => {
  test('follows the region order and keeps the order inside a region', () => {
    const sorted = sortByRegion(
      [
        account('a', 1, 1, '2026-01-01', 'emea'),
        account('b', 1, 1, '2026-01-01', 'na'),
        account('c', 1, 1, '2026-01-01', 'emea'),
        account('d', 1, 1, '2026-01-01', 'other'),
      ],
      ['na', 'emea'],
    )
    expect(sorted.map((item) => item.id)).toEqual(['b', 'a', 'c', 'd'])
  })
})
