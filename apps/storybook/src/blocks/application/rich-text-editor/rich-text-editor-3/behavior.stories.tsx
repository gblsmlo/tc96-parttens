import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  cleanContractValue,
  redlineAuthor,
  redlineAuthors,
  redlineTime,
} from '../fixtures/rich-text-editor-3.ts'
import {
  type RichTextEditor3Controls,
  richTextEditor3ControlArgs,
} from './rich-text-editor-3-controls.ts'
import {
  ComposedRichTextEditor3,
  ContractPage,
  redlineDocumentName,
  richTextEditor3Handlers,
  selectRedlineText,
} from './rich-text-editor-3-layouts.tsx'

const meta = {
  args: richTextEditor3ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(richTextEditor3Handlers))
      handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor3/Behavior',
} satisfies Meta<RichTextEditor3Controls>

export default meta

type Story = StoryObj<typeof meta>

const textbox = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', { name: redlineDocumentName })

const margin = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole('complementary', { name: 'Revisão' }))

const items = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="suggestion-review-item"]'),
  )

const kinds = (root: HTMLElement) =>
  items(root).map((item) => item.getAttribute('data-kind'))

export const OpensWithTheExistingChangesListed: Story = {
  play: async ({ canvasElement }) => {
    await expect(items(canvasElement)).toHaveLength(3)
    await expect(within(canvasElement).getByText('3 alterações')).toBeVisible()
    await expect(kinds(canvasElement)).toEqual(['replace', 'replace', 'insert'])
  },
}

export const ReviewListShowsAuthorAndTime: Story = {
  play: async ({ canvasElement }) => {
    const second = items(canvasElement)[1] as HTMLElement
    await expect(within(second).getByText('Marcos Lima')).toBeVisible()
    const time = second.querySelector('time')
    await expect(time).toHaveAttribute('datetime', '2026-11-18T14:30:00.000Z')
    await expect(time).toHaveTextContent('18/11/2026')
    await expect(within(second).getByText('Antes')).toBeVisible()
    await expect(within(second).getByText('30 dias')).toBeVisible()
    await expect(within(second).getByText('45 dias')).toBeVisible()
  },
}

export const ExistingChangesRenderAsInsertAndDeleteLeaves: Story = {
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    const removed = editor.querySelector('del[data-suggestion-type="remove"]')
    const added = editor.querySelector('ins[data-suggestion-type="insert"]')
    await expect(removed).toHaveTextContent('planejamento')
    await expect(removed).toHaveClass(
      'line-through',
      'text-destructive-foreground',
    )
    await expect(added).toHaveTextContent('gestão de projetos')
    await expect(added).toHaveClass('text-success-foreground')
  },
}

export const TypingBecomesAnInsert: Story = {
  args: { existingChanges: 0 },
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await expect(items(canvasElement)).toHaveLength(0)
    await selectRedlineText(editor, 'valor mensal acordado', 'end')
    await userEvent.keyboard(' integralmente')
    await waitFor(() =>
      expect(
        editor.querySelector('ins[data-suggestion-type="insert"]'),
      ).toHaveTextContent('integralmente'),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(1))
    const item = items(canvasElement)[0] as HTMLElement
    await expect(item).toHaveAttribute('data-kind', 'insert')
    await expect(within(item).getByText('Ana Souza')).toBeVisible()
    await expect(item.querySelector('time')).toHaveAttribute('datetime')
    await expect(richTextEditor3Handlers.onChange).toHaveBeenCalled()
    await expect(
      JSON.stringify(richTextEditor3Handlers.onChange.mock.calls.at(-1)?.[0]),
    ).toContain('"userId":"ana"')
  },
}

export const DeletingKeepsTheTextStruckInPlace: Story = {
  args: { existingChanges: 0 },
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await selectRedlineText(editor, 'mensal')
    await userEvent.keyboard('{Backspace}')
    await waitFor(() =>
      expect(
        editor.querySelector('del[data-suggestion-type="remove"]'),
      ).toHaveTextContent('mensal'),
    )
    await expect(editor).toHaveTextContent('pelo valor mensal acordado')
    await expect(kinds(canvasElement)).toEqual(['delete'])
  },
}

