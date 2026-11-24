import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPagination } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import {
  InventoryGrid,
  PageSizeGrid,
  PRICE_NEGATIVE_MESSAGE,
  RenewalsGrid,
} from './data-grid-table-blocks.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Grid/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (grid: HTMLElement) =>
  grid.querySelectorAll('[data-slot="data-grid-row"]')

const chipOf = (root: HTMLElement, field: string) =>
  within(root).getByRole('group', { name: `Filtro: ${field}` })

const noop = () => undefined

const changeSpy = fn()

export const PageSizeSelectorResizesThePage: Story = {
  render: () => <PageSizeGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Projetos' })
    await expect(rowsOf(grid)).toHaveLength(5)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(await canvas.findByText('2 / 2')).toBeVisible()

    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Linhas por página' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '3' }))
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(3))
    await expect(canvas.getByText('1–3 de 8')).toBeVisible()
    await expect(canvas.getByText('1 / 3')).toBeVisible()
  },
}

export const PageSizeSelectorNeedsOptionsAndCallback: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <CollectionPagination
        label="Só opções"
        onPageChange={noop}
        page={1}
        pageCount={3}
        pageSize={5}
        pageSizeLabel="Linhas por página"
        pageSizeOptions={[5, 10]}
        total={12}
      />
      <CollectionPagination
        label="Só retorno"
        onPageChange={noop}
        onPageSizeChange={noop}
        page={1}
        pageCount={3}
        pageSize={5}
        pageSizeLabel="Linhas por página"
        total={12}
      />
      <CollectionPagination
        label="Completa"
        onPageChange={noop}
        onPageSizeChange={noop}
        page={1}
        pageCount={3}
        pageSize={5}
        pageSizeLabel="Linhas por página"
        pageSizeOptions={[5, 10]}
        total={12}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('combobox')).toHaveLength(1)
    const complete = canvas
      .getByRole('navigation', { name: 'Completa' })
      .closest<HTMLElement>('[data-slot="collection-pagination"]')
    if (!complete) throw new Error('The pagination root is missing.')
    await expect(
      within(complete).getByRole('combobox', { name: 'Linhas por página' }),
    ).toBeVisible()
  },
}

export const FieldSearchNarrowsTheFiltersMenu: Story = {
  render: () => <RenewalsGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Filtros' }))
    const search = await screen.findByRole('combobox', { name: 'Buscar campo' })
    await expect(await screen.findAllByRole('option')).toHaveLength(6)

    await userEvent.type(search, 'seg')
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1))
    await expect(screen.getByRole('option', { name: 'Segmento' })).toBeVisible()

    await userEvent.clear(search)
    await userEvent.type(search, 'zzz')
    await expect(
      await screen.findByText('Nenhum campo encontrado.'),
    ).toBeVisible()
  },
}

export const AddedConditionKeepsEveryRowUntilItHasAValue: Story = {
  render: () => <RenewalsGrid />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(8)
    await expect(
      canvas.queryByRole('button', { name: 'Limpar filtros' }),
    ).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Filtros' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Segmento' }),
    )

    const chip = chipOf(canvasElement, 'Segmento')
    await expect(within(chip).getByRole('button', { name: 'é' })).toBeVisible()
    await expect(
      within(chip).getByRole('button', { name: 'Escolher valor' }),
    ).toBeVisible()
    await expect(rowsOf(grid)).toHaveLength(8)
    await expect(
      canvas.getByRole('button', { name: 'Limpar filtros' }),
    ).toBeVisible()
  },
}

export const ConditionValueAndOperatorFilterTheRows: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        { columnId: 'segment', id: 'c1', operator: 'is', value: [] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    const chip = chipOf(canvasElement, 'Segmento')

    await userEvent.click(
      within(chip).getByRole('button', { name: 'Escolher valor' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Enterprise' }),
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(3))
    await expect(within(grid).getByText('Acme Corp')).toBeVisible()
    await expect(within(grid).queryByText('Globex')).toBeNull()

    await userEvent.click(within(chip).getByRole('button', { name: 'é' }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'não é' }),
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(5))
    await expect(within(grid).queryByText('Acme Corp')).toBeNull()
    await expect(within(grid).getByText('Globex')).toBeVisible()
  },
}

