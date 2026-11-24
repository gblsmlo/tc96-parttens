import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  richTextElementTypes,
  richTextHasNodeId,
} from '@tc96/ui/helpers/rich-text'
import { RICH_TEXT_ELEMENTS, RichTextEditor } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  extendSelectionBackward,
  queryFloatingToolbar,
  richTextTyping,
  typedText,
} from '../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from './rich-text-editor-canvas.tsx'
import {
  englishLabels,
  everyNode,
  fullDocument,
} from './rich-text-editor-data.ts'
import {
  expectVocabulary,
  focusEditor,
  lastValue,
  optionNames,
  startTyping,
} from './rich-text-editor-plays.ts'

const meta = {
  args: {
    'aria-label': 'Nota',
    onExitStart: fn(),
    onValueChange: fn(),
    placeholder: 'Escreva sua nota, ou digite / para escolher um bloco',
  },
  component: RichTextEditor,
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Behavior',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

const textOf = (node: unknown): string => {
  const { children, text } = node as { children?: unknown[]; text?: string }
  return text ?? (children ?? []).map(textOf).join('')
}

export const PlaceholderShowsUntilTyping: Story = {
  args: { autoFocus: true },
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    await waitFor(() => expect(editor).toHaveFocus())
    await expect(editor).toHaveAttribute(
      'aria-placeholder',
      'Escreva sua nota, ou digite / para escolher um bloco',
    )
    const placeholder = editor.querySelector('[data-slate-placeholder]')
    await expect(placeholder).toHaveAttribute('aria-hidden', 'true')
    await expect(placeholder).toBeVisible()
    await expect(typedText(editor)).toBe('')
    await expect(queryFloatingToolbar()).toBeNull()

    await startTyping(canvasElement, 'Olá')
    await expect(editor.querySelector('[data-slate-placeholder]')).toBeNull()
    await expect(queryFloatingToolbar()).toBeNull()
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const PlaceholderKeepsFullOpacity: Story = {
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    const placeholder = editor.querySelector('[data-slate-placeholder]')

    await expect(placeholder).toBeVisible()
    await expect(getComputedStyle(placeholder as Element).opacity).toBe('1')
  },
}

export const RendersEveryElementAndMark: Story = {
  args: { defaultValue: everyNode },
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })

    await expect(editor.querySelector('[data-slate-placeholder]')).toBeNull()
    await expect(editor.querySelector('h2')).toHaveTextContent('Título da nota')
    await expect(editor.querySelector('h3')).toHaveTextContent('Uma seção')
    await expect(editor.querySelector('blockquote')).toHaveTextContent(
      'Uma citação.',
    )
    await expect(editor.querySelector('ul > li ol > li')).toHaveTextContent(
      'Aninhado',
    )
    for (const [tag, text] of [
      ['strong', 'negrito'],
      ['em', 'itálico'],
      ['u', 'sublinhado'],
      ['s', 'tachado'],
      ['code', 'código'],
    ] as const) {
      await expect(editor.querySelector(tag)).toHaveTextContent(text)
    }
  },
}

export const RendersAFullDocument: Story = {
  args: { defaultValue: fullDocument },
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    await expect(editor.querySelectorAll('h2')).toHaveLength(1)
    await expect(editor.querySelectorAll('h3')).toHaveLength(3)
    await expect(editor.querySelectorAll('blockquote')).toHaveLength(1)
    await expect(editor.querySelectorAll('ul > li')).toHaveLength(4)
    await expect(editor.querySelectorAll('ul > li > ol > li')).toHaveLength(3)
    await expect(editor.querySelectorAll(':scope > ol > li')).toHaveLength(3)
    for (const tag of ['strong', 'em', 'u', 's', 'code'] as const) {
      await expect(editor.querySelector(tag)).not.toBeNull()
    }
    await expect(
      editor.querySelector('strong > em, em > strong'),
    ).not.toBeNull()
  },
}

export const DefaultValueIsNotEmitted: Story = {
  args: { defaultValue: everyNode },
  play: async ({ args }) => {
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const EditableHasNoBoxOfItsOwn: Story = {
  args: { defaultValue: everyNode },
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    const style = getComputedStyle(editor)
    await expect(style.borderWidth).toBe('0px')
    await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  },
}

export const LabelsCanBeReplaced: Story = {
  args: {
    'aria-label': 'Note',
    ...englishLabels,
    placeholder: 'Write your note, or type / to pick a block',
  },
  play: async ({ canvasElement }) => {
    const { startTyping: startTypingNote } = richTextTyping('Note')
    const editor = await startTypingNote(canvasElement, 'Some text')
    await userEvent.keyboard('{Enter}/')
    const listbox = await screen.findByRole('listbox', { name: 'Blocks' })
    await expect(optionNames(listbox)).toEqual([
      'Text',
      'Section heading',
      'Subheading',
      'Quote',
      'Bulleted list',
      'Numbered list',
      'Task list',
      'Callout',
      'Code block',
      'Divider',
      'Today’s date',
      'Table',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { name: 'Blocks' })).toBeNull(),
    )

    await extendSelectionBackward(editor, '/'.length)
    const toolbar = await screen.findByRole('toolbar', { name: 'Formatting' })
    await waitFor(() =>
      expect(
        within(toolbar).getByRole('button', { name: 'Bold' }),
      ).toBeVisible(),
    )
    await expect(
      within(toolbar).getByRole('button', { name: 'Section heading' }),
    ).toBeInTheDocument()
  },
}

export const PastedHtmlMapsToVocabulary: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await focusEditor(canvasElement)
    const html =
      '<h1>One</h1><h4>Four</h4><h6>Six</h6>' +
      '<table><tr><td>a</td><td>b</td></tr></table>' +
      '<img src="x.png" alt="figure"><p>end</p>'
    const data = new DataTransfer()
    data.setData('text/html', html)
    data.setData('text/plain', 'One Four Six a b end')

    editor.dispatchEvent(
      new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        dataTransfer: data,
        inputType: 'insertFromPaste',
      }),
    )

    await waitFor(() => expect(args.onValueChange).toHaveBeenCalled())
    const value = lastValue(args.onValueChange)
    await expect(
      value.map((node) => [(node as { type: string }).type, textOf(node)]),
    ).toEqual([
      ['h2', 'One'],
      ['h3', 'Four'],
      ['h3', 'Six'],
      ['table', 'ab'],
      ['p', 'end'],
    ])
    await expect(
      richTextElementTypes(value).filter(
        (type) => !(RICH_TEXT_ELEMENTS as readonly string[]).includes(type),
      ),
    ).toEqual([])
    await expect(richTextHasNodeId(value)).toBe(false)
  },
}
