import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor2 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import {
  expect,
  fn,
  screen,
  spyOn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import {
  extendSelectionBackward,
  placeCaretAtEnd,
  richTextTyping,
} from '../../../../test-utils/rich-text-typing.ts'
import {
  emptyPage,
  people,
  playbook,
  shortPage,
  tablePage,
} from '../fixtures/rich-text-editor-2.ts'
import { WikiPage } from './rich-text-editor-2-layouts.tsx'

const editorName = 'Conteúdo da página'
const { startTyping } = richTextTyping(editorName)

const meta = {
  args: {
    defaultValue: shortPage,
    onSave: fn(),
    onSettingsChange: fn(),
    people,
    saveDelay: 300,
  },
  component: RichTextEditor2,
  render: (args) => <WikiPage {...args} />,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor2/Behavior',
} satisfies Meta<typeof RichTextEditor2>

export default meta

type Story = StoryObj<typeof meta>

const blockTexts = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="rich-text-block"]'),
    (block) => block.textContent?.replace(/\ufeff/g, ''),
  )

const blockAt = (canvasElement: HTMLElement, index: number) => {
  const block = canvasElement.querySelectorAll('[data-slot="rich-text-block"]')[
    index
  ]
  if (!block) throw new Error(`No block at ${index}`)
  return block
}

async function openBlockMenu(canvasElement: HTMLElement, index: number) {
  await userEvent.hover(blockAt(canvasElement, index))
  const trigger = await within(canvasElement).findByRole('button', {
    name: 'Opções do bloco',
  })
  await userEvent.click(trigger)
  await screen.findByRole('menu')
}

async function chooseMenuItem(name: string) {
  await userEvent.click(await screen.findByRole('menuitem', { name }))
}

async function placeCaretInCell(canvasElement: HTMLElement, selector: string) {
  const editor = within(canvasElement).getByRole('textbox', {
    name: editorName,
  })
  const cell = editor.querySelector(selector)
  await waitFor(() => {
    placeCaretAtEnd(editor, cell)
    expect(
      within(canvasElement).queryByRole('toolbar', { name: 'Ações da tabela' }),
    ).not.toBeNull()
  })
}

export const SlashMenuListsTheBlocks: Story = {
  args: { defaultValue: emptyPage },
  play: async ({ canvasElement }) => {
    const editor = await startTyping(canvasElement, '/')
    const listbox = await screen.findByRole('listbox', { name: 'Blocos' })
    const options = within(listbox)
      .getAllByRole('option')
      .map((option) => option.textContent)
    await expect(options).toHaveLength(12)
    await expect(options).toEqual(
      expect.arrayContaining([
        'Título de seção',
        'Lista de tarefas',
        'Tabela',
        'Citação',
        'Bloco de código',
        'Divisor',
      ]),
    )
    await userEvent.click(
      within(listbox).getByRole('option', { name: 'Tabela' }),
    )
    await waitFor(() => expect(editor.querySelector('table')).not.toBeNull())
  },
}

export const MentionListsTeammatesWithAvatars: Story = {
  args: { defaultValue: emptyPage },
  play: async ({ canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Avisar')
    await userEvent.keyboard(' @an')
    const listbox = await screen.findByRole('listbox', { name: 'Pessoas' })
    const option = within(listbox).getByRole('option', { name: /Ana Souza/ })
    await expect(within(option).getByText('AS')).toBeInTheDocument()
    await expect(
      within(listbox).queryByRole('option', { name: /Bruno Lima/ }),
    ).toBeNull()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(editor.querySelector('[data-slate-void=true]')).toHaveTextContent(
        '@Ana Souza',
      ),
    )
  },
}

export const SelectingTextRaisesTheFormatBubble: Story = {
  args: { defaultValue: emptyPage },
  play: async ({ canvasElement }) => {
    const editor = await startTyping(canvasElement, 'Escalar agora')
    await extendSelectionBackward(editor, 5)
    const toolbar = await screen.findByRole('toolbar', { name: 'Formatação' })
    await userEvent.click(
      within(toolbar).getByRole('button', { name: 'Negrito' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('strong')).toHaveTextContent('agora'),
    )
  },
}

export const GutterAddsABlockBelow: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.hover(blockAt(canvasElement, 0))
    await userEvent.click(
      await within(canvasElement).findByRole('button', {
        name: 'Adicionar bloco abaixo',
      }),
    )
    await waitFor(() =>
      expect(blockTexts(canvasElement)).toEqual([
        'Primeiro bloco',
        '',
        'Segundo bloco',
        'Terceiro bloco',
      ]),
    )
  },
}