export const AnyOfMatchesEachSelectedValue: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        {
          columnId: 'segment',
          id: 'c1',
          operator: 'is-any-of',
          value: ['enterprise', 'smb'],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(6)
    await expect(within(grid).queryByText('Globex')).toBeNull()

    await userEvent.click(
      within(chipOf(canvasElement, 'Segmento')).getByRole('button', {
        name: /Enterprise/,
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Mid-market' }),
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(8))
  },
}

export const DateRangeIncludesBothEnds: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        {
          columnId: 'renewal',
          id: 'c1',
          operator: 'between',
          value: ['2026-12-10', '2027-01-15'],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(3)
    for (const account of ['Acme Corp', 'Globex', 'Initech']) {
      await expect(within(grid).getByText(account)).toBeVisible()
    }
    const chip = chipOf(canvasElement, 'Janela de renovação')
    await expect(within(chip).getByText('2026-12-10')).toBeVisible()
    await expect(within(chip).getByText('e')).toBeVisible()
    await expect(within(chip).getByText('2027-01-15')).toBeVisible()
  },
}

export const TextConditionFiltersWhileTyping: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        { columnId: 'account', id: 'c1', operator: 'contains', value: [] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await userEvent.click(
      within(chipOf(canvasElement, 'Conta')).getByRole('button', {
        name: 'Escolher valor',
      }),
    )
    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Valor de Conta' }),
      'CO',
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(2))
    await expect(within(grid).getByText('Acme Corp')).toBeVisible()
    await expect(within(grid).getByText('Wayne Co')).toBeVisible()
  },
}

export const OrJoinMatchesAnyCondition: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        { columnId: 'stage', id: 'c1', operator: 'is', value: ['closed'] },
        { columnId: 'risk', id: 'c2', operator: 'is', value: ['high'] },
      ]}
      join="or"
    />
  ),
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(4)
    await expect(within(grid).getByText('Stark Labs')).toBeVisible()
  },
}

export const AndJoinNeedsEveryCondition: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        {
          columnId: 'segment',
          id: 'c1',
          operator: 'is',
          value: ['enterprise'],
        },
        { columnId: 'risk', id: 'c2', operator: 'is', value: ['high'] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(2)
    await expect(within(grid).getByText('Acme Corp')).toBeVisible()
    await expect(within(grid).getByText('Umbrella')).toBeVisible()
  },
}

export const RemoveFromTheActionsMenu: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        { columnId: 'segment', id: 'c1', operator: 'is', value: ['smb'] },
        { columnId: 'stage', id: 'c2', operator: 'is', value: ['discovery'] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(2)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações do filtro Etapa' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover filtro' }),
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(3))
    await expect(
      canvas.queryByRole('group', { name: 'Filtro: Etapa' }),
    ).toBeNull()
    await expect(chipOf(canvasElement, 'Segmento')).toBeVisible()
  },
}

export const ClearFiltersRemovesEveryCondition: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        { columnId: 'segment', id: 'c1', operator: 'is', value: ['smb'] },
        { columnId: 'stage', id: 'c2', operator: 'is', value: ['discovery'] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Renovações' })
    await expect(rowsOf(grid)).toHaveLength(2)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Limpar filtros' }),
    )
    await waitFor(() => expect(rowsOf(grid)).toHaveLength(8))
    await expect(
      canvas.queryAllByRole('group', { name: /^Filtro:/ }),
    ).toHaveLength(0)
    await expect(
      canvas.queryByRole('button', { name: 'Limpar filtros' }),
    ).toBeNull()
  },
}

const priceTrigger = (root: HTMLElement) =>
  within(root).getByRole('button', { name: 'Preço: 349.9' })

