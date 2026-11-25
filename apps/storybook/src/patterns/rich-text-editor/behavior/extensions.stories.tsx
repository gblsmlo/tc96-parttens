import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { richTextStats } from '@tc96/ui/helpers/rich-text'
import {
  addTableRow,
  RichTextAlignButton,
  RichTextBlockButton,
  RichTextEditor,
  type RichTextEditorInstance,
  RichTextHistoryButton,
  RichTextMarkButton,
  RichTextToolbar,
  type RichTextValue,
  toggleTableHeaderRow,
  useRichTextEditor,
} from '@tc96/ui/patterns'
import { ToolbarGroup, ToolbarSeparator } from '@tc96/ui/toolbar'
import { RangeApi } from 'platejs'
import { useEditorSelector } from 'platejs/react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  extendSelectionBackward,
  placeCaretAtEnd,
  queryFloatingToolbar,
  typedText,
} from '../../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import { paragraph } from '../rich-text-editor-data.ts'
import {
  expectVocabulary,
  lastValue,
  startTyping,
} from '../rich-text-editor-plays.ts'

const meta = {
  args: {
    'aria-label': 'Nota',
    onValueChange: fn(),
    placeholder: 'Escreva sua nota',
  },
  component: RichTextEditor,
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Behavior',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

const features = { align: true, h1: true } as const

function FixedToolbarEditor(
  props: Readonly<{ onValueChange?: (value: RichTextValue) => void }>,
) {
  const editor = useRichTextEditor({ features })
  return (
    <RichTextEditor
      aria-label="Nota"
      editor={editor}
      floatingToolbar={false}
      toolbar={
        <RichTextToolbar aria-label="Formatação do documento" className="mb-3">
          <ToolbarGroup>
            <RichTextHistoryButton action="undo" label="Desfazer" />
            <RichTextHistoryButton action="redo" label="Refazer" />
          </ToolbarGroup>
          <ToolbarSeparator orientation="vertical" />
          <ToolbarGroup>
            <RichTextBlockButton block="h1" label="Título 1" />
            <RichTextMarkButton label="Negrito" mark="bold" />
            <RichTextAlignButton alignment="center" label="Centralizar" />
          </ToolbarGroup>
        </RichTextToolbar>
      }
      {...(props.onValueChange ? { onValueChange: props.onValueChange } : {})}
    >
      <SelectionProbe />
    </RichTextEditor>
  )
}

function SelectionProbe() {
  const expanded = useEditorSelector(
    (current) =>
      current.selection !== null && RangeApi.isExpanded(current.selection),
    [],
  )
  return <output>{expanded ? 'com seleção' : 'sem seleção'}</output>
}

export const FixedToolbarFormatsTheDocument: Story = {
  render: (args) => <FixedToolbarEditor onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Formatação do documento',
    })
    const undo = within(toolbar).getByRole('button', { name: 'Desfazer' })
    await expect(undo).toHaveAttribute('aria-disabled', 'true')

    const editor = await startTyping(canvasElement, 'Olá mundo')
    await waitFor(() =>
      expect(undo).not.toHaveAttribute('aria-disabled', 'true'),
    )
    await extendSelectionBackward(editor, 5)
    await waitFor(() =>
      expect(canvas.getByRole('status')).toHaveTextContent('com seleção'),
    )
    await userEvent.click(
      within(toolbar).getByRole('button', { name: 'Negrito' }),
    )
    await waitFor(() =>
      expect(lastValue(args.onValueChange)[0]?.children).toContainEqual({
        bold: true,
        text: 'mundo',
      }),
    )
    await expect(queryFloatingToolbar()).toBeNull()

    await userEvent.click(undo)
    await waitFor(() =>
      expect(
        lastValue(args.onValueChange)[0]?.children.some((leaf) => leaf.bold),
      ).toBe(false),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const OptInHeadingAndAlignment: Story = {
  render: (args) => <FixedToolbarEditor onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Formatação do documento',
    })
    const editor = await startTyping(canvasElement, 'Contrato')
    await userEvent.click(
      within(toolbar).getByRole('button', { name: 'Título 1' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('h1')).toHaveTextContent('Contrato'),
    )
    await userEvent.click(
      within(toolbar).getByRole('button', { name: 'Centralizar' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('h1')?.style.textAlign).toBe('center'),
    )
    await expect(lastValue(args.onValueChange)[0]).toMatchObject({
      align: 'center',
      type: 'h1',
    })
  },
}

export const ReadOnlyIgnoresTyping: Story = {
  args: { defaultValue: [paragraph('Texto fixo')], readOnly: true },
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('document', { name: 'Nota' })
    await expect(editor).toHaveAttribute('contenteditable', 'false')
    placeCaretAtEnd(editor)
    await userEvent.keyboard('mais')
    await expect(typedText(editor)).toBe('Texto fixo')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Mover bloco' }),
    ).toBeNull()
  },
}