export const BlockMenuTurnsABlockIntoAnotherType: Story = {
  play: async ({ canvasElement }) => {
    await openBlockMenu(canvasElement, 1)
    await chooseMenuItem('Transformar em')
    await chooseMenuItem('Título de seção')
    const editor = within(canvasElement).getByRole('textbox', {
      name: editorName,
    })
    await waitFor(() =>
      expect(editor.querySelector('h2')).toHaveTextContent('Segundo bloco'),
    )
  },
}

export const BlockMenuDuplicates: Story = {
  play: async ({ canvasElement }) => {
    await openBlockMenu(canvasElement, 0)
    await chooseMenuItem('Duplicar')
    await waitFor(() =>
      expect(blockTexts(canvasElement)).toEqual([
        'Primeiro bloco',
        'Primeiro bloco',
        'Segundo bloco',
        'Terceiro bloco',
      ]),
    )
  },
}

export const BlockMenuMovesUpAndDown: Story = {
  play: async ({ canvasElement }) => {
    await openBlockMenu(canvasElement, 1)
    await chooseMenuItem('Mover para cima')
    await waitFor(() =>
      expect(blockTexts(canvasElement)).toEqual([
        'Segundo bloco',
        'Primeiro bloco',
        'Terceiro bloco',
      ]),
    )
    await openBlockMenu(canvasElement, 0)
    await expect(
      await screen.findByRole('menuitem', { name: 'Mover para cima' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await chooseMenuItem('Mover para baixo')
    await waitFor(() =>
      expect(blockTexts(canvasElement)).toEqual([
        'Primeiro bloco',
        'Segundo bloco',
        'Terceiro bloco',
      ]),
    )
  },
}

export const BlockMenuDeletes: Story = {
  play: async ({ canvasElement }) => {
    await openBlockMenu(canvasElement, 2)
    await chooseMenuItem('Excluir')
    await waitFor(() =>
      expect(blockTexts(canvasElement)).toEqual([
        'Primeiro bloco',
        'Segundo bloco',
      ]),
    )
  },
}

export const EveryBlockCarriesADragHandle: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole('button', { name: 'Arrastar bloco' }),
    ).toHaveLength(3)
  },
}

export const TableBarAppearsInsideATable: Story = {
  args: { defaultValue: tablePage },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('toolbar', { name: 'Ações da tabela' }),
    ).toBeNull()
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await expect(
      canvas.getByRole('button', { name: 'Linha de cabeçalho' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      canvas.getAllByRole('separator', { name: 'Redimensionar coluna' }).length,
    ).toBeGreaterThan(0)
  },
}

export const TableBarAddsRowsAndColumns: Story = {
  args: { defaultValue: tablePage },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: editorName })
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar linha' }),
    )
    await waitFor(() => expect(editor.querySelectorAll('tr')).toHaveLength(4))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Adicionar coluna' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('tr')?.children).toHaveLength(3),
    )
  },
}

export const TableBarTogglesTheHeaderRow: Story = {
  args: { defaultValue: tablePage },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: editorName })
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await expect(editor.querySelectorAll('th')).toHaveLength(2)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Linha de cabeçalho' }),
    )
    await waitFor(() => expect(editor.querySelectorAll('th')).toHaveLength(0))
    await expect(
      canvas.getByRole('button', { name: 'Linha de cabeçalho' }),
    ).toHaveAttribute('aria-pressed', 'false')
  },
}

export const TableBarDeletesARowAndAColumn: Story = {
  args: { defaultValue: tablePage },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: editorName })
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await userEvent.click(canvas.getByRole('button', { name: 'Excluir linha' }))
    await waitFor(() => expect(editor.querySelectorAll('tr')).toHaveLength(2))
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Excluir coluna' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('tr')?.children).toHaveLength(1),
    )
  },
}

export const DeletingATableAsksForConfirmation: Story = {
  args: { defaultValue: tablePage },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: editorName })
    await placeCaretInCell(canvasElement, 'td [data-slate-string]')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Excluir tabela' }),
    )
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Excluir esta tabela?',
    })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancelar' }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(editor.querySelector('table')).not.toBeNull()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Excluir tabela' }),
    )
    const confirm = await screen.findByRole('alertdialog')
    await userEvent.click(
      within(confirm).getByRole('button', { name: 'Excluir tabela' }),
    )
    await waitFor(() => expect(editor.querySelector('table')).toBeNull())
  },
}