const openPriceEditor = async (root: HTMLElement) => {
  await userEvent.click(priceTrigger(root))
  const input = await within(root).findByRole('textbox', { name: 'Preço' })
  await waitFor(() => expect(input).toHaveFocus())
  await userEvent.clear(input)
  return input
}

export const InvalidValueIsMarkedAndNotCommitted: Story = {
  render: () => <InventoryGrid onCellValueChange={changeSpy} />,
  play: async ({ canvasElement }) => {
    changeSpy.mockClear()
    const canvas = within(canvasElement)
    const input = await openPriceEditor(canvasElement)
    await userEvent.type(input, '-5')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const message = canvas.getByText(PRICE_NEGATIVE_MESSAGE)
    await expect(input).toHaveAttribute('aria-describedby', message.id)
    const cell = input.closest<HTMLElement>('[role="gridcell"]')
    await waitFor(() => expect(cell).toHaveAttribute('data-invalid'))

    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByRole('textbox', { name: 'Preço' })).toBeVisible()
    await expect(canvas.getByText(PRICE_NEGATIVE_MESSAGE)).toBeVisible()
    await expect(changeSpy).not.toHaveBeenCalled()
  },
}

export const EscapeRestoresTheLastValidValue: Story = {
  render: () => <InventoryGrid onCellValueChange={changeSpy} />,
  play: async ({ canvasElement }) => {
    changeSpy.mockClear()
    const canvas = within(canvasElement)
    const input = await openPriceEditor(canvasElement)
    await userEvent.type(input, '-5')
    const cell = input.closest<HTMLElement>('[role="gridcell"]')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull())
    await expect(priceTrigger(canvasElement)).toHaveFocus()
    await expect(canvas.queryByText(PRICE_NEGATIVE_MESSAGE)).toBeNull()
    await expect(cell).not.toHaveAttribute('data-invalid')
    await expect(changeSpy).not.toHaveBeenCalled()
  },
}

export const BlurDoesNotCommitAnInvalidValue: Story = {
  render: () => <InventoryGrid onCellValueChange={changeSpy} />,
  play: async ({ canvasElement }) => {
    changeSpy.mockClear()
    const canvas = within(canvasElement)
    const input = await openPriceEditor(canvasElement)
    await userEvent.type(input, '-5')

    await userEvent.tab()
    await expect(
      canvas.getByRole('textbox', { name: 'Preço' }),
    ).toHaveAttribute('aria-invalid', 'true')
    await expect(changeSpy).not.toHaveBeenCalled()
  },
}

export const ValidValueIsCommittedOnEnter: Story = {
  render: () => <InventoryGrid onCellValueChange={changeSpy} />,
  play: async ({ canvasElement }) => {
    changeSpy.mockClear()
    const canvas = within(canvasElement)
    const input = await openPriceEditor(canvasElement)
    await userEvent.type(input, '99')
    await expect(input).not.toHaveAttribute('aria-invalid')

    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull())
    await expect(changeSpy).toHaveBeenCalledTimes(1)
    await expect(changeSpy).toHaveBeenCalledWith({
      columnId: 'price',
      rowId: 'INV-1',
      value: '99',
    })
    await expect(
      canvas.getByRole('button', { name: 'Preço: 99' }),
    ).toHaveFocus()
  },
}

export const ExternalErrorMarksTheCell: Story = {
  render: () => (
    <InventoryGrid serverErrors={{ 'INV-2:sku': 'O SKU já está em uso.' }} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'SKU: MS-210' })
    await expect(trigger).toHaveAttribute('aria-invalid', 'true')
    const message = canvas.getByText('O SKU já está em uso.')
    await expect(trigger).toHaveAttribute('aria-describedby', message.id)
    await waitFor(() =>
      expect(trigger.closest('[role="gridcell"]')).toHaveAttribute(
        'data-invalid',
      ),
    )
    await expect(
      canvas.getByRole('button', { name: 'SKU: KB-100' }),
    ).not.toHaveAttribute('aria-invalid')
  },
}
