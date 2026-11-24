import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor, type RichTextValue } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  placeCaretAtEnd,
  typedText,
} from '../../../test-utils/rich-text-typing.ts'
import { RichTextEditorCanvas } from '../rich-text-editor-canvas.tsx'
import { paragraph, pixel, sampleMentions } from '../rich-text-editor-data.ts'
import {
  expectVocabulary,
  findSlashMenu,
  focusEditor,
  lastValue,
  optionNames,
  querySlashMenu,
  startTyping,
  valuesOf,
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

const hasTriggerInput = (value: RichTextValue) =>
  /"type":"(slash|mention)_input"/.test(JSON.stringify(value))

export const SlashMenuChoosesByKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')
    await userEvent.keyboard('{Enter}/')

    const listbox = await findSlashMenu()
    await expect(editor).toHaveFocus()
    await expect(editor).toHaveAttribute('aria-controls', listbox.id)
    await expect(optionNames(listbox)).toHaveLength(12)
    const text = within(listbox).getByRole('option', { name: 'Texto' })
    await expect(editor).toHaveAttribute('aria-activedescendant', text.id)

    await userEvent.keyboard('{ArrowDown}')
    const heading = within(listbox).getByRole('option', {
      name: 'Título de seção',
    })
    await waitFor(() =>
      expect(editor).toHaveAttribute('aria-activedescendant', heading.id),
    )
    await expect(heading).toHaveAttribute('aria-selected', 'true')
    await expect(editor).toHaveFocus()

    await userEvent.keyboard('tit')
    await waitFor(() =>
      expect(optionNames(listbox)).toEqual(['Título de seção']),
    )
    await expect(typedText(editor)).toBe('Intro/tit')
    await expect(editor).toHaveAttribute('aria-activedescendant', heading.id)

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await waitFor(() => expect(editor.querySelector('h2')).not.toBeNull())
    await expect(typedText(editor)).toBe('Intro')
    await expect(editor).not.toHaveAttribute('aria-activedescendant')
    await expect(editor).toHaveFocus()

    await userEvent.keyboard('Seção')
    await waitFor(() =>
      expect(editor.querySelector('h2')).toHaveTextContent('Seção'),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SlashMenuChoosesByPointer: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')
    await userEvent.keyboard('{Enter}/')
    const listbox = await findSlashMenu()

    const numbered = within(listbox).getByRole('option', {
      name: 'Lista numerada',
    })
    await userEvent.hover(numbered)
    await waitFor(() =>
      expect(editor).toHaveAttribute('aria-activedescendant', numbered.id),
    )
    await expect(editor).toHaveFocus()

    await userEvent.click(
      within(listbox).getByRole('option', { name: 'Citação' }),
    )
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await waitFor(() =>
      expect(editor.querySelector('blockquote')).not.toBeNull(),
    )
    await expect(editor).toHaveFocus()

    await userEvent.keyboard('Citada')
    await waitFor(() =>
      expect(editor.querySelector('blockquote')).toHaveTextContent('Citada'),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SlashMenuDismisses: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')

    await userEvent.keyboard(' /')
    await findSlashMenu()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expect(typedText(editor)).toBe('Intro /')
    await expect(editor).toHaveFocus()

    await userEvent.keyboard(' /xyz')
    await findSlashMenu()
    await userEvent.keyboard(' ')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expect(typedText(editor)).toBe('Intro / /xyz ')

    await userEvent.keyboard('e/ou')
    await expect(typedText(editor)).toBe('Intro / /xyz e/ou')
    await expect(querySlashMenu()).toBeNull()

    await userEvent.keyboard(' /ti')
    await findSlashMenu()
    await userEvent.keyboard('{Backspace}{Backspace}')
    await expect(querySlashMenu()).not.toBeNull()
    await userEvent.keyboard('{Backspace}')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expect(typedText(editor)).toBe('Intro / /xyz e/ou ')
    await expect(editor).toHaveFocus()

    await userEvent.keyboard('/ti')
    await findSlashMenu()
    await userEvent.click(canvasElement.ownerDocument.body)
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expect(editor).not.toHaveFocus()
    await expect(typedText(editor)).toBe('Intro / /xyz e/ou /ti')
    await waitFor(() =>
      expect(JSON.stringify(lastValue(args.onValueChange))).toContain('/ti'),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SlashMenuShowsAStatusWithNoMatch: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')
    await userEvent.keyboard('{Enter}/xyz')

    const listbox = await findSlashMenu()
    await waitFor(() => expect(optionNames(listbox)).toEqual([]))
    const status = await screen.findByText('Nenhum bloco com esse nome')
    await waitFor(() => expect(status).toBeVisible())
    await expect(editor).toHaveFocus()
    await expect(editor).not.toHaveAttribute('aria-activedescendant')

    await userEvent.keyboard('{Backspace}{Backspace}{Backspace}cit')
    await waitFor(() => expect(optionNames(listbox)).toEqual(['Citação']))
    await expect(status).toHaveTextContent('')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SlashMenuInsertsExtraBlocks: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')

    await userEvent.keyboard('{Enter}/tarefa{Enter}Comprar pão')
    await waitFor(() =>
      expect(
        editor.querySelector('[data-slate-node=element] [role=checkbox]'),
      ).not.toBeNull(),
    )
    await userEvent.click(within(editor).getByRole('checkbox'))
    await waitFor(() =>
      expect(within(editor).getByRole('checkbox')).toBeChecked(),
    )

    await userEvent.keyboard('{Enter}{Enter}/destaque{Enter}Atenção')
    await waitFor(() => expect(editor.textContent).toContain('Atenção'))

    await userEvent.keyboard('{Enter}{Enter}/codigo{Enter}const a = 1')
    await waitFor(() =>
      expect(editor.querySelector('pre')).toHaveTextContent('const a = 1'),
    )

    await userEvent.keyboard('{Enter}{Enter}/divisor{Enter}Fim')
    await waitFor(() => expect(editor.querySelector('hr')).not.toBeNull())

    await userEvent.keyboard('{Enter}/data{Enter}')
    await waitFor(() => expect(editor.querySelector('time')).not.toBeNull())

    await userEvent.keyboard('{Enter}/tabela{Enter}')
    await waitFor(() =>
      expect(editor.querySelectorAll('td, th').length).toBe(9),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const TaskBlockCheckboxIsPartOfTheValue: Story = {
  args: {
    defaultValue: [
      {
        checked: true,
        children: [{ text: 'Revisar o layout' }],
        type: 'action_item',
      },
      {
        checked: false,
        children: [{ text: 'Ligar o filtro' }],
        type: 'action_item',
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    const boxes = within(editor).getAllByRole('checkbox')
    await expect(boxes).toHaveLength(2)
    await expect(boxes[0]).toBeChecked()
    await expect(boxes[1]).not.toBeChecked()

    await userEvent.click(boxes[1] as HTMLElement)
    await waitFor(() => expect(boxes[1]).toBeChecked())
    await waitFor(() =>
      expect(
        lastValue(args.onValueChange).map(
          (node) => (node as { checked?: boolean }).checked,
        ),
      ).toEqual([true, true]),
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const ValueChangeSkipsOpenMenu: Story = {
  args: { defaultValue: [paragraph('a')] },
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

export const CaretLeavingDropsTheMenuToLiteral: Story = {
  args: { defaultValue: [paragraph('a')] },
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

export const MentionsInsertAPerson: Story = {
  args: { mentions: sampleMentions },
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Oi')
    await userEvent.keyboard(' @br')

    const listbox = await screen.findByRole('listbox', { name: 'Pessoas' })
    await waitFor(() => expect(optionNames(listbox)).toEqual(['Bruno Lima']))
    await userEvent.keyboard('{Enter}')

    await waitFor(() =>
      expect(editor.querySelector('[data-slate-void=true]')).toHaveTextContent(
        '@Bruno Lima',
      ),
    )
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { name: 'Pessoas' })).toBeNull(),
    )
    await expect(JSON.stringify(lastValue(args.onValueChange))).toContain(
      '"value":"Bruno Lima"',
    )
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const ImagePickerInsertsAnImage: Story = {
  args: {
    onPickImage: fn(async () => ({ alt: 'capa.png', url: pixel })),
  },
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Intro')
    await userEvent.keyboard('{Enter}/imagem{Enter}')

    await waitFor(() => expect(args.onPickImage).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(editor.querySelector('img')).toHaveAttribute('alt', 'capa.png'),
    )
    await waitFor(() =>
      expect(JSON.stringify(lastValue(args.onValueChange))).toContain('"img"'),
    )
    await waitFor(() => expect(querySlashMenu()).toBeNull())
    await expectVocabulary(lastValue(args.onValueChange))
  },
}