export const TypingOverASelectionBecomesAReplace: Story = {
  args: { existingChanges: 0 },
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await selectRedlineText(editor, 'mensal')
    await userEvent.keyboard('anual')
    await waitFor(() =>
      expect(
        editor.querySelector('ins[data-suggestion-type="insert"]'),
      ).toHaveTextContent('anual'),
    )
    await expect(
      editor.querySelector('del[data-suggestion-type="remove"]'),
    ).toHaveTextContent('mensal')
    await waitFor(() => expect(items(canvasElement)).toHaveLength(1))
    const item = items(canvasElement)[0] as HTMLElement
    await expect(item).toHaveAttribute('data-kind', 'replace')
    await expect(item.querySelector('del')).toHaveTextContent('mensal')
    await expect(item.querySelector('ins')).toHaveTextContent('anual')
  },
}

export const AcceptingAReplaceKeepsTheNewText: Story = {
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await userEvent.click(
      margin(canvasElement).getByRole('button', {
        name: /Aceitar alteração de Marcos Lima: 45 dias/,
      }),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(2))
    await expect(editor).toHaveTextContent('em até 45 dias após')
    await expect(editor).not.toHaveTextContent('30 dias')
    await expect(richTextEditor3Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'accept',
        change: expect.objectContaining({
          after: '45 dias',
          before: '30 dias',
          kind: 'replace',
        }),
      }),
    )
  },
}

export const RejectingAReplaceRestoresTheOriginalText: Story = {
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await userEvent.click(
      margin(canvasElement).getByRole('button', {
        name: /Rejeitar alteração de Marcos Lima: 45 dias/,
      }),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(2))
    await expect(editor).toHaveTextContent('em até 30 dias após')
    await expect(editor).not.toHaveTextContent('45 dias')
    await expect(richTextEditor3Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'reject' }),
    )
  },
}

export const AcceptAllAsksForConfirmation: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      margin(canvasElement).getByRole('button', { name: 'Aceitar tudo' }),
    )
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Aceitar todas as alterações?',
    })
    await expect(items(canvasElement)).toHaveLength(3)
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancelar' }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(items(canvasElement)).toHaveLength(3)
    await expect(richTextEditor3Handlers.onDecision).not.toHaveBeenCalled()
    await userEvent.click(
      margin(canvasElement).getByRole('button', { name: 'Aceitar tudo' }),
    )
    await userEvent.click(
      within(
        await screen.findByRole('alertdialog', {
          name: 'Aceitar todas as alterações?',
        }),
      ).getByRole('button', { name: 'Aceitar todas' }),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0))
    const editor = textbox(canvasElement)
    await expect(editor).toHaveTextContent('gestão de projetos')
    await expect(editor).toHaveTextContent('45 dias')
    await expect(editor).not.toHaveTextContent('planejamento')
    await expect(richTextEditor3Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'accept-all' }),
    )
    await expect(
      margin(canvasElement).getByText('Nenhuma alteração para revisar.'),
    ).toBeVisible()
  },
}

export const RejectAllAsksForConfirmationAndRestoresTheOriginal: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      margin(canvasElement).getByRole('button', { name: 'Rejeitar tudo' }),
    )
    await userEvent.click(
      within(
        await screen.findByRole('alertdialog', {
          name: 'Rejeitar todas as alterações?',
        }),
      ).getByRole('button', { name: 'Rejeitar todas' }),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0))
    const editor = textbox(canvasElement)
    await expect(editor).toHaveTextContent(
      'serviços de consultoria em planejamento ao longo',
    )
    await expect(editor).toHaveTextContent('em até 30 dias após')
    await expect(editor).not.toHaveTextContent('multa')
    await expect(richTextEditor3Handlers.onDecision).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'reject-all' }),
    )
  },
}

export const NextAndPreviousStepThroughTheChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const active = () =>
      items(canvasElement).findIndex(
        (item) => item.getAttribute('data-active') === 'true',
      )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima alteração' }),
    )
    await waitFor(() => expect(active()).toBe(0))
    await expect(
      textbox(canvasElement).querySelector('[data-active="true"]'),
    ).toHaveTextContent(/planejamento|gestão de projetos/)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima alteração' }),
    )
    await waitFor(() => expect(active()).toBe(1))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alteração anterior' }),
    )
    await waitFor(() => expect(active()).toBe(0))
    await userEvent.click(
      canvas.getByRole('button', { name: 'Alteração anterior' }),
    )
    await waitFor(() => expect(active()).toBe(2))
  },
}

