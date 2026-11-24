import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  extendSelectionBackward,
  findFloatingToolbar,
  pressFloatingButton,
  queryFloatingToolbar,
} from '../../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import {
  dragSelection,
  expectVocabulary,
  lastValue,
  selectionOf,
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

export const ToolbarOpensOnSelection: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    await expect(queryFloatingToolbar()).toBeNull()

    const text = await dragSelection(editor, 4, 10)
    await waitFor(() => expect(selectionOf(editor)?.toString()).toBe('frase '))

    const toolbar = await findFloatingToolbar()
    await expect(editor).toHaveFocus()
    await expect(toolbar.closest('[data-slot=popover-popup]')).toHaveAttribute(
      'role',
      'presentation',
    )
    const selectionRect = selectionOf(editor)
      ?.getRangeAt(0)
      .getBoundingClientRect()
    const toolbarRect = toolbar.getBoundingClientRect()
    await expect(selectionRect).toBeDefined()
    await expect(
      toolbarRect.bottom <= (selectionRect?.top ?? 0) ||
        toolbarRect.top >= (selectionRect?.bottom ?? 0),
    ).toBe(true)

    const bold = await pressFloatingButton('Negrito')
    await waitFor(() => expect(bold).toHaveAttribute('aria-pressed', 'true'))
    await expect(editor).toHaveFocus()
    await expect(selectionOf(editor)?.toString()).toBe('frase ')
    await waitFor(() =>
      expect(editor.querySelector('strong')).toHaveTextContent('frase'),
    )

    const heading = await pressFloatingButton('Título de seção')
    await waitFor(() => expect(heading).toHaveAttribute('aria-pressed', 'true'))
    await waitFor(() =>
      expect(editor.querySelector('h2')).toHaveTextContent('Uma frase'),
    )
    const list = await pressFloatingButton('Lista com marcadores')
    await waitFor(() => expect(list).toHaveAttribute('aria-pressed', 'true'))
    await waitFor(() =>
      expect(editor.querySelector('ul > li')).toHaveTextContent('Uma frase'),
    )
    await expect(editor.querySelector('h2')).toBeNull()

    await userEvent.click(text)
    await waitFor(() => expect(queryFloatingToolbar()).toBeNull())
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const ToolbarBlockTypeSelectChangesTheBlock: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    await dragSelection(editor, 4, 10)

    const toolbar = await findFloatingToolbar()
    const trigger = within(toolbar).getByRole('combobox', {
      name: 'Tipo de bloco',
    })
    await expect(trigger).toHaveTextContent('Texto')

    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('option', { name: 'Título de seção' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('h2')).toHaveTextContent('Uma frase'),
    )
    await expect(queryFloatingToolbar()).not.toBeNull()
    await waitFor(() => expect(editor).toHaveFocus())
    await expect(trigger).toHaveTextContent('Título de seção')

    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Texto' }))
    await waitFor(() => expect(editor.querySelector('h2')).toBeNull())
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const ToolbarLinkAppliesTheAddress: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    await dragSelection(editor, 4, 9)

    const toolbar = await findFloatingToolbar()
    await userEvent.click(within(toolbar).getByRole('button', { name: 'Link' }))
    const input = await screen.findByRole('textbox', {
      name: 'Endereço do link',
    })
    await userEvent.type(input, 'https://example.com{Enter}')

    await waitFor(() =>
      expect(editor.querySelector('a')).toHaveAttribute(
        'href',
        'https://example.com',
      ),
    )
    await waitFor(() => expect(editor).toHaveFocus())
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const ToolbarReachableByKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma leve')
    await extendSelectionBackward(editor, 'leve'.length)
    const toolbar = await findFloatingToolbar()
    const blockType = within(toolbar).getByRole('combobox', {
      name: 'Tipo de bloco',
    })
    const bold = within(toolbar).getByRole('button', { name: 'Negrito' })
    const italic = within(toolbar).getByRole('button', { name: 'Itálico' })
    await expect(editor).toHaveFocus()

    await userEvent.keyboard('{Alt>}{F10}{/Alt}')
    await expect(blockType).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    await expect(bold).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')
    await expect(italic).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(editor.querySelector('em')).toHaveTextContent('leve'),
    )
    await waitFor(() => expect(editor).toHaveFocus())
    await expect(selectionOf(editor)?.toString()).toBe('leve')
    await waitFor(() => expect(italic).toHaveAttribute('aria-pressed', 'true'))

    await userEvent.keyboard('{Alt>}{F10}{/Alt}')
    await expect(blockType).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(editor).toHaveFocus())
    await expect(selectionOf(editor)?.toString()).toBe('leve')
    await waitFor(() => expect(queryFloatingToolbar()).toBeNull())
    await expect(editor.querySelector('strong')).toBeNull()

    await userEvent.keyboard('{Control>}b{/Control}')
    await waitFor(() =>
      expect(editor.querySelector('strong')).toHaveTextContent('leve'),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}
