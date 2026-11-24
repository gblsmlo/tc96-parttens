import {
  richTextElementTypes,
  richTextHasNodeId,
} from '@tc96/ui/helpers/rich-text'
import {
  RICH_TEXT_ELEMENTS,
  type RichTextMark,
  type RichTextValue,
} from '@tc96/ui/patterns'
import {
  expect,
  type fn,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import {
  extendSelectionBackward,
  pressFloatingButton,
  richTextTyping,
  typedText,
} from '../../test-utils/rich-text-typing.ts'

export const { focusEditor, startTyping } = richTextTyping('Nota')

interface PlayContext {
  args: { onValueChange?: unknown }
  canvasElement: HTMLElement
}

export function lastValue(onValueChange: unknown): RichTextValue {
  const calls = (onValueChange as ReturnType<typeof fn>).mock.calls
  return calls.at(-1)?.[0] as RichTextValue
}

export function valuesOf(onValueChange: unknown): RichTextValue[] {
  return (onValueChange as ReturnType<typeof fn>).mock.calls.map(
    ([value]) => value as RichTextValue,
  )
}

export async function expectVocabulary(value: RichTextValue) {
  const outside = richTextElementTypes(value).filter(
    (type) => !(RICH_TEXT_ELEMENTS as readonly string[]).includes(type),
  )
  await expect(outside).toEqual([])
  await expect(richTextHasNodeId(value)).toBe(false)
}

export const maxListNesting = (nodes: readonly unknown[]): number =>
  Math.max(
    0,
    ...nodes.map((node) => {
      const { children, type } = node as { children?: unknown[]; type?: string }
      if (!children) return 0
      return (type === 'ul' || type === 'ol' ? 1 : 0) + maxListNesting(children)
    }),
  )

const markTag = {
  bold: 'strong',
  code: 'code',
  highlight: 'mark',
  italic: 'em',
  strikethrough: 's',
  underline: 'u',
} as const satisfies Record<RichTextMark, string>

const markLabel = {
  bold: 'Negrito',
  code: 'Código',
  highlight: 'Destaque de texto',
  italic: 'Itálico',
  strikethrough: 'Tachado',
  underline: 'Sublinhado',
} as const satisfies Record<RichTextMark, string>

export const selectionOf = (editor: HTMLElement) =>
  editor.ownerDocument.getSelection()

export const findSlashMenu = () =>
  screen.findByRole('listbox', { name: 'Blocos' })

export const querySlashMenu = () =>
  screen.queryByRole('listbox', { name: 'Blocos' })

export const optionNames = (listbox: HTMLElement) =>
  within(listbox)
    .queryAllByRole('option')
    .map((option) => option.textContent)

export function markPlay(mark: RichTextMark) {
  return async ({ args, canvasElement }: PlayContext) => {
    const editor = await startTyping(canvasElement, 'antes marcado')
    await extendSelectionBackward(editor, 'marcado'.length)

    const button = await pressFloatingButton(markLabel[mark])
    await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'))

    await waitFor(() =>
      expect(editor.querySelector(markTag[mark])).toHaveTextContent('marcado'),
    )
    await expect(selectionOf(editor)?.toString()).toBe('marcado')
    await expectVocabulary(lastValue(args.onValueChange))
  }
}

const shortcutCases = {
  blockquote: { selector: 'blockquote', shortcut: '> ' },
  h2: { selector: 'h2', shortcut: '## ' },
  h3: { selector: 'h3', shortcut: '### ' },
  ol: { selector: 'ol > li', shortcut: '1. ' },
  ul: { selector: 'ul > li', shortcut: '- ' },
} as const

export function shortcutPlay(block: keyof typeof shortcutCases) {
  const { selector, shortcut } = shortcutCases[block]
  return async ({ args, canvasElement }: PlayContext) => {
    const editor = await startTyping(
      canvasElement,
      `${shortcut}Verbos`,
      'Verbos',
    )

    await waitFor(() =>
      expect(editor.querySelector(selector)).toHaveTextContent('Verbos'),
    )
    await expect(typedText(editor)).toBe('Verbos')
    await expectVocabulary(lastValue(args.onValueChange))
  }
}

export async function dragSelection(
  editor: HTMLElement,
  from: number,
  to: number,
) {
  const text = editor.querySelector('[data-slate-string]') as HTMLElement
  await userEvent.pointer([
    { keys: '[MouseLeft>]', offset: from, target: text },
    { offset: to, target: text },
    { keys: '[/MouseLeft]' },
  ])
  return text
}