export const SelectingAChangeScrollsAndHighlightsIt: Story = {
  play: async ({ canvasElement }) => {
    const third = items(canvasElement)[2] as HTMLElement
    await userEvent.click(
      within(third).getAllByRole('button')[0] as HTMLElement,
    )
    await waitFor(() => expect(third).toHaveAttribute('data-active', 'true'))
    await expect(
      textbox(canvasElement).querySelector('[data-active="true"]'),
    ).toHaveTextContent('multa de 2%')
  },
}

export const FinalViewHidesDeletionsAndShowsInsertionsAsPlainText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Final' }))
    const document = await canvas.findByRole('document', {
      name: redlineDocumentName,
    })
    await expect(canvas.getByRole('button', { name: 'Final' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    for (const del of document.querySelectorAll('del'))
      await expect(del).not.toBeVisible()
    const added = document.querySelector('ins[data-suggestion-type="insert"]')
    await expect(added).toBeVisible()
    await expect(added).not.toHaveClass('text-success-foreground')
    await expect(added).not.toHaveClass('underline')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as marcações' }),
    )
    await expect(await canvas.findByRole('textbox')).toBeVisible()
  },
}

export const OriginalViewHidesInsertionsAndShowsDeletionsAsPlainText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Original' }))
    const document = await canvas.findByRole('document', {
      name: redlineDocumentName,
    })
    for (const ins of document.querySelectorAll('ins'))
      await expect(ins).not.toBeVisible()
    const struck = document.querySelector('del[data-suggestion-type="remove"]')
    await expect(struck).toBeVisible()
    await expect(struck).not.toHaveClass('line-through')
    await expect(struck).not.toHaveClass('text-destructive-foreground')
  },
}

export const OtherViewsDisableSteppingBecauseTheMarkupIsGone: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Final' }))
    await expect(
      canvas.getByRole('button', { name: 'Próxima alteração' }),
    ).toBeDisabled()
  },
}

export const ExportMenuSendsTheRedlineHtml: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Mais ações' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar redline em HTML' }),
    )
    await expect(richTextEditor3Handlers.onExport).toHaveBeenCalledTimes(1)
    const [format, content] = richTextEditor3Handlers.onExport.mock
      .calls[0] as [string, string]
    await expect(format).toBe('redline-html')
    await expect(content).toContain(
      '<del data-author="Marcos Lima" datetime="2026-11-18T14:30:00.000Z">30 dias</del>',
    )
    await expect(content).toContain(
      '<ins data-author="Marcos Lima" datetime="2026-11-18T14:30:00.000Z">45 dias</ins>',
    )
    await expect(content).toContain(
      '<h2>Contrato de prestação de serviços</h2>',
    )
  },
}

export const ExportMenuSendsTheFinalAndOriginalText: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar texto final' }),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Copiar texto original' }),
    )
    const [final, original] = richTextEditor3Handlers.onExport.mock.calls as [
      string,
      string,
    ][]
    await expect(final?.[0]).toBe('final-text')
    await expect(final?.[1]).toContain('45 dias')
    await expect(final?.[1]).toContain('gestão de projetos')
    await expect(final?.[1]).toContain('e a multa de 2% sobre o saldo')
    await expect(final?.[1]).not.toContain('30 dias')
    await expect(original?.[0]).toBe('original-text')
    await expect(original?.[1]).toContain('30 dias')
    await expect(original?.[1]).toContain('planejamento')
    await expect(original?.[1]).not.toContain('multa')
    await expect(original?.[1]).not.toContain('45 dias')
  },
}

