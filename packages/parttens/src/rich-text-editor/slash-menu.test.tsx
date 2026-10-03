import { afterEach, describe, expect, mock, test } from 'bun:test'
import { richTextElementTypes } from '@tc96/helpers/rich-text'
import type { TElement, Value } from 'platejs'
import { createPlateEditor } from 'platejs/react'
import { RICH_TEXT_EXTRA_BLOCKS } from './extra-blocks'
import {
  hasSlashInput,
  RICH_TEXT_BLOCKS,
  RICH_TEXT_ELEMENTS,
  richTextEditorOptions,
  SLASH_INPUT_TYPE,
} from './plugins'
import {
  applySlashMenuOption,
  currentSlashInput,
  dismissSlashInput,
  filterSlashMenuOptions,
  type SlashMenuBlock,
  slashMenuOptions,
} from './slash-menu'

await import('./test/dom')

const { act, cleanup, render } = await import('@testing-library/react')
const { Plate, PlateContent } = await import('platejs/react')
const { withoutSlashInput } = await import('./rich-text-editor')

afterEach(cleanup)

const MAX_DEPTH = 4

const labels = {
  blockquote: 'Citação',
  callout: 'Destaque',
  code: 'Bloco de código',
  date: 'Data de hoje',
  h2: 'Título de seção',
  h3: 'Subtítulo',
  hr: 'Divisor',
  image: 'Imagem',
  ol: 'Lista numerada',
  p: 'Texto',
  table: 'Tabela',
  todo: 'Lista de tarefas',
  ul: 'Lista com marcadores',
} as const satisfies Record<SlashMenuBlock, string>

const options = slashMenuOptions(labels)

const paragraph = (text = ''): TElement => ({ children: [{ text }], type: 'p' })

function editorAtEnd(value: Value) {
  const editor = createPlateEditor({
    ...richTextEditorOptions(MAX_DEPTH),
    nodeId: false,
    value,
  })
  const end = editor.api.end([0])
  if (!end) throw new Error('No end in the first block')
  editor.tf.select(end)
  return editor
}

function typeText(editor: ReturnType<typeof editorAtEnd>, text: string) {
  for (const char of text) editor.tf.insertText(char)
}

describe('slash menu options', () => {
  test('are the paragraph, every block of RICH_TEXT_BLOCKS and the extras, in that order', () => {
    expect(options.map((option) => option.block)).toEqual([
      'p',
      ...RICH_TEXT_BLOCKS,
      ...RICH_TEXT_EXTRA_BLOCKS,
    ])
    expect(options.map((option) => option.label)).toEqual([
      'Texto',
      'Título de seção',
      'Subtítulo',
      'Citação',
      'Lista com marcadores',
      'Lista numerada',
      'Lista de tarefas',
      'Destaque',
      'Bloco de código',
      'Divisor',
      'Data de hoje',
      'Tabela',
      'Imagem',
    ])
    for (const option of options.filter(
      (item) =>
        !(RICH_TEXT_EXTRA_BLOCKS as readonly string[]).includes(item.block),
    )) {
      expect(RICH_TEXT_ELEMENTS as readonly string[]).toContain(option.block)
    }
  })

  test.each([
    [
      '',
      [
        'p',
        'h2',
        'h3',
        'blockquote',
        'ul',
        'ol',
        'todo',
        'callout',
        'code',
        'hr',
        'date',
        'table',
        'image',
      ],
    ],
    ['titulo', ['h2']],
    ['tit', ['h2']],
    ['TÍTULO', ['h2']],
    ['subtitulo', ['h3']],
    ['lista', ['ul', 'ol', 'todo']],
    ['lista n', ['ol']],
    ['marcadores', ['ul']],
    ['cita', ['blockquote']],
    ['texto', ['p']],
    ['paragrafo', ['p']],
    ['xyz', []],
  ])('"%s" matches %j by label or unaccented synonym', (query, blocks) => {
    const found: string[] = filterSlashMenuOptions(options, query).map(
      (option) => option.block,
    )
    expect(found).toEqual(blocks)
  })
})

