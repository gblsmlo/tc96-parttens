import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table4 } from '@tc96/ui/blocks/data/table/table-4'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { products, rowActions } from '../fixtures/table-4.ts'
import { type Table4Controls, table4ControlArgs } from './table-4-controls.ts'
import { ComposedTable4 } from './table-4-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table4ControlArgs,
    onAdd: fn(),
    onDiscard: fn(),
    onDraftsChange: fn(),
    onRowAction: fn(),
    onSave: fn(),
    onVisibleChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table4/Behavior',
} satisfies Meta<
  Table4Controls & {
    onAdd: () => void
    onDiscard: () => void
    onDraftsChange: () => void
    onRowAction: () => void
    onSave: () => void
    onVisibleChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      'tbody [data-slot="table-row"]',
    ),
  )

const rowOf = (canvasElement: HTMLElement, name: string) =>
  rowsOf(canvasElement).find((row) =>
    row.textContent?.includes(name),
  ) as HTMLElement

const editCell = async (
  canvasElement: HTMLElement,
  name: RegExp,
  value: string,
) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  const input = await within(canvasElement).findByRole('textbox')
  await userEvent.clear(input)
  if (value) await userEvent.type(input, value)
  return input
}

const footerOf = (canvasElement: HTMLElement) =>
  within(
    canvasElement.querySelector('[data-slot="table-4-footer"]') as HTMLElement,
  )

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles do inventário',
  })

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Inventário de produtos')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    await expect(toolbar).toHaveTextContent(
      'Edite preços e estoque direto na tabela.',
    )
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('searchbox', { name: 'Buscar produtos' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Adicionar produto' }),
    ).toBeVisible()
  },
}

export const EachRowShowsTheProduct: Story = {
  play: async ({ canvasElement }) => {
    const first = within(rowOf(canvasElement, 'Camiseta de algodão'))
    await expect(rowsOf(canvasElement)).toHaveLength(6)
    await expect(first.getByText('VES-1042')).toBeVisible()
    await expect(first.getByText('Vestuário')).toBeVisible()
    await expect(first.getByText('Ativo')).toBeVisible()
    await expect(first.getByText('R$ 89,90')).toBeVisible()
  },
}

export const LowStockIsNamedForAssistiveTechnology: Story = {
  play: async ({ canvasElement }) => {
    await expect(rowOf(canvasElement, 'Tênis de trilha')).toHaveTextContent(
      'Estoque baixo',
    )
    await expect(
      rowOf(canvasElement, 'Camiseta de algodão'),
    ).not.toHaveTextContent('Estoque baixo')
  },
}

export const TheThresholdDecidesTheLowStockWarning: Story = {
  args: { lowStockThreshold: 50 },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-low-stock]'),
    ).toHaveLength(4)
  },
}

export const EditingAPriceReportsADraft: Story = {
  play: async ({ args, canvasElement }) => {
    await editCell(canvasElement, /^Preço: R\$\s89,90/, '94,90{Enter}')
    await expect(args.onDraftsChange).toHaveBeenLastCalledWith({
      'prd-1042': { price: 94.9 },
    })
    const row = rowOf(canvasElement, 'Camiseta de algodão')
    await expect(within(row).getByText('R$ 94,90')).toBeVisible()
    await expect(row.querySelector('[data-changed]')).toHaveTextContent(
      'Alterado',
    )
    await expect(
      footerOf(canvasElement).getByText('1 alteração não salva'),
    ).toBeVisible()
  },
}

export const TypingTheSavedValueClearsTheDraft: Story = {
  play: async ({ args, canvasElement }) => {
    await editCell(canvasElement, /^Estoque: 14/, '20{Enter}')
    await editCell(canvasElement, /^Estoque: 20/, '14{Enter}')
    await expect(args.onDraftsChange).toHaveBeenLastCalledWith({})
    await expect(
      footerOf(canvasElement).getByText('Todas as alterações salvas'),
    ).toBeVisible()
  },
}

export const ANegativePriceIsRejected: Story = {
  play: async ({ args, canvasElement }) => {
    const input = await editCell(
      canvasElement,
      /^Preço: R\$\s89,90/,
      '-5{Enter}',
    )
    await expect(
      within(canvasElement).getByText('O preço não pode ser negativo.'),
    ).toBeVisible()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onDraftsChange).not.toHaveBeenCalled()
  },
}

export const APriceThatIsNotANumberIsRejected: Story = {
  play: async ({ canvasElement }) => {
    await editCell(canvasElement, /^Preço: R\$\s89,90/, 'abc')
    await expect(
      within(canvasElement).getByText('Informe um preço válido.'),
    ).toBeVisible()
  },
}

export const StockMustBeAWholeNonNegativeNumber: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = await editCell(canvasElement, /^Estoque: 320/, '2,5')
    await expect(canvas.getByText('Use um número inteiro.')).toBeVisible()
    await userEvent.clear(input)
    await userEvent.type(input, '-1{Enter}')
    await expect(
      canvas.getByText('O estoque não pode ser negativo.'),
    ).toBeVisible()
    await expect(args.onDraftsChange).not.toHaveBeenCalled()
  },
}

export const FooterButtonsWaitForChanges: Story = {
  play: async ({ canvasElement }) => {
    const footer = footerOf(canvasElement)
    await expect(footer.getByText('Todas as alterações salvas')).toBeVisible()
    await expect(
      footer.getByRole('button', { name: 'Descartar' }),
    ).toBeDisabled()
    await expect(
      footer.getByRole('button', { name: 'Salvar alterações' }),
    ).toBeDisabled()
  },
}