export const FormattingAppliesDirectly: Story = {
  args: { existingChanges: 0 },
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    await selectRedlineText(editor, 'Contrato de prestação')
    const toolbar = within(
      await screen.findByRole('toolbar', { name: 'Formatação do contrato' }),
    )
    await userEvent.click(toolbar.getByRole('button', { name: 'Negrito' }))
    await waitFor(() =>
      expect(editor.querySelector('strong')).toHaveTextContent(
        'Contrato de prestação',
      ),
    )
    await selectRedlineText(editor, 'As partes manterão')
    await userEvent.click(
      within(
        await screen.findByRole('toolbar', { name: 'Formatação do contrato' }),
      ).getByRole('button', { name: 'Citação' }),
    )
    await waitFor(() =>
      expect(editor.querySelector('blockquote')).not.toBeNull(),
    )
    await expect(items(canvasElement)).toHaveLength(0)
    await expect(editor.querySelector('[data-suggestion-type]')).toBeNull()
  },
}

export const SplittingAParagraphAppliesDirectly: Story = {
  args: { existingChanges: 0 },
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    const before = editor.querySelectorAll('p').length
    await selectRedlineText(editor, 'durante a execução', 'end')
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(editor.querySelectorAll('p').length).toBe(before + 1),
    )
    await expect(items(canvasElement)).toHaveLength(0)
    await expect(editor.querySelector('[data-suggestion-type]')).toBeNull()
  },
}

export const SelectionToolbarOffersOnlyBoldItalicAndUnderline: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('toolbar', {
        name: 'Formatação do contrato',
      }),
    ).toBeNull()
    await selectRedlineText(textbox(canvasElement), 'As partes manterão')
    const toolbar = within(
      await screen.findByRole('toolbar', { name: 'Formatação do contrato' }),
    )
    for (const name of ['Negrito', 'Itálico', 'Sublinhado'])
      await expect(toolbar.getByRole('button', { name })).toBeVisible()
    for (const name of ['Tachado', 'Código', 'Destaque de texto'])
      await expect(toolbar.queryByRole('button', { name })).toBeNull()
  },
}

export const SlashOpensTheBlockMenuWithoutRecordingAChange: Story = {
  play: async ({ canvasElement }) => {
    const editor = textbox(canvasElement)
    const before = items(canvasElement).length
    await selectRedlineText(editor, 'dos serviços.', 'end')
    await userEvent.keyboard('{Enter}/cita')
    const menu = await screen.findByRole('listbox', { name: 'Blocos' })
    await expect(within(menu).getByRole('option')).toHaveTextContent('Citação')
    await expect(items(canvasElement)).toHaveLength(before)
    await userEvent.keyboard('{Enter}Nova cláusula')
    await waitFor(() =>
      expect(editor.querySelector('blockquote')).toHaveTextContent(
        'Nova cláusula',
      ),
    )
    await waitFor(() => expect(items(canvasElement)).toHaveLength(before + 1))
  },
}

export const WideViewportShowsTheMarginBesideTheText: Story = {
  globals: { viewport: { isRotated: false, value: 'desktop' } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('complementary', { name: 'Revisão' }),
    ).toBeVisible()
    await expect(
      within(canvasElement).queryByRole('button', {
        name: /Revisar alterações/,
      }),
    ).toBeNull()
  },
}

export const NarrowViewportMovesTheMarginIntoASheet: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('complementary')).toBeNull()
    await userEvent.click(
      await canvas.findByRole('button', { name: /Revisar alterações/ }),
    )
    const sheet = await screen.findByRole('dialog', { name: 'Revisão' })
    await waitFor(() => expect(items(sheet)).toHaveLength(3))
    await userEvent.click(
      within(sheet).getByRole('button', {
        name: /Aceitar alteração de Júlia Prado/,
      }),
    )
    await waitFor(() => expect(items(sheet)).toHaveLength(2))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const LabelsOverrideTheTexts: Story = {
  render: () => (
    <ContractPage
      author={redlineAuthor}
      authors={redlineAuthors}
      defaultValue={cleanContractValue()}
      formatTime={redlineTime}
      labels={{
        acceptAll: 'Accept all',
        count: (count) => `${count} edits`,
        reviewTitle: 'Review',
        views: 'Version',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('0 edits')).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Review' })).toBeVisible()
    await expect(canvas.getByRole('group', { name: 'Version' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Accept all' }),
    ).toBeDisabled()
  },
}
