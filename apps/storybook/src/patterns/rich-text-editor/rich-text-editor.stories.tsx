import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  richTextElementTypes,
  richTextHasNodeId,
} from '@tc96/helpers/rich-text'
import {
  defaultMaxListDepth,
  RICH_TEXT_ELEMENTS,
  RichTextEditor,
  type RichTextEditorHandle,
  type RichTextMark,
  type RichTextValue,
} from '@tc96/parttens'
import { useRef } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  expectCaretAtStart,
  extendSelectionBackward,
  findFloatingToolbar,
  placeCaretAtEnd,
  pressFloatingButton,
  queryFloatingToolbar,
  richTextTyping,
  typedText,
} from '../../test-utils/rich-text-typing'

// O Popover do Base UI cerca o popup com guardas de foco (`tabindex=0` sob
// `aria-hidden`), que o axe reprova em `aria-hidden-focus`; sao do COSS, nao
// do pattern, e so existem enquanto a barra ou o menu `/` estao abertos.
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

const meta = {
  args: {
    'aria-label': 'Nota',
    onExitStart: fn(),
    onValueChange: fn(),
    placeholder: 'Escreva sua nota, ou digite / para escolher um bloco',
  },
  argTypes: {
    'aria-label': { control: 'text' },
    autoFocus: { control: 'boolean' },
    maxListDepth: { control: 'number' },
    placeholder: { control: 'text' },
    toolbarLabel: { control: 'text' },
  },
  component: RichTextEditor,
  decorators: [
    (Story) => (
      <div className="w-2xl max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    ...baseUiFocusGuards,
    layout: 'padded',
  },
  title: 'Patterns/Rich Text Editor',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

const { startTyping } = richTextTyping('Nota')

function lastValue(onValueChange: unknown): RichTextValue {
  const calls = (onValueChange as ReturnType<typeof fn>).mock.calls
  return calls.at(-1)?.[0] as RichTextValue
}

async function expectVocabulary(value: RichTextValue) {
  const outside = richTextElementTypes(value).filter(
    (type) => !(RICH_TEXT_ELEMENTS as readonly string[]).includes(type),
  )
  await expect(outside).toEqual([])
  await expect(richTextHasNodeId(value)).toBe(false)
}

const maxListNesting = (nodes: readonly unknown[]): number =>
  Math.max(
    0,
    ...nodes.map((node) => {
      const { children, type } = node as { children?: unknown[]; type?: string }
      if (!children) return 0
      return (type === 'ul' || type === 'ol' ? 1 : 0) + maxListNesting(children)
    }),
  )

const markTag = {
  bold: 'strong',
  code: 'code',
  highlight: 'mark',
  italic: 'em',
  strikethrough: 's',
  underline: 'u',
} as const satisfies Record<RichTextMark, string>

const markLabel = {
  bold: 'Negrito',
  code: 'Código',
  highlight: 'Destaque de texto',
  italic: 'Itálico',
  strikethrough: 'Tachado',
  underline: 'Sublinhado',
} as const satisfies Record<RichTextMark, string>

const selectionOf = (editor: HTMLElement) => editor.ownerDocument.getSelection()

const findSlashMenu = () => screen.findByRole('listbox', { name: 'Blocos' })
const querySlashMenu = () => screen.queryByRole('listbox', { name: 'Blocos' })
const optionNames = (listbox: HTMLElement) =>
  within(listbox)
    .queryAllByRole('option')
    .map((option) => option.textContent)

function markStory(mark: RichTextMark): Story {
  return {
    play: async ({ args, canvasElement }) => {
      const editor = await startTyping(canvasElement, 'antes marcado')
      await extendSelectionBackward(editor, 'marcado'.length)

      const button = await pressFloatingButton(markLabel[mark])
      await waitFor(() =>
        expect(button).toHaveAttribute('aria-pressed', 'true'),
      )

      await waitFor(() =>
        expect(editor.querySelector(markTag[mark])).toHaveTextContent(
          'marcado',
        ),
      )
      await expect(selectionOf(editor)?.toString()).toBe('marcado')
      await expectVocabulary(lastValue(args.onValueChange))
    },
  }
}

const blockCases = {
  blockquote: { selector: 'blockquote', shortcut: '> ' },
  h2: { selector: 'h2', shortcut: '## ' },
  h3: { selector: 'h3', shortcut: '### ' },
  ol: { selector: 'ol > li', shortcut: '1. ' },
  ul: { selector: 'ul > li', shortcut: '- ' },
} as const

function blockStory(block: keyof typeof blockCases): Story {
  const { selector, shortcut } = blockCases[block]
  return {
    play: async ({ args, canvasElement }) => {
      const editor = await startTyping(
        canvasElement,
        `${shortcut}Verbos`,
        'Verbos',
      )

      await waitFor(() =>
        expect(editor.querySelector(selector)).toHaveTextContent('Verbos'),
      )
      await expect(typedText(editor)).toBe('Verbos')
      await expectVocabulary(lastValue(args.onValueChange))
    },
  }
}

export const Empty: Story = {
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

export const BoldMark = markStory('bold')
export const ItalicMark = markStory('italic')
export const UnderlineMark = markStory('underline')
export const StrikethroughMark = markStory('strikethrough')
export const CodeMark = markStory('code')

export const HeadingBlock = blockStory('h2')
export const SubheadingBlock = blockStory('h3')
export const BlockquoteBlock = blockStory('blockquote')
export const BulletedListBlock = blockStory('ul')
export const NumberedListBlock = blockStory('ol')

export const FloatingToolbarOnSelection: Story = {
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    await expect(queryFloatingToolbar()).toBeNull()

    const text = editor.querySelector('[data-slate-string]') as HTMLElement
    await userEvent.pointer([
      { keys: '[MouseLeft>]', offset: 4, target: text },
      { offset: 10, target: text },
      { keys: '[/MouseLeft]' },
    ])
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

export const FloatingToolbarBlockTypeSelect: Story = {
  parameters: baseUiFocusGuards,
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    const text = editor.querySelector('[data-slate-string]') as HTMLElement
    await userEvent.pointer([
      { keys: '[MouseLeft>]', offset: 4, target: text },
      { offset: 10, target: text },
      { keys: '[/MouseLeft]' },
    ])

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

export const FloatingToolbarLink: Story = {
  parameters: baseUiFocusGuards,
  play: async ({ args, canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Uma frase para marcar')
    const text = editor.querySelector('[data-slate-string]') as HTMLElement
    await userEvent.pointer([
      { keys: '[MouseLeft>]', offset: 4, target: text },
      { offset: 9, target: text },
      { keys: '[/MouseLeft]' },
    ])

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

export const FloatingToolbarByKeyboard: Story = {
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

export const ExitByTheStart: Story = {
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

export const NestedListsAtTheCap: Story = {
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

export const SlashMenuByKeyboard: Story = {
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

export const DraggableBlocks: Story = {
  args: {
    defaultValue: [
      { children: [{ text: 'Primeiro' }], type: 'p' },
      { children: [{ text: 'Segundo' }], type: 'p' },
      { children: [{ text: 'Terceiro' }], type: 'p' },
    ],
    draggableBlocks: true,
  },
  decorators: [
    (Story) => (
      <div className="ps-10">
        <Story />
      </div>
    ),
  ],
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

export const BlockSelectionByKeyboard: Story = {
  args: DraggableBlocks.args,
  decorators: DraggableBlocks.decorators,
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

export const Mentions: Story = {
  args: {
    mentions: [
      { id: 'ana', label: 'Ana Souza' },
      { id: 'bruno', label: 'Bruno Lima' },
      { id: 'carla', label: 'Carla Dias' },
    ],
  },
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
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

export const SlashMenuExtraBlocks: Story = {
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

export const SlashMenuByPointer: Story = {
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

export const SlashMenuDismiss: Story = {
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

export const SlashMenuNoMatch: Story = {
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
    await expectVocabulary(lastValue(args.onValueChange))
  },
}

const everyNode: RichTextValue = [
  { children: [{ text: 'Título da nota' }], type: 'h2' },
  { children: [{ text: 'Uma seção' }], type: 'h3' },
  {
    children: [
      { text: 'Com ' },
      { bold: true, text: 'negrito' },
      { text: ', ' },
      { italic: true, text: 'itálico' },
      { text: ', ' },
      { text: 'sublinhado', underline: true },
      { text: ', ' },
      { strikethrough: true, text: 'tachado' },
      { text: ' e ' },
      { code: true, text: 'código' },
      { text: '.' },
    ],
    type: 'p',
  },
  { children: [{ text: 'Uma citação.' }], type: 'blockquote' },
  {
    children: [
      {
        children: [
          { children: [{ text: 'Primeiro item' }], type: 'lic' },
          {
            children: [
              {
                children: [{ children: [{ text: 'Aninhado' }], type: 'lic' }],
                type: 'li',
              },
            ],
            type: 'ol',
          },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
]

export const WithContent: Story = {
  args: { defaultValue: everyNode },
  play: async ({ args, canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })

    await expectVocabulary(everyNode)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(editor.querySelector('[data-slate-placeholder]')).toBeNull()
    const style = getComputedStyle(editor)
    await expect(style.borderWidth).toBe('0px')
    await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
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

const list = (
  type: 'ol' | 'ul',
  ...items: (string | [string, RichTextValue[number]])[]
): RichTextValue[number] => ({
  children: items.map((item) => ({
    children: [
      {
        children: [{ text: typeof item === 'string' ? item : item[0] }],
        type: 'lic',
      },
      ...(typeof item === 'string' ? [] : [item[1]]),
    ],
    type: 'li',
  })),
  type,
})

const fullDocument: RichTextValue = [
  { children: [{ text: 'Phrasal verbs de movimento' }], type: 'h2' },
  {
    children: [
      {
        text: 'Um phrasal verb junta um verbo a uma partícula e ganha um sentido que as duas palavras não têm sozinhas. Esta nota reúne os de ',
      },
      { bold: true, text: 'movimento' },
      { text: ', os mais frequentes em conversas do dia a dia, com ' },
      { italic: true, text: 'um exemplo' },
      { text: ' por verbo e a tradução ' },
      { underline: true, text: 'mais próxima' },
      { text: ' em português.' },
    ],
    type: 'p',
  },
  { children: [{ text: 'Como estudar esta nota' }], type: 'h3' },
  {
    children: [
      {
        text: 'Leia cada verbo em voz alta, cubra a tradução e tente lembrar. O que ',
      },
      { strikethrough: true, text: 'não funciona' },
      { text: ' é decorar a lista inteira de uma vez: separe em sessões de ' },
      { code: true, text: '10' },
      { text: ' cartões.' },
    ],
    type: 'p',
  },
  {
    children: [
      {
        text: 'A língua não é um conjunto de regras a memorizar, mas um hábito a cultivar.',
      },
    ],
    type: 'blockquote',
  },
  { children: [{ text: 'Verbos' }], type: 'h3' },
  list(
    'ul',
    ['get up: levantar-se', list('ol', 'I get up at six.', 'She got up late.')],
    ['go out: sair', list('ol', 'We went out for dinner.')],
    'come back: voltar',
    'run into: encontrar por acaso',
  ),
  { children: [{ text: 'Plano de revisão' }], type: 'h3' },
  list(
    'ol',
    'Hoje: ler a lista e marcar os verbos conhecidos.',
    'Amanhã: revisar só os marcados como difíceis.',
    'Em uma semana: escrever uma frase nova para cada verbo.',
  ),
  {
    children: [
      { text: 'Dúvidas vão para o fim da nota, com ' },
      { bold: true, italic: true, text: 'negrito e itálico' },
      { text: ' para destacar o que ainda falta confirmar.' },
    ],
    type: 'p',
  },
]

const englishLabels = {
  blockLabels: {
    blockquote: 'Quote',
    h2: 'Section heading',
    h3: 'Subheading',
    ol: 'Numbered list',
    ul: 'Bulleted list',
  },
  extraBlockLabels: {
    callout: 'Callout',
    code: 'Code block',
    date: 'Today’s date',
    hr: 'Divider',
    image: 'Image',
    table: 'Table',
    todo: 'Task list',
  },
  markLabels: {
    bold: 'Bold',
    code: 'Code',
    highlight: 'Highlight',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    underline: 'Underline',
  },
  paragraphLabel: 'Text',
  slashMenuEmptyLabel: 'No block with that name',
  slashMenuLabel: 'Blocks',
  toolbarLabel: 'Formatting',
} as const

export const FullDocument: Story = {
  args: { defaultValue: fullDocument },
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox', { name: 'Nota' })
    await expectVocabulary(fullDocument)
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

export const EnglishLabels: Story = {
  args: {
    'aria-label': 'Note',
    ...englishLabels,
    placeholder: 'Write your note, or type / to pick a block',
  },
  play: async ({ canvasElement }) => {
    const { startTyping } = richTextTyping('Note')
    const editor = await startTyping(canvasElement, 'Some text')
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

export const SingleLevelLists: Story = {
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

function Variation({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <section
      aria-label={title}
      className="grid gap-3 rounded-lg border border-border/80 bg-card p-5"
    >
      <h2 className="font-semibold text-base">{title}</h2>
      {children}
    </section>
  )
}

export const Variations: Story = {
  decorators: [
    (Story) => (
      <div className="w-5xl max-w-full">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Variation title="Documento completo">
        <RichTextEditor
          {...args}
          aria-label="Documento completo"
          defaultValue={fullDocument}
        />
      </Variation>
      <div className="grid gap-4">
        <Variation title="Vazio">
          <RichTextEditor {...args} aria-label="Vazio" />
        </Variation>
        <Variation title="Rótulos em inglês">
          <RichTextEditor
            {...args}
            {...englishLabels}
            aria-label="English note"
            defaultValue={[
              {
                children: [
                  { text: 'Select a word to see the ' },
                  { bold: true, text: 'English' },
                  { text: ' toolbar, or type / for the block menu.' },
                ],
                type: 'p',
              },
            ]}
            placeholder="Write your note, or type / to pick a block"
          />
        </Variation>
        <Variation title="Listas de um nível">
          <RichTextEditor
            {...args}
            aria-label="Listas de um nível"
            defaultValue={[
              {
                children: [{ text: 'Tab não aninha: sai do editor.' }],
                type: 'p',
              },
              list('ul', 'Primeiro', 'Segundo'),
            ]}
            maxListDepth={1}
          />
        </Variation>
        <Variation title="Coluna estreita">
          <div className="max-w-xs">
            <RichTextEditor
              {...args}
              aria-label="Coluna estreita"
              defaultValue={fullDocument.slice(0, 4)}
            />
          </div>
        </Variation>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of [
      'Documento completo',
      'Vazio',
      'English note',
      'Listas de um nível',
      'Coluna estreita',
    ]) {
      await expect(canvas.getByRole('textbox', { name })).toBeVisible()
    }
    await expect(
      canvas
        .getByRole('textbox', { name: 'Vazio' })
        .querySelector('[data-slate-placeholder]'),
    ).toBeVisible()
  },
}
