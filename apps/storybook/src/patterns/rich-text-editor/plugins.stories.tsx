import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  richTextElementTypes,
  richTextHasNodeId,
} from '@tc96/helpers/rich-text'
import {
  RICH_TEXT_ELEMENTS,
  RichTextEditor,
  type RichTextValue,
} from '@tc96/parttens'
import { expect, fn, waitFor } from 'storybook/test'
import { richTextTyping } from '../../test-utils/rich-text-typing'

const meta = {
  args: {
    'aria-label': 'Nota',
    onValueChange: fn(),
  },
  component: RichTextEditor,
  decorators: [
    (Story) => (
      <div className="w-2xl max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Plugins',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

const { focusEditor } = richTextTyping('Nota')

const textOf = (node: unknown): string => {
  const { children, text } = node as { children?: unknown[]; text?: string }
  return text ?? (children ?? []).map(textOf).join('')
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
    const calls = (args.onValueChange as ReturnType<typeof fn>).mock.calls
    const value = calls.at(-1)?.[0] as RichTextValue
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
