import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  placeCaretAtEnd,
  typedText,
} from '../../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import { paragraph } from '../rich-text-editor-data.ts'
import { expectVocabulary, lastValue } from '../rich-text-editor-plays.ts'

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

const threeBlocks = [
  paragraph('Primeiro'),
  paragraph('Segundo'),
  paragraph('Terceiro'),
]

const HandleRoom: Decorator = (Story) => (
  <div className="ps-10">
    <Story />
  </div>
)

export const HandlesMoveBlocksByKeyboard: Story = {
  args: { defaultValue: threeBlocks, draggableBlocks: true },
  decorators: [HandleRoom],
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox')
    const handles = within(canvasElement).getAllByRole('button', {
      name: 'Mover bloco',
    })
    await expect(handles).toHaveLength(3)

    handles[0]?.focus()
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}')
    await waitFor(() =>
      expect(typedText(editor)).toBe('SegundoPrimeiroTerceiro'),
    )

    const moved = within(canvasElement).getAllByRole('button', {
      name: 'Mover bloco',
    })
    moved[2]?.focus()
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}')
    await waitFor(() =>
      expect(typedText(editor)).toBe('SegundoTerceiroPrimeiro'),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const EscapeSelectsTheCurrentBlock: Story = {
  args: { defaultValue: threeBlocks, draggableBlocks: true },
  decorators: [HandleRoom],
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox')
    placeCaretAtEnd(editor, editor.querySelector('[data-slate-string]'))
    await waitFor(() => expect(editor).toHaveFocus())

    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll('[data-block-selected]'),
      ).toHaveLength(1),
    )

    await waitFor(() =>
      expect(screen.getByLabelText('Blocos selecionados')).toHaveFocus(),
    )
    await userEvent.keyboard('{Backspace}')
    await waitFor(() => expect(typedText(editor)).toBe('SegundoTerceiro'))
    await expectVocabulary(lastValue(args.onValueChange))
  },
}
