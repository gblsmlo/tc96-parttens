import type { Meta, StoryObj } from '@storybook/react-vite'
import { richTextStats } from '@tc96/ui/helpers/rich-text'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { richTextTyping } from '../../../../test-utils/rich-text-typing.ts'
import {
  launchBrief,
  launchBriefTitle,
} from '../fixtures/rich-text-editor-1.ts'
import {
  type RichTextEditor1Controls,
  richTextEditor1ControlArgs,
} from './rich-text-editor-1-controls.ts'
import {
  ComposedRichTextEditor1,
  DocumentPage,
  richTextEditor1Handlers,
} from './rich-text-editor-1-layouts.tsx'

const { startTyping } = richTextTyping('Conteúdo do documento')

const meta = {
  args: richTextEditor1ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(richTextEditor1Handlers))
      handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor1/Behavior',
} satisfies Meta<RichTextEditor1Controls>

export default meta

type Story = StoryObj<typeof meta>

const lastChange = (): RichTextValue =>
  richTextEditor1Handlers.onChange.mock.calls.at(-1)?.[0] as RichTextValue

const initialStats = richTextStats(launchBrief)

const openMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Mais ações' }),
  )
}

export const StatusAndMenuSitInTheNavbarAboveTheToolbar: Story = {
  args: { showStatus: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const banner = within(canvas.getByRole('banner'))
    await expect(banner.getByText('Em revisão')).toBeVisible()
    await expect(
      banner.getByRole('button', { name: 'Mais ações' }),
    ).toBeVisible()
    const toolbar = canvas.getByRole('toolbar', {
      name: 'Formatação do documento',
    })
    const title = canvas.getByRole('heading', { level: 1 })
    await expect(
      toolbar.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(canvasElement.querySelector('[data-slot="frame"]')).toBeNull()
  },
}

export const ToolbarHasEveryFormattingAction: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Formatação do documento',
    })
    for (const name of [
      'Desfazer',
      'Refazer',
      'Negrito',
      'Itálico',
      'Sublinhado',
      'Tachado',
      'Código',
      'Destaque',
      'Link',
      'Lista com marcadores',
      'Lista numerada',
      'Lista de tarefas',
      'Citação',
      'Bloco de código',
      'Divisor',
      'Alinhar à esquerda',
      'Centralizar',
      'Alinhar à direita',
      'Justificar',
    ]) {
      await expect(within(toolbar).getByRole('button', { name })).toBeVisible()
    }
    await expect(
      within(toolbar).getByRole('combobox', { name: 'Tipo de bloco' }),
    ).toBeVisible()
  },
}

export const HeaderShowsTitleDescriptionAndStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Título do documento' }),
    ).toHaveValue(launchBriefTitle)
    await expect(
      canvas.getByText('Plano de comunicação para o lançamento de março.'),
    ).toBeVisible()
    await expect(canvas.getByText('Em revisão')).toBeVisible()
  },
}

export const CountsMatchTheDocument: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText(`${initialStats.words} palavras`),
    ).toBeVisible()
    await expect(
      canvas.getByText(`${initialStats.charactersWithSpaces} caracteres`),
    ).toBeVisible()
    await expect(
      canvas.getByText(`${initialStats.readingMinutes} min de leitura`),
    ).toBeVisible()
  },
}

export const CountsFollowTyping: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('0 palavras')).toBeVisible()
    await startTyping(canvasElement, 'um dois três')
    await waitFor(() => expect(canvas.getByText('3 palavras')).toBeVisible())
    await expect(canvas.getByText('12 caracteres')).toBeVisible()
  },
}

export const BoldToolbarButtonMarksTheSelection: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = await startTyping(canvasElement, 'forte')
    const text = editor.querySelector('[data-slate-string]')?.firstChild
    const range = editor.ownerDocument.createRange()
    range.setStart(text as Node, 0)
    range.setEnd(text as Node, 5)
    editor.ownerDocument.getSelection()?.removeAllRanges()
    editor.ownerDocument.getSelection()?.addRange(range)
    await waitFor(() =>
      expect(editor.ownerDocument.getSelection()?.toString()).toBe('forte'),
    )
    await new Promise((resolve) => setTimeout(resolve, 250))
    await userEvent.click(canvas.getByRole('button', { name: 'Negrito' }))
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slate-editor] strong'),
      ).toHaveTextContent('forte'),
    )
  },
}

export const BlockSelectTurnsTheLineIntoAHeading: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Metas')
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Tipo de bloco' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Título 2' }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slate-editor] h2'),
      ).toHaveTextContent('Metas'),
    )
  },
}

export const TaskButtonTurnsTheLineIntoAChecklistItem: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Enviar convites')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Lista de tarefas' }),
    )
    await waitFor(() =>
      expect(lastChange()).toEqual([
        {
          checked: false,
          children: [{ text: 'Enviar convites' }],
          type: 'action_item',
        },
      ]),
    )
  },
}

export const AlignButtonSetsBlockAlignment: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Centro')
    await userEvent.click(canvas.getByRole('button', { name: 'Centralizar' }))
    await waitFor(() =>
      expect(lastChange()).toEqual([
        { align: 'center', children: [{ text: 'Centro' }], type: 'p' },
      ]),
    )
  },
}

export const MarkdownHashMakesAHeading: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    await startTyping(canvasElement, '# Visão geral', 'Visão geral')
    await waitFor(() =>
      expect(lastChange()).toEqual([
        { children: [{ text: 'Visão geral' }], type: 'h1' },
      ]),
    )
  },
}

