import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import {
  richTextElementTypes,
  richTextHasNodeId,
  stripRichTextNodeIds,
} from '@tc96/helpers/rich-text'
import type { Descendant, Path, TElement, Value } from 'platejs'
import { createPlateEditor } from 'platejs/react'
import {
  applyBlock,
  RICH_TEXT_ELEMENTS,
  type RichTextBlock,
  richTextEditorOptions,
} from './plugins'

await import('./test/dom')

const MAX_DEPTH = 4

function expectVocabulary(nodes: Descendant[]) {
  const outside = richTextElementTypes(nodes).filter(
    (type) => !(RICH_TEXT_ELEMENTS as readonly string[]).includes(type),
  )
  expect(outside).toEqual([])
  expect(richTextHasNodeId(nodes)).toBe(false)
}

const paragraph = (text = ''): TElement => ({ children: [{ text }], type: 'p' })

const listOf = (type: 'ol' | 'ul', ...texts: string[]): TElement => ({
  children: texts.map((text) => ({
    children: [{ children: [{ text }], type: 'lic' }],
    type: 'li',
  })),
  type,
})

function editorAt(value: Value, at: Path = [0]) {
  const editor = createPlateEditor({
    ...richTextEditorOptions(MAX_DEPTH),
    nodeId: false,
    value,
  })
  const end = editor.api.end(at)
  if (!end) throw new Error(`No end at ${JSON.stringify(at)}`)
  editor.tf.select(end)
  return editor
}

function typeText(editor: ReturnType<typeof editorAt>, text: string) {
  for (const char of text) editor.tf.insertText(char)
}

const listDepth = (nodes: Descendant[]): number =>
  Math.max(
    0,
    ...nodes.map((node) => {
      if (!('children' in node)) return 0
      const own = node.type === 'ul' || node.type === 'ol' ? 1 : 0
      return own + listDepth(node.children as Descendant[])
    }),
  )

const listItemTexts = (nodes: Descendant[]): string[] =>
  nodes.flatMap((node) => {
    if (!('children' in node)) return []
    if (node.type === 'lic') {
      return [
        (node.children as { text: string }[]).map((leaf) => leaf.text).join(''),
      ]
    }
    return listItemTexts(node.children as Descendant[])
  })

function nestedList(levels: number, level = 1): TElement {
  const item: Descendant[] = [
    { children: [{ text: `level ${level}` }], type: 'lic' },
  ]
  if (level < levels) item.push(nestedList(levels, level + 1))
  return { children: [{ children: item, type: 'li' }], type: 'ul' }
}