describe('slash input in the document', () => {
  test.each([
    ['at the start of a block', ''],
    ['after a space', 'before '],
  ])('"/" %s inserts a slash_input outside the vocabulary', (_, before) => {
    const editor = editorAtEnd([paragraph(before)])
    editor.tf.insertText('/')

    expect(hasSlashInput(editor.children)).toBe(true)
    expect(richTextElementTypes(editor.children)).toContain(SLASH_INPUT_TYPE)
    expect(currentSlashInput(editor)).toEqual({ path: [0, 1], query: '' })
  })

  test.each(['e', 'http:/'])(
    '"/" after "%s", in the middle of a word, stays literal',
    (before) => {
      const editor = editorAtEnd([paragraph(before)])
      editor.tf.insertText('/')

      expect(editor.children as Value).toEqual([paragraph(`${before}/`)])
      expect(currentSlashInput(editor)).toBeNull()
    },
  )

  test('what is typed after the "/" is the query', () => {
    const editor = editorAtEnd([paragraph('a ')])
    typeText(editor, '/tit')

    expect(currentSlashInput(editor)?.query).toBe('tit')
  })

  test('Backspace over the "/" removes the slash_input', () => {
    const editor = editorAtEnd([paragraph('a ')])
    typeText(editor, '/t')
    editor.tf.deleteBackward('character')
    editor.tf.deleteBackward('character')

    expect(editor.children as Value).toEqual([paragraph('a ')])
    expect(currentSlashInput(editor)).toBeNull()
  })

  test.each(['p', ...RICH_TEXT_BLOCKS] satisfies SlashMenuBlock[])(
    'applying %s makes the block that type and drops "/query"',
    (block) => {
      const editor = editorAtEnd([paragraph('Verbs ')])
      typeText(editor, '/anything')
      const input = currentSlashInput(editor)
      if (!input) throw new Error('No slash_input')

      applySlashMenuOption(editor, input, block)

      expect(richTextElementTypes(editor.children)[0]).toBe(block)
      expect(editor.api.string([])).toBe('Verbs ')
      expect(hasSlashInput(editor.children)).toBe(false)
    },
  )

  test('applying the paragraph to a heading turns it back into a paragraph', () => {
    const editor = editorAtEnd([{ children: [{ text: '' }], type: 'h2' }])
    editor.tf.insertText('/')
    const input = currentSlashInput(editor)
    if (!input) throw new Error('No slash_input')

    applySlashMenuOption(editor, input, 'p')

    expect(editor.children as Value).toEqual([paragraph()])
  })

  test('dismissing keeps "/query" as literal text', () => {
    const editor = editorAtEnd([paragraph('a ')])
    typeText(editor, '/tit')
    const input = currentSlashInput(editor)
    if (!input) throw new Error('No slash_input')

    dismissSlashInput(editor, input)

    expect(editor.children as Value).toEqual([paragraph('a /tit')])
    expect(currentSlashInput(editor)).toBeNull()
  })
})

describe('onValueChange while the menu is open', () => {
  test('never receives a slash_input and receives the clean document when the menu closes', async () => {
    const editor = editorAtEnd([paragraph('a')])
    const onValueChange = mock((_value: Value) => undefined)
    render(
      <Plate editor={editor} onValueChange={withoutSlashInput(onValueChange)}>
        <PlateContent />
      </Plate>,
    )

    await act(async () => editor.tf.insertText(' '))
    expect(onValueChange).toHaveBeenCalledTimes(1)

    await act(async () => editor.tf.insertText('/'))
    await act(async () => editor.tf.insertText('t'))
    expect(hasSlashInput(editor.children)).toBe(true)
    expect(onValueChange).toHaveBeenCalledTimes(1)

    const input = currentSlashInput(editor)
    if (!input) throw new Error('No slash_input')
    await act(async () => dismissSlashInput(editor, input))
    expect(onValueChange).toHaveBeenCalledTimes(2)
    expect(onValueChange.mock.calls.at(-1)?.[0]).toEqual([paragraph('a /t')])

    for (const [value] of onValueChange.mock.calls) {
      expect(hasSlashInput(value)).toBe(false)
    }
  })

  test('the cursor leaving the node by any change drops it to literal text', async () => {
    const editor = editorAtEnd([paragraph('a ')])
    render(
      <Plate editor={editor} onValueChange={withoutSlashInput()}>
        <PlateContent />
      </Plate>,
    )

    await act(async () => typeText(editor, '/tit'))
    expect(currentSlashInput(editor)).not.toBeNull()

    await act(async () => editor.tf.select(editor.api.start([0])))

    expect(currentSlashInput(editor)).toBeNull()
    expect(editor.children as Value).toEqual([paragraph('a /tit')])
  })
})
