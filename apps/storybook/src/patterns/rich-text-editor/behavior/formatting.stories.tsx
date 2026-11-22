import type { Meta, StoryObj } from '@storybook/react-vite'
import { defaultMaxListDepth, RichTextEditor } from '@tc96/parttens'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import {
  expectVocabulary,
  lastValue,
  markPlay,
  maxListNesting,
  shortcutPlay,
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

export const ToolbarTogglesBold: Story = {
  play: markPlay('bold'),
}

export const ToolbarTogglesItalic: Story = {
  play: markPlay('italic'),
}

export const ToolbarTogglesUnderline: Story = {
  play: markPlay('underline'),
}

export const ToolbarTogglesStrikethrough: Story = {
  play: markPlay('strikethrough'),
}

export const ToolbarTogglesCode: Story = {
  play: markPlay('code'),
}

export const ToolbarTogglesHighlight: Story = {
  play: markPlay('highlight'),
}

export const ShortcutMakesHeading: Story = {
  play: shortcutPlay('h2'),
}

export const ShortcutMakesSubheading: Story = {
  play: shortcutPlay('h3'),
}

export const ShortcutMakesBlockquote: Story = {
  play: shortcutPlay('blockquote'),
}

export const ShortcutMakesBulletedList: Story = {
  play: shortcutPlay('ul'),
}

export const ShortcutMakesNumberedList: Story = {
  play: shortcutPlay('ol'),
}

export const NestedListsStopAtTheCap: Story = {
  play: async ({ args, canvasElement }) => {
    const levels = ['um', 'dois', 'três', 'quatro', 'cinco']
    const editor = await startTyping(canvasElement, '- um', 'um')
    await waitFor(() =>
      expect(editor.querySelector('ul > li')).toHaveTextContent('um'),
    )

    for (const [index, text] of levels.slice(1).entries()) {
      await userEvent.keyboard(`{Enter}${text}`)
      await waitFor(() => expect(editor).toHaveTextContent(text))
      await userEvent.tab()
      if (index < defaultMaxListDepth - 1) {
        await waitFor(() => expect(editor).toHaveFocus())
      }
    }

    await expect(editor).not.toHaveFocus()
    const value = lastValue(args.onValueChange)
    await expect(maxListNesting(value)).toBe(defaultMaxListDepth)
    await expectVocabulary(value)
  },
}

export const TabLeavesAList: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, '- item', 'item')
    await waitFor(() =>
      expect(editor.querySelector('ul > li')).toHaveTextContent('item'),
    )
    await waitFor(() => expect(editor).toHaveFocus())

    await userEvent.tab()
    await expect(editor).not.toHaveFocus()
    await expect(editor.querySelectorAll('ul')).toHaveLength(1)
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SingleLevelListsDoNotNest: Story = {
  args: { maxListDepth: 1 },
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, '- um', 'um')
    await userEvent.keyboard('{Enter}dois')
    await waitFor(() => expect(editor).toHaveTextContent('dois'))
    await userEvent.tab()
    await expect(editor).not.toHaveFocus()
    await expect(maxListNesting(lastValue(args.onValueChange))).toBe(1)
    await expectVocabulary(lastValue(args.onValueChange))
  },
}
