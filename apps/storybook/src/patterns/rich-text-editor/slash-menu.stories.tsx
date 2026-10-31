import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor, type RichTextValue } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'
import {
  placeCaretAtEnd,
  richTextTyping,
  typedText,
} from '../../test-utils/rich-text-typing'

const baseUiFocusGuards = {
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-hidden-focus',
          selector: '[aria-hidden="true"]:not([data-base-ui-focus-guard])',
        },
      ],
    },
  },
}

const paragraph = (text: string) => ({ children: [{ text }], type: 'p' })

const meta = {
  args: {
    'aria-label': 'Nota',
    defaultValue: [paragraph('a')],
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
  parameters: { ...baseUiFocusGuards, layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Slash Menu',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

const { focusEditor } = richTextTyping('Nota')

const findSlashMenu = () => screen.findByRole('listbox', { name: 'Blocos' })
const querySlashMenu = () => screen.queryByRole('listbox', { name: 'Blocos' })

const valuesOf = (onValueChange: unknown) =>
  (onValueChange as ReturnType<typeof fn>).mock.calls.map(
    ([value]) => value as RichTextValue,
  )

const hasTriggerInput = (value: RichTextValue) =>
  /"type":"(slash|mention)_input"/.test(JSON.stringify(value))

export const ValueChangeSkipsOpenMenu: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await focusEditor(canvasElement)
    placeCaretAtEnd(editor)
    const onValueChange = args.onValueChange as ReturnType<typeof fn>
    onValueChange.mockClear()

    await userEvent.keyboard(' ')
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1))

    await userEvent.keyboard('/t')
    await findSlashMenu()
    await waitFor(() => expect(typedText(editor)).toBe('a /t'))
    await expect(onValueChange).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(2))
    await expect(onValueChange).toHaveBeenLastCalledWith([paragraph('a /t')])

    for (const value of valuesOf(onValueChange)) {
      await expect(hasTriggerInput(value)).toBe(false)
    }
  },
}

export const CaretLeavingDropsToLiteral: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await focusEditor(canvasElement)
    placeCaretAtEnd(editor)

    await userEvent.keyboard(' /tit')
    await findSlashMenu()
    await waitFor(() => expect(typedText(editor)).toBe('a /tit'))

    const firstText = editor.querySelector('[data-slate-string]')?.firstChild
    editor.ownerDocument.getSelection()?.collapse(firstText ?? editor, 0)
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expect(typedText(editor)).toBe('a /tit')
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenLastCalledWith([
        paragraph('a /tit'),
      ]),
    )
  },
}