export const ShortcutsPopoverListsKeysAndMarkdown: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Atalhos' }),
    )
    const heading = await screen.findByText(
      'Markdown no início da linha, seguido de Espaço',
    )
    await waitFor(() => expect(heading).toBeVisible())
    const markdown = within(heading.closest('section') as HTMLElement)
    await waitFor(() => expect(markdown.getByText('Título 1')).toBeVisible())
    await expect(markdown.getByText('##')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByText('Markdown no início da linha, seguido de Espaço'),
      ).toBeNull(),
    )
  },
}

export const ViewOnlyFromTheMenuLocksTheDocument: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Somente leitura' }),
    )
    await expect(richTextEditor1Handlers.onReadOnlyChange).toHaveBeenCalledWith(
      true,
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('document', { name: 'Conteúdo do documento' }),
      ).toBeVisible(),
    )
    await expect(canvas.queryByRole('toolbar')).toBeNull()
    await expect(
      canvas.queryByRole('textbox', { name: 'Título do documento' }),
    ).toBeNull()
    await expect(
      canvas.getByRole('heading', { name: launchBriefTitle }),
    ).toBeVisible()
  },
}

export const ControlledReadOnlyOnlyReportsTheMenuChoice: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('document', { name: 'Conteúdo do documento' }),
    ).toBeVisible()
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Editar' }),
    )
    await expect(richTextEditor1Handlers.onReadOnlyChange).toHaveBeenCalledWith(
      false,
    )
    await expect(
      canvas.getByRole('document', { name: 'Conteúdo do documento' }),
    ).toBeVisible()
  },
}

export const ReadOnlyDisablesClear: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    await expect(
      await screen.findByRole('menuitem', { name: 'Limpar documento' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
}

export const CopyAsHtmlCallsOnCopy: Story = {
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar como HTML' }),
    )
    await expect(richTextEditor1Handlers.onCopy).toHaveBeenCalledTimes(1)
    const [format, content] = richTextEditor1Handlers.onCopy.mock.calls[0] ?? []
    await expect(format).toBe('html')
    await expect(content).toContain('Objetivo</h2>')
    await expect(
      await screen.findByText('Documento copiado como HTML'),
    ).toBeVisible()
  },
}

export const CopyAsTextCallsOnCopy: Story = {
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar como texto' }),
    )
    const [format, content] = richTextEditor1Handlers.onCopy.mock.calls[0] ?? []
    await expect(format).toBe('text')
    await expect(content).toContain('Objetivo')
    await expect(content).not.toContain('<')
  },
}

export const ClearAsksForConfirmation: Story = {
  play: async ({ canvasElement }) => {
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar documento' }),
    )
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Limpar o documento?',
    })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancelar' }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(richTextEditor1Handlers.onClear).not.toHaveBeenCalled()
    await expect(
      within(canvasElement).getByText(`${initialStats.words} palavras`),
    ).toBeVisible()
  },
}

export const ClearEmptiesTheDocumentAndUndoRestoresIt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await openMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar documento' }),
    )
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Limpar documento' }),
    )
    await waitFor(() => expect(canvas.getByText('0 palavras')).toBeVisible())
    await expect(richTextEditor1Handlers.onClear).toHaveBeenCalledTimes(1)
    await userEvent.click(
      await screen.findByRole('button', { name: 'Restaurar documento' }),
    )
    await waitFor(() =>
      expect(canvas.getByText(`${initialStats.words} palavras`)).toBeVisible(),
    )
  },
}

export const OnChangeReceivesAPlainDocument: Story = {
  args: { withContent: false },
  play: async ({ canvasElement }) => {
    await startTyping(canvasElement, 'Oi')
    await waitFor(() =>
      expect(lastChange()).toEqual([{ children: [{ text: 'Oi' }], type: 'p' }]),
    )
  },
}

export const OnSaveWaitsForTypingToPause: Story = {
  args: { saveDelay: 300, withContent: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Rascunho')
    await expect(canvas.getByText('Alterações não salvas')).toBeVisible()
    await expect(richTextEditor1Handlers.onSave).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(richTextEditor1Handlers.onSave).toHaveBeenCalledTimes(1),
    )
    await expect(richTextEditor1Handlers.onSave).toHaveBeenCalledWith([
      { children: [{ text: 'Rascunho' }], type: 'p' },
    ])
    await expect(canvas.getByText('Salvo')).toBeVisible()
  },
}

export const WithoutOnSaveNoSaveStateRenders: Story = {
  args: { withContent: false, withSave: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await startTyping(canvasElement, 'Rascunho')
    await expect(canvas.queryByText('Alterações não salvas')).toBeNull()
    await expect(canvas.queryByText('Salvo')).toBeNull()
  },
}

export const TitleChangeCallsOnTitleChange: Story = {
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByRole('textbox', {
      name: 'Título do documento',
    })
    await userEvent.type(title, '!')
    await expect(
      richTextEditor1Handlers.onTitleChange,
    ).toHaveBeenLastCalledWith(`${launchBriefTitle}!`)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <DocumentPage
      defaultTitle="Brief"
      labels={{
        document: 'Corpo do brief',
        shortcuts: {
          markdownRules: [],
          markdownTitle: 'Markdown',
          shortcutList: [],
          shortcutsTitle: 'Teclas',
          title: 'Dicas',
          trigger: 'Dicas',
        },
        words: (count) => `${count} termos`,
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('0 termos')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Corpo do brief' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Dicas' })).toBeVisible()
  },
}

export const ToolbarFitsOnASingleRow: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar')
    const buttons = [...toolbar.querySelectorAll('button')]
    const tops = new Set(
      buttons.map((button) => Math.round(button.getBoundingClientRect().top)),
    )
    await expect(tops.size).toBe(1)
    await expect(toolbar.scrollWidth).toBeLessThanOrEqual(toolbar.clientWidth)
  },
}
