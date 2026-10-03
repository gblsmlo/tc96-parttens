import { describe, expect, test } from 'bun:test'
import {
  flattenTitle,
  formatTitleCounter,
  richTextElementTypes,
  richTextHasNodeId,
  richTextToPlainText,
} from './rich-text'

describe('flattenTitle', () => {
  test('keeps a title without breaks', () => {
    expect(flattenTitle('Phrasal verbs')).toBe('Phrasal verbs')
    expect(flattenTitle('')).toBe('')
  })

  test('turns each line break into a space, whatever the line ending', () => {
    expect(flattenTitle('Phrasal\nverbs')).toBe('Phrasal verbs')
    expect(flattenTitle('Phrasal\r\nverbs')).toBe('Phrasal verbs')
    expect(flattenTitle('Phrasal\rverbs')).toBe('Phrasal verbs')
  })

  test('collapses a run of breaks to one space', () => {
    expect(flattenTitle('Phrasal\n\nverbs')).toBe('Phrasal verbs')
    expect(flattenTitle('\nPhrasal\nverbs\n')).not.toMatch(/[\r\n]/)
  })
})

describe('formatTitleCounter', () => {
  test('reads as the current length over the limit', () => {
    expect(formatTitleCounter(70, 80)).toBe('70/80')
    expect(formatTitleCounter(0, 80)).toBe('0/80')
  })
})

const document = [
  { children: [{ text: 'Title' }], type: 'h2' },
  {
    children: [{ text: 'With ' }, { bold: true, text: 'bold' }, { text: '.' }],
    type: 'p',
  },
  {
    children: [
      {
        children: [
          { children: [{ text: 'First' }], type: 'lic' },
          {
            children: [
              {
                children: [{ children: [{ text: 'Nested' }], type: 'lic' }],
                type: 'li',
              },
            ],
            type: 'ol',
          },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
]

describe('richTextToPlainText', () => {
  test('writes one line per block or list item and drops the marks', () => {
    expect(richTextToPlainText(document)).toBe(
      'Title\nWith bold.\nFirst\nNested',
    )
  })

  test('an empty document is an empty string', () => {
    expect(richTextToPlainText([])).toBe('')
  })
})

describe('richTextElementTypes', () => {
  test('lists every element type in document order', () => {
    expect(richTextElementTypes(document)).toEqual([
      'h2',
      'p',
      'ul',
      'li',
      'lic',
      'ol',
      'li',
      'lic',
    ])
  })
})

describe('richTextHasNodeId', () => {
  test('finds an id at any depth', () => {
    expect(richTextHasNodeId(document)).toBe(false)
    expect(
      richTextHasNodeId([
        {
          children: [{ children: [{ text: '' }], id: 'x', type: 'p' }],
          type: 'blockquote',
        },
      ]),
    ).toBe(true)
  })
})
