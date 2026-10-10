import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  EditorTitle,
  type EditorTitleHandle,
  RichTextEditor,
  type RichTextEditorHandle,
} from '@tc96/parttens'
import { useRef } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { richTextTyping, typedText } from '../../test-utils/rich-text-typing'

const meta = {
  args: {
    emptyLabel: 'Nota sem título',
    onArrowDownAtEnd: fn(),
    onChange: fn(),
    onEnter: fn(),
  },
  argTypes: {
    autoFocus: { control: 'boolean' },
  },
  component: EditorTitle,
  decorators: [
    (Story) => (
      <div className="w-2xl max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
  title: 'Patterns/Rich Text Editor/Editor Title',
} satisfies Meta<typeof EditorTitle>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { autoFocus: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { level: 1 })
    await expect(heading).toHaveAccessibleName('Nota sem título')
    const field = canvas.getByRole('textbox', { name: 'Título' })
    await expect(field).toHaveAttribute('placeholder', 'Nota sem título')
    await waitFor(() => expect(field).toHaveFocus())

    await userEvent.keyboard('Phrasal verbs{Enter}')
    await expect(args.onChange).toHaveBeenLastCalledWith('Phrasal verbs')
    await expect(args.onEnter).toHaveBeenCalledTimes(1)
    await expect(field).toHaveValue('Phrasal verbs')
    await userEvent.keyboard('{ArrowDown}')
    await expect(args.onArrowDownAtEnd).toHaveBeenCalledTimes(1)
  },
}

export const WithCounter: Story = {
  args: {
    counterFrom: 60,
    defaultValue:
      'Uma nota com um título bem comprido que se aproxima do limite de caracteres',
    max: 80,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    const counter = canvas.getByText('75/80')
    await expect(field).toHaveAttribute('aria-describedby', counter.id)
  },
}

function NotePage(): React.ReactElement {
  const title = useRef<EditorTitleHandle>(null)
  const body = useRef<RichTextEditorHandle>(null)
  return (
    <div className="flex flex-col gap-4">
      <EditorTitle
        autoFocus
        emptyLabel="Nota sem título"
        onArrowDownAtEnd={() => body.current?.focusStart()}
        onEnter={() => body.current?.focusStart()}
        ref={title}
      />
      <RichTextEditor
        aria-label="Nota"
        onExitStart={() => title.current?.focusEnd()}
        placeholder="Escreva sua nota, ou digite / para escolher um bloco"
        ref={body}
      />
    </div>
  )
}

export const NotePage_: Story = {
  name: 'Note page',
  render: () => <NotePage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const field = canvas.getByRole('textbox', { name: 'Título' })
    const editor = canvas.getByRole('textbox', { name: 'Nota' })

    await waitFor(() => expect(field).toHaveFocus())
    await userEvent.keyboard('Verbos{Enter}')
    await waitFor(() => expect(editor).toHaveFocus())

    const { startTyping } = richTextTyping('Nota')
    await startTyping(canvasElement, 'Corpo')
    await waitFor(() => expect(typedText(editor)).toBe('Corpo'))
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(field).toHaveFocus())
    await expect(field).toHaveValue('Verbos')
  },
}
