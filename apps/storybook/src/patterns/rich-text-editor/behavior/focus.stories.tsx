import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor, type RichTextEditorHandle } from '@tc96/parttens'
import { useRef } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  expectCaretAtStart,
  typedText,
} from '../../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import { richTextEditorControlArgs } from '../rich-text-editor-controls.ts'
import { ComposedRichTextEditor } from '../rich-text-editor-layouts.tsx'
import {
  expectVocabulary,
  lastValue,
  startTyping,
} from '../rich-text-editor-plays.ts'

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

export const ExitByTheStartCallsOnExitStart: Story = {
  render: function ExitByTheStartSurface(args) {
    const editor = useRef<RichTextEditorHandle>(null)
    return (
      <div className="flex flex-col gap-4">
        <button onClick={() => editor.current?.focusStart()} type="button">
          Ir ao início
        </button>
        <RichTextEditor {...args} ref={editor} />
      </div>
    )
  },
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Linha um')
    await userEvent.keyboard('{Enter}Linha dois')
    await waitFor(() => expect(typedText(editor)).toBe('Linha umLinha dois'))

    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{Backspace}')
    await expect(args.onExitStart).not.toHaveBeenCalled()
    await expect(typedText(editor)).toBe('Linha umLinha doi')

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ir ao início' }),
    )
    await expectCaretAtStart(editor)
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(args.onExitStart).toHaveBeenCalledTimes(1))
    await userEvent.keyboard('{Backspace}')
    await waitFor(() => expect(args.onExitStart).toHaveBeenCalledTimes(2))
    await expect(typedText(editor)).toBe('Linha umLinha doi')
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const FocusMovesBetweenTitleAndBody: Story = {
  render: () => (
    <ComposedRichTextEditor {...richTextEditorControlArgs} autoFocusTitle />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    const editor = canvas.getByRole('textbox', { name: 'Nota' })

    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.keyboard('Verbos{Enter}')
    await waitFor(() => expect(editor).toHaveFocus())

    await startTyping(canvasElement, 'Corpo')
    await waitFor(() => expect(typedText(editor)).toBe('Corpo'))
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(field).toHaveFocus())
    await expect(field).toHaveValue('Verbos')
  },
}