export const OutlineListsHeadingsAndJumpsToThem: Story = {
  args: { defaultValue: playbook },
  play: async ({ canvasElement }) => {
    const scroll = spyOn(
      Element.prototype,
      'scrollIntoView',
    ).mockImplementation(() => undefined)
    try {
      const rail = canvasElement.querySelector<HTMLElement>(
        '[data-slot="wiki-outline-rail"]',
      )
      if (!rail) throw new Error('Outline rail missing')
      const outline = within(rail)
      const names = outline
        .getAllByRole('button', { hidden: true })
        .map((button) => button.textContent)
      await expect(names).toEqual([
        'Quando escalar',
        'Quem decide',
        'Primeiros passos',
        'Comunicação',
        'Modelo de aviso',
        'Comando de diagnóstico',
        'Depois do incidente',
      ])
      await userEvent.click(
        outline.getByRole('button', { hidden: true, name: 'Quem decide' }),
      )
      await expect(scroll).toHaveBeenCalledTimes(1)
      await expect(scroll.mock.contexts[0]).toHaveTextContent('Quem decide')
    } finally {
      scroll.mockRestore()
    }
  },
}

export const OutlineFollowsNewHeadings: Story = {
  args: { defaultValue: emptyPage },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="wiki-outline-rail"]'),
    ).toBeNull()
    await startTyping(canvasElement, '## Novo capítulo', 'Novo capítulo')
    await waitFor(() => {
      const rail = canvasElement.querySelector<HTMLElement>(
        '[data-slot="wiki-outline-rail"]',
      )
      expect(rail).not.toBeNull()
      expect(
        within(rail as HTMLElement).getByRole('button', {
          hidden: true,
          name: 'Novo capítulo',
        }),
      ).toBeInTheDocument()
    })
  },
}

export const OutlinePopoverCarriesTheSameHeadings: Story = {
  args: { defaultValue: playbook },
  play: async ({ canvasElement }) => {
    const scroll = spyOn(
      Element.prototype,
      'scrollIntoView',
    ).mockImplementation(() => undefined)
    try {
      await userEvent.click(
        canvasElement.querySelector('[data-slot="popover-trigger"]') as Element,
      )
      const list = await screen.findByRole('list', { name: 'Índice da página' })
      await expect(within(list).getAllByRole('button')).toHaveLength(7)
      await userEvent.click(
        within(list).getByRole('button', { name: 'Comunicação' }),
      )
      await expect(scroll).toHaveBeenCalledTimes(1)
      await waitFor(() =>
        expect(
          screen.queryByRole('list', { name: 'Índice da página' }),
        ).toBeNull(),
      )
    } finally {
      scroll.mockRestore()
    }
  },
}

export const PageMenuTogglesWidthAndTextSize: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvasElement.querySelector('[data-slot="rich-text-editor-2"]')
    await expect(root).toHaveAttribute('data-width', 'page')
    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Largura total' }),
    )
    await expect(root).toHaveAttribute('data-width', 'full')
    await expect(args.onSettingsChange).toHaveBeenLastCalledWith({
      fullWidth: true,
      locked: false,
      smallText: false,
    })
    const editor = canvas.getByRole('textbox', { name: editorName })
    await expect(editor).not.toHaveClass('text-sm')
    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Texto pequeno' }),
    )
    await expect(editor).toHaveClass('text-sm')
  },
}

export const LockingThePageMakesItReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(blockAt(canvasElement, 0))
    await canvas.findByRole('button', { name: 'Opções do bloco' })
    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Bloquear página' }),
    )
    await expect(
      await canvas.findByRole('document', { name: editorName }),
    ).toHaveAttribute('contenteditable', 'false')
    await expect(canvas.getByText('Página bloqueada')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="wiki-block-gutter"]'),
    ).toBeNull()

    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Bloquear página' }),
    )
    await expect(
      await canvas.findByRole('textbox', { name: editorName }),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Página bloqueada')).toBeNull()
  },
}

export const SaveRunsOnceAfterTheDelay: Story = {
  args: { defaultValue: emptyPage },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Ligar para o cliente')
    await canvas.findByText('Salvando...')
    await expect(args.onSave).not.toHaveBeenCalled()
    await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(1))
    await expect(canvas.getByText('Salvo')).toBeVisible()
    const saved = JSON.stringify(lastSaved(args.onSave))
    await expect(saved).toContain('Ligar para o cliente')
    await expect(saved).not.toContain('"id"')
  },
}

function lastSaved(handler: unknown): unknown {
  const calls = (handler as { mock: { calls: unknown[][] } }).mock.calls
  return calls.at(-1)?.[0]
}