export const SaveReportsTheDrafts: Story = {
  play: async ({ args, canvasElement }) => {
    await editCell(canvasElement, /^Preço: R\$\s89,90/, '94,90{Enter}')
    await editCell(canvasElement, /^Estoque: 7/, '30{Enter}')
    await expect(
      footerOf(canvasElement).getByText('2 alterações não salvas'),
    ).toBeVisible()
    await userEvent.click(
      footerOf(canvasElement).getByRole('button', {
        name: 'Salvar alterações',
      }),
    )
    await expect(args.onSave).toHaveBeenCalledWith({
      'prd-1042': { price: 94.9 },
      'prd-3381': { stock: 30 },
    })
    await expect(
      footerOf(canvasElement).getByText('Todas as alterações salvas'),
    ).toBeVisible()
    await expect(rowOf(canvasElement, 'Tênis de trilha')).not.toHaveTextContent(
      'Estoque baixo',
    )
  },
}

export const DiscardRestoresTheSavedValues: Story = {
  play: async ({ args, canvasElement }) => {
    await editCell(canvasElement, /^Preço: R\$\s89,90/, '94,90{Enter}')
    await userEvent.click(
      footerOf(canvasElement).getByRole('button', { name: 'Descartar' }),
    )
    await expect(args.onDiscard).toHaveBeenCalledOnce()
    await expect(
      within(rowOf(canvasElement, 'Camiseta de algodão')).getByText('R$ 89,90'),
    ).toBeVisible()
  },
}

export const SavingDisablesTheFooter: Story = {
  render: () => (
    <Table4
      drafts={{ 'prd-1042': { price: 94.9 } }}
      onDiscard={fn()}
      onDraftsChange={fn()}
      onSave={fn()}
      products={products}
      saving
    />
  ),
  play: async ({ canvasElement }) => {
    const footer = footerOf(canvasElement)
    await expect(
      footer.getByRole('button', { name: 'Descartar' }),
    ).toBeDisabled()
    await expect(
      footer.getByRole('button', { name: /^Salvar alterações/ }),
    ).toHaveAttribute('data-loading')
  },
}

export const ServerErrorsMarkTheCell: Story = {
  render: () => (
    <Table4
      cellErrors={{ 'prd-3502': { price: 'Preço abaixo do custo.' } }}
      onDraftsChange={fn()}
      products={products}
    />
  ),
  play: async ({ canvasElement }) => {
    const row = rowOf(canvasElement, 'Bota Chelsea de camurça')
    await expect(within(row).getByText('Preço abaixo do custo.')).toBeVisible()
    await expect(
      within(row).getByRole('button', { name: /^Preço:/ }),
    ).toHaveAttribute('aria-invalid', 'true')
    await expect(
      row.querySelector('[data-slot="table-cell"][data-invalid]'),
    ).not.toBeNull()
  },
}

export const WithoutOnDraftsChangeCellsAreReadOnly: Story = {
  render: () => <Table4 products={products} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('button', { name: /^Preço:/ })).toBeNull()
    await expect(canvas.getByText('R$ 89,90')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-slot="table-4-footer"]'),
    ).toBeNull()
  },
}

export const TheSwitchReportsVisibility: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Mostrar Bota Chelsea de camurça na loja',
    })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(args.onVisibleChange).toHaveBeenCalledWith('prd-3502', true)
    await waitFor(() =>
      expect(
        within(canvasElement).getByRole('switch', {
          name: 'Mostrar Bota Chelsea de camurça na loja',
        }),
      ).toBeChecked(),
    )
  },
}

export const SearchMatchesNameAndSku: Story = {
  play: async ({ canvasElement }) => {
    const search = within(canvasElement).getByRole('searchbox', {
      name: 'Buscar produtos',
    })
    await userEvent.type(search, 'CAL-')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(2))
    await userEvent.clear(search)
    await userEvent.type(search, 'mochila')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
  },
}

export const TheStatusFilterNarrowsTheRows: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Status' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Rascunho' }),
    )
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent(
      'Bota Chelsea de camurça',
    )
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
    ).toBeVisible()
  },
}

export const RowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Óculos aviador',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('duplicate', 'prd-5260')
  },
}

export const AddProductNeedsItsCallback: Story = {
  args: { addButton: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Adicionar produto',
      }),
    ).toBeNull()
  },
}

export const AddProductCallsOnAdd: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Adicionar produto' }),
    )
    await expect(args.onAdd).toHaveBeenCalledOnce()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table4
      labels={{
        columns: { price: 'Valor' },
        title: 'Catálogo',
        unsavedChanges: (count) => `${count} pendentes`,
      }}
      drafts={{ 'prd-1042': { price: 94.9 } }}
      onDraftsChange={fn()}
      onSave={fn()}
      products={products}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Catálogo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Valor/ }),
    ).toBeVisible()
    await expect(canvas.getByText('1 pendentes')).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Table4 pending products={products} rowActions={rowActions} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando produtos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Table4 error onRetry={retry} products={products} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os produtos'),
    ).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(
      canvas.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Table4 error products={products} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table4 error pending products={products} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando produtos')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os produtos'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Table4 error products={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os produtos'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhum produto para exibir.')).toBeNull()
  },
}
