import { describe, expect, test } from 'bun:test'
import {
  changeConditionOperator,
  createCondition,
  type DataGridCondition,
  type DataGridConditionField,
  getConditionOperators,
  isConditionComplete,
  matchesCondition,
  matchesConditions,
  normalizeConditionValue,
} from './data-grid-conditions'

const fields: DataGridConditionField[] = [
  { columnId: 'account', kind: 'text', label: 'Account' },
  {
    columnId: 'stage',
    kind: 'option',
    label: 'Stage',
    options: [
      { label: 'Open', value: 'open' },
      { label: 'Won', value: 'won' },
    ],
  },
  { columnId: 'amount', kind: 'number', label: 'Amount' },
  { columnId: 'renewal', kind: 'date', label: 'Renewal' },
]

const condition = (
  columnId: string,
  operator: DataGridCondition['operator'],
  ...value: string[]
): DataGridCondition => ({
  columnId,
  id: `${columnId}-${operator}`,
  operator,
  value,
})

const row = {
  account: 'Acme Corp',
  amount: 1200,
  renewal: '2026-09-15',
  stage: 'open',
}
const getValue = (columnId: string) => row[columnId as keyof typeof row]

describe('condition operators', () => {
  test('each kind offers its own operators, first one is the default', () => {
    expect(getConditionOperators('text')).toEqual(['contains', 'is', 'is-not'])
    expect(getConditionOperators('option')).toEqual([
      'is',
      'is-not',
      'is-any-of',
    ])
    expect(getConditionOperators('number')).toEqual([
      'eq',
      'gt',
      'lt',
      'between',
    ])
    expect(getConditionOperators('date')).toEqual([
      'before',
      'after',
      'between',
    ])
    const [stage] = fields.filter((field) => field.kind === 'option')
    if (!stage) throw new Error('missing field')
    expect(createCondition(stage, 'c1')).toEqual({
      columnId: 'stage',
      id: 'c1',
      operator: 'is',
      value: [],
    })
  })

  test('changing the operator trims the value to the slots it has', () => {
    expect(normalizeConditionValue('between', ['1', '2', '3'])).toEqual([
      '1',
      '2',
    ])
    expect(normalizeConditionValue('is-any-of', ['a', 'b'])).toEqual(['a', 'b'])
    expect(normalizeConditionValue('is', ['a', 'b'])).toEqual(['a'])
    expect(
      changeConditionOperator(
        condition('stage', 'is-any-of', 'a', 'b'),
        'is-not',
      ).value,
    ).toEqual(['a'])
  })

  test('a condition is complete when every slot of its operator is filled', () => {
    expect(isConditionComplete(condition('account', 'contains'))).toBe(false)
    expect(isConditionComplete(condition('account', 'contains', ' '))).toBe(
      false,
    )
    expect(isConditionComplete(condition('account', 'contains', 'a'))).toBe(
      true,
    )
    expect(isConditionComplete(condition('amount', 'between', '1'))).toBe(false)
    expect(isConditionComplete(condition('amount', 'between', '1', '2'))).toBe(
      true,
    )
    expect(isConditionComplete(condition('stage', 'is-any-of'))).toBe(false)
  })
})

describe('matchesCondition', () => {
  test('text compares without case', () => {
    expect(
      matchesCondition(
        condition('account', 'contains', 'ACME'),
        'Acme Corp',
        'text',
      ),
    ).toBe(true)
    expect(
      matchesCondition(
        condition('account', 'is', 'acme corp'),
        'Acme Corp',
        'text',
      ),
    ).toBe(true)
    expect(
      matchesCondition(condition('account', 'is', 'acme'), 'Acme Corp', 'text'),
    ).toBe(false)
    expect(
      matchesCondition(
        condition('account', 'is-not', 'acme'),
        'Acme Corp',
        'text',
      ),
    ).toBe(true)
    expect(
      matchesCondition(condition('account', 'contains', 'x'), null, 'text'),
    ).toBe(false)
  })

  test('option matches one value or any of several', () => {
    expect(
      matchesCondition(condition('stage', 'is', 'open'), 'open', 'option'),
    ).toBe(true)
    expect(
      matchesCondition(condition('stage', 'is-not', 'open'), 'open', 'option'),
    ).toBe(false)
    expect(
      matchesCondition(
        condition('stage', 'is-any-of', 'won', 'open'),
        'open',
        'option',
      ),
    ).toBe(true)
    expect(
      matchesCondition(
        condition('stage', 'is-any-of', 'won'),
        'open',
        'option',
      ),
    ).toBe(false)
  })

  test('number compares as numbers and ignores values that are not numbers', () => {
    expect(
      matchesCondition(condition('amount', 'eq', '1200'), 1200, 'number'),
    ).toBe(true)
    expect(
      matchesCondition(condition('amount', 'gt', '1000'), '1200', 'number'),
    ).toBe(true)
    expect(
      matchesCondition(condition('amount', 'lt', '1000'), 1200, 'number'),
    ).toBe(false)
    expect(
      matchesCondition(
        condition('amount', 'between', '2000', '1000'),
        1200,
        'number',
      ),
    ).toBe(true)
    expect(
      matchesCondition(condition('amount', 'gt', '0'), 'n/a', 'number'),
    ).toBe(false)
    expect(
      matchesCondition(condition('amount', 'gt', '0'), null, 'number'),
    ).toBe(false)
  })

  test('date compares calendar days, with both ends of a range included', () => {
    expect(
      matchesCondition(
        condition('renewal', 'before', '2026-09-16'),
        '2026-09-15',
        'date',
      ),
    ).toBe(true)
    expect(
      matchesCondition(
        condition('renewal', 'before', '2026-09-15'),
        '2026-09-15',
        'date',
      ),
    ).toBe(false)
    expect(
      matchesCondition(
        condition('renewal', 'after', '2026-09-14'),
        '2026-09-15T23:59:00',
        'date',
      ),
    ).toBe(true)
    expect(
      matchesCondition(
        condition('renewal', 'between', '2026-09-15', '2026-09-30'),
        '2026-09-15',
        'date',
      ),
    ).toBe(true)
    expect(
      matchesCondition(
        condition('renewal', 'between', '2026-09-16', '2026-09-30'),
        '2026-09-15',
        'date',
      ),
    ).toBe(false)
    expect(
      matchesCondition(
        condition('renewal', 'after', '2026-01-01'),
        'soon',
        'date',
      ),
    ).toBe(false)
  })
})

describe('matchesConditions', () => {
  const conditions = [
    condition('account', 'contains', 'acme'),
    condition('stage', 'is', 'won'),
  ]

  test('joins with and by default and with or on request', () => {
    expect(matchesConditions({ conditions, fields, getValue })).toBe(false)
    expect(
      matchesConditions({ conditions, fields, getValue, join: 'or' }),
    ).toBe(true)
    expect(
      matchesConditions({
        conditions: [conditions[0] as DataGridCondition],
        fields,
        getValue,
      }),
    ).toBe(true)
  })

  test('skips incomplete conditions and conditions on unknown columns', () => {
    expect(matchesConditions({ conditions: [], fields, getValue })).toBe(true)
    expect(
      matchesConditions({
        conditions: [condition('stage', 'is'), condition('ghost', 'is', 'x')],
        fields,
        getValue,
      }),
    ).toBe(true)
    expect(
      matchesConditions({
        conditions: [
          condition('stage', 'is'),
          condition('stage', 'is', 'open'),
        ],
        fields,
        getValue,
      }),
    ).toBe(true)
  })
})