function ReplaceableDocument() {
  const editor = useRichTextEditor({ defaultValue: [paragraph('Primeira')] })
  return (
    <RichTextEditor
      aria-label="Nota"
      editor={editor}
      toolbar={<ReplaceButton editor={editor} />}
    >
      <WordCount />
    </RichTextEditor>
  )
}

function ReplaceButton({
  editor,
}: Readonly<{ editor: RichTextEditorInstance }>) {
  return (
    <Button
      onClick={() =>
        editor.tf.setValue([paragraph('Segunda versão do documento')])
      }
      size="sm"
      variant="outline"
    >
      Trocar documento
    </Button>
  )
}

function WordCount() {
  const words = useEditorSelector(
    (current) => richTextStats(current.children as RichTextValue).words,
    [],
  )
  return <output>{`${words} palavras`}</output>
}

export const ExternalEditorReplacesTheDocument: Story = {
  render: () => <ReplaceableDocument />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox')
    await waitFor(() => expect(typedText(editor)).toBe('Primeira'))
    await expect(canvas.getByRole('status')).toHaveTextContent('1 palavras')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Trocar documento' }),
    )
    await waitFor(() =>
      expect(typedText(editor)).toBe('Segunda versão do documento'),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent('4 palavras')
  },
}

const cell = (text: string) => ({
  children: [{ children: [{ text }], type: 'p' }],
  type: 'td',
})

const table: RichTextValue = [
  {
    children: [
      { children: [cell('A1'), cell('B1')], type: 'tr' },
      { children: [cell('A2'), cell('B2')], type: 'tr' },
    ],
    type: 'table',
  },
]

export const TableColumnResizesByKeyboard: Story = {
  args: { defaultValue: table },
  play: async ({ args, canvasElement }) => {
    const handles = within(canvasElement).getAllByRole('separator', {
      name: 'Redimensionar coluna',
    })
    await expect(handles.length).toBeGreaterThan(0)
    const before = handles[0]?.getBoundingClientRect().width ?? 0
    const column = handles[0]?.closest('td')
    const width = column?.getBoundingClientRect().width ?? 0
    handles[0]?.focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => {
      const next = lastValue(args.onValueChange)[0] as { colSizes?: number[] }
      expect(next.colSizes?.[0]).toBe(Math.round(width + 16))
    })
    await expect(before).toBeGreaterThanOrEqual(0)
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const TableHandlesHiddenWhenReadOnly: Story = {
  args: { defaultValue: table, readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('separator')).toBeNull()
  },
}

function TableActionsEditor(
  props: Readonly<{ onValueChange?: (value: RichTextValue) => void }>,
) {
  const editor = useRichTextEditor({ defaultValue: table })
  return (
    <RichTextEditor
      aria-label="Nota"
      editor={editor}
      toolbar={
        <div className="mb-3 flex gap-2">
          <Button
            onClick={() => addTableRow(editor, 'after')}
            onMouseDown={(event) => event.preventDefault()}
            size="sm"
            variant="outline"
          >
            Adicionar linha
          </Button>
          <Button
            onClick={() => toggleTableHeaderRow(editor)}
            onMouseDown={(event) => event.preventDefault()}
            size="sm"
            variant="outline"
          >
            Alternar cabeçalho
          </Button>
        </div>
      }
      {...(props.onValueChange ? { onValueChange: props.onValueChange } : {})}
    />
  )
}

export const TableActionsEditTheTableUnderTheCaret: Story = {
  render: (args) => <TableActionsEditor onValueChange={args.onValueChange} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox')
    placeCaretAtEnd(editor, editor.querySelector('[data-slate-string]'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar linha' }),
    )
    await waitFor(() =>
      expect(
        (lastValue(args.onValueChange)[0] as { children: unknown[] }).children,
      ).toHaveLength(3),
    )
    placeCaretAtEnd(editor, editor.querySelector('[data-slate-string]'))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alternar cabeçalho' }),
    )
    await waitFor(() => expect(editor.querySelectorAll('th')).toHaveLength(2))
  },
}

export const MentionWithAvatarShowsItInMenuAndText: Story = {
  args: {
    mentions: [
      { avatar: { fallback: 'BL' }, id: 'bruno', label: 'Bruno Lima' },
      { id: 'carla', label: 'Carla Dias' },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Oi')
    await userEvent.keyboard(' @br')
    const listbox = await screen.findByRole('listbox', { name: 'Pessoas' })
    await expect(within(listbox).getByText('BL')).toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(editor.querySelector('[data-slate-void=true]')).toHaveTextContent(
        'BL@Bruno Lima',
      ),
    )
    await expect(lastValue(args.onValueChange)[0]?.children).toContainEqual(
      expect.objectContaining({
        avatar: { fallback: 'BL' },
        type: 'mention',
        value: 'Bruno Lima',
      }),
    )
  },
}