describe('richTextEditorOptions', () => {
  describe('node id', () => {
    const nodeEnv = process.env.NODE_ENV

    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    afterEach(() => {
      process.env.NODE_ENV = nodeEnv
    })

    function editWith(
      options: Partial<ReturnType<typeof richTextEditorOptions>>,
    ) {
      const editor = createPlateEditor({
        ...options,
        value: [{ children: [{ text: 'first' }], type: 'p' }],
      })
      editor.tf.insertNodes(
        { children: [{ text: 'second' }], type: 'h2' },
        { at: [1] },
      )
      return editor.children
    }

    test('the editor tags inserted blocks with an id internally', () => {
      expect(
        richTextHasNodeId(editWith(richTextEditorOptions(MAX_DEPTH))),
      ).toBe(true)
    })

    test('stripping the tagged tree leaves no node id', () => {
      const stripped = stripRichTextNodeIds(
        editWith(richTextEditorOptions(MAX_DEPTH)),
      )
      expect(richTextHasNodeId(stripped)).toBe(false)
      expect(stripped).toHaveLength(2)
    })
  })

  describe('list depth', () => {
    function normalized(value: Value) {
      const editor = createPlateEditor({
        ...richTextEditorOptions(MAX_DEPTH),
        nodeId: false,
        value,
      })
      editor.tf.normalize({ force: true })
      return editor.children
    }

    test('a list deeper than the cap is flattened to it, keeping every item', () => {
      const children = normalized([nestedList(7)])

      expect(listDepth(children)).toBe(MAX_DEPTH)
      expect(listItemTexts(children)).toEqual(
        [1, 2, 3, 4, 5, 6, 7].map((n) => `level ${n}`),
      )
    })

    test('the cap must be a whole number of at least one level', () => {
      for (const invalid of [0, -1, 1.5, Number.NaN]) {
        expect(() => richTextEditorOptions(invalid)).toThrow(RangeError)
      }
      expect(() => richTextEditorOptions(1)).not.toThrow()
    })

    test('a list at the cap is left as it is', () => {
      const value = [nestedList(MAX_DEPTH)]

      expect(normalized(structuredClone(value))).toEqual(value)
    })
  })

  describe('blockquote', () => {
    test('blocks pasted inside a quote are flattened with a line break between them', () => {
      const editor = createPlateEditor({
        ...richTextEditorOptions(MAX_DEPTH),
        nodeId: false,
        value: [
          {
            children: [
              { children: [{ text: 'a' }], type: 'p' },
              { children: [{ text: 'b' }], type: 'p' },
              { children: [{ bold: true, text: 'c' }], type: 'p' },
            ],
            type: 'blockquote',
          },
        ],
      })
      editor.tf.normalize({ force: true })

      expect(editor.children as Value).toEqual([
        {
          children: [{ text: 'a\nb\n' }, { bold: true, text: 'c' }],
          type: 'blockquote',
        },
      ])
    })
  })

  describe('markdown shortcuts', () => {
    const blockTriggers: [string, 'blockquote' | 'h2' | 'h3'][] = [
      ['# ', 'h2'],
      ['## ', 'h2'],
      ['### ', 'h3'],
      ['> ', 'blockquote'],
    ]

    test.each(blockTriggers)(
      '"%s" at the start of a paragraph makes it a %s',
      (trigger, type) => {
        const editor = editorAt([paragraph()])
        typeText(editor, `${trigger}Verbs`)

        expect(editor.children as Value).toEqual([
          { children: [{ text: 'Verbs' }], type },
        ])
        expectVocabulary(editor.children)
      },
    )

    const listTriggers: [string, 'ol' | 'ul'][] = [
      ['- ', 'ul'],
      ['* ', 'ul'],
      ['1. ', 'ol'],
    ]

    test.each(listTriggers)(
      '"%s" at the start of a paragraph starts a %s',
      (trigger, type) => {
        const editor = editorAt([paragraph()])
        typeText(editor, `${trigger}Verbs`)

        expect(editor.children as Value).toEqual([listOf(type, 'Verbs')])
        expectVocabulary(editor.children)
      },
    )

    const markTriggers: [string, string, Record<string, true>][] = [
      ['**strong**', 'strong', { bold: true }],
      ['*light*', 'light', { italic: true }],
      ['_light_', 'light', { italic: true }],
      ['~~struck~~', 'struck', { strikethrough: true }],
      ['`code`', 'code', { code: true }],
    ]

    test.each(markTriggers)(
      '"%s" marks the text between the delimiters',
      (typed, text, mark) => {
        const editor = editorAt([paragraph()])
        typeText(editor, typed)

        expect((editor.children[0] as TElement).children).toContainEqual({
          text,
          ...mark,
        })
        expect(editor.api.string([])).toBe(text)
        expectVocabulary(editor.children)
      },
    )

    test.each(['#### ', '+ ', '1) ', '__underlined__'])(
      '"%s" has no rule and stays literal',
      (typed) => {
        const editor = editorAt([paragraph()])
        typeText(editor, `${typed}Verbs`)

        expect(editor.children as Value).toEqual([paragraph(`${typed}Verbs`)])
      },
    )

    test.each([
      ['## ', 'h2'],
      ['> ', 'blockquote'],
    ] as const)(
      '"%s" in a list item takes the item out of the list before converting it',
      (trigger, type) => {
        const editor = editorAt([listOf('ul', 'one', '', 'three')], [0, 1, 0])
        typeText(editor, `${trigger}Two`)

        expect(editor.children as Value).toEqual([
          listOf('ul', 'one'),
          { children: [{ text: 'Two' }], type },
          listOf('ul', 'three'),
        ])
        expectVocabulary(editor.children)
      },
    )

    test.each(blockTriggers)(
      '"%s" in a block that already is a %s stays literal',
      (trigger, type) => {
        const editor = editorAt([{ children: [{ text: '' }], type }])
        typeText(editor, `${trigger}Verbs`)

        expect(editor.children as Value).toEqual([
          { children: [{ text: `${trigger}Verbs` }], type },
        ])
      },
    )

    test.each(['- ', '1. '])(
      '"%s" in an existing list item stays literal',
      (trigger) => {
        const editor = editorAt([listOf('ul', 'one', '')], [0, 1, 0])
        typeText(editor, `${trigger}two`)

        expect(editor.children as Value).toEqual([
          listOf('ul', 'one', `${trigger}two`),
        ])
      },
    )
  })

  describe('applyBlock', () => {
    const deepestItem = (levels: number): Path => [
      0,
      0,
      ...Array.from({ length: levels - 1 }, () => [1, 0]).flat(),
      0,
    ]

    test('takes a nested item out of every list before making it a heading', () => {
      const editor = editorAt([nestedList(MAX_DEPTH)], deepestItem(MAX_DEPTH))
      applyBlock(editor, 'h2')

      expect(editor.children.at(-1)).toEqual({
        children: [{ text: `level ${MAX_DEPTH}` }],
        type: 'h2',
      })
      expect(listDepth(editor.children)).toBeLessThan(MAX_DEPTH)
      expectVocabulary(editor.children)
    })

    test('a list over an item at the cap only changes the type of that list', () => {
      const editor = editorAt([nestedList(MAX_DEPTH)], deepestItem(MAX_DEPTH))
      applyBlock(editor, 'ol')

      expect(listDepth(editor.children)).toBe(MAX_DEPTH)
      expect(
        richTextElementTypes(editor.children).filter((type) => type === 'ol'),
      ).toHaveLength(1)
      expectVocabulary(editor.children)
    })

    test.each(['h2', 'h3', 'blockquote', 'ul', 'ol'] satisfies RichTextBlock[])(
      '%s applied to a paragraph produces only vocabulary nodes',
      (block) => {
        const editor = editorAt([paragraph('Verbs')])
        applyBlock(editor, block)

        expect(richTextElementTypes(editor.children)[0]).toBe(block)
        expect(editor.api.string([])).toBe('Verbs')
        expectVocabulary(editor.children)
      },
    )
  })

  describe('pasted HTML', () => {
    test('headings outside the vocabulary map by level; tables stay tables and images keep only their text', () => {
      const editor = editorAt([paragraph()])
      const body = document.createElement('body')
      body.innerHTML =
        '<h1>One</h1><h4>Four</h4><h6>Six</h6>' +
        '<table><tr><td>a</td><td>b</td></tr></table>' +
        '<img src="x.png" alt="figure"><p>end</p>'
      editor.tf.insertFragment(editor.api.html.deserialize({ element: body }))
      editor.tf.normalize({ force: true })

      const blocks = editor.children.map((node) => [
        (node as TElement).type,
        editor.api.string([editor.children.indexOf(node)]),
      ])
      expect(blocks).toEqual([
        ['h2', 'One'],
        ['h3', 'Four'],
        ['h3', 'Six'],
        ['table', 'ab'],
        ['p', 'end'],
      ])
      expectVocabulary(editor.children)
    })
  })
})
