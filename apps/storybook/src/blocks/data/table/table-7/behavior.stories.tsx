import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table7 } from '@tc96/ui/blocks/data/table/table-7'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { rules } from '../fixtures/table-7.ts'
import { type Table7Controls, table7ControlArgs } from './table-7-controls.ts'
import { ComposedTable7 } from './table-7-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...table7ControlArgs,
    onEnabledChange: fn(),
    onResetOrder: fn(),
    onRowAction: fn(),
    onRuleMove: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table7/Behavior',
} satisfies Meta<
  Table7Controls & {
    onEnabledChange: () => void
    onResetOrder: () => void
    onRowAction: () => void
    onRuleMove: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="data-table"] tbody [data-slot="table-row"]',
    ),
  )

const rowOf = (canvasElement: HTMLElement, name: string) =>
  rowsOf(canvasElement).find((row) =>
    row.textContent?.includes(name),
  ) as HTMLElement

const firstCellsOf = (canvasElement: HTMLElement) =>
  rowsOf(canvasElement).map(
    (row) =>
      row.querySelector('[data-slot="table-cell"]:nth-child(3) .font-medium')
        ?.textContent,
  )

const ranksOf = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('[data-slot="table-7-rank"]')).map(
    (rank) => rank.textContent,
  )

const handleOf = async (canvasElement: HTMLElement, name: string) => {
  const handle = within(canvasElement).getByRole('button', {
    name: `Arrastar para reordenar a regra ${name}`,
  })
  await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'false'))
  return handle
}

const liveRegionText = () =>
  [...document.querySelectorAll('[id^="dnd-kit-announcement"]')].at(-1)
    ?.textContent ?? ''

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles das regras de roteamento',
  })

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Regras de roteamento')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByText(
        'A primeira regra que casar vence · 5 ativas · 1.280 correspondências',
      ),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Restaurar ordem' }),
    ).toBeVisible()
  },
}

export const EachRowShowsTheRule: Story = {
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, 'Escalonamento urgente'))
    await expect(rowsOf(canvasElement)).toHaveLength(7)
    await expect(row.getByText('Chamados de alta prioridade')).toBeVisible()
    await expect(row.getByText('Prioridade')).toBeVisible()
    await expect(row.getByText('Prioridade é Urgente')).toBeVisible()
    await expect(row.getByText('Atribuir ao Nível 2')).toBeVisible()
    await expect(row.getByText('148')).toBeVisible()
    await expect(row.getByText('7d')).toBeVisible()
    await expect(
      row.getByText('148 correspondências nos últimos 7 dias'),
    ).toBeInTheDocument()
  },
}

export const TheSummaryCountsActiveRulesAndMatches: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'A primeira regra que casar vence · 5 ativas · 1.280 correspondências',
      ),
    ).toBeVisible()
  },
}

export const RanksFollowThePosition: Story = {
  play: async ({ canvasElement }) => {
    await expect(ranksOf(canvasElement)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ])
  },
}

export const DisabledRulesAreMuted: Story = {
  play: async ({ canvasElement }) => {
    const row = rowOf(canvasElement, 'Remetentes em massa')
    await expect(
      row.querySelector(
        '[data-slot="table-cell"]:nth-child(3) [data-disabled]',
      ),
    ).not.toBeNull()
    await expect(
      within(row).getByRole('switch', {
        name: 'Ativar a regra Remetentes em massa',
      }),
    ).not.toBeChecked()
    await expect(
      rowOf(canvasElement, 'Escalonamento urgente').querySelector(
        '[data-slot="table-cell"]:nth-child(3) [data-disabled]',
      ),
    ).toBeNull()
  },
}

export const KeyboardMovesARuleAndReportsTheMove: Story = {
  play: async ({ args, canvasElement }) => {
    ;(await handleOf(canvasElement, 'Escalonamento urgente')).focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')
    await waitFor(() => expect(args.onRuleMove).toHaveBeenCalledTimes(1))
    await expect(args.onRuleMove).toHaveBeenCalledWith({
      fromIndex: 0,
      overRuleId: 'rule-enterprise',
      ruleId: 'rule-urgent',
      toIndex: 1,
    })
    await waitFor(() =>
      expect(firstCellsOf(canvasElement).slice(0, 2)).toEqual([
        'Clientes enterprise',
        'Escalonamento urgente',
      ]),
    )
    await expect(ranksOf(canvasElement).slice(0, 2)).toEqual(['1', '2'])
  },
}

export const AnnouncementsComeFromTheLabels: Story = {
  play: async ({ canvasElement }) => {
    ;(await handleOf(canvasElement, 'Clientes enterprise')).focus()
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(liveRegionText()).toBe(
        'Regra Clientes enterprise pega na posição 2 de 7.',
      ),
    )
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(liveRegionText()).toBe(
        'Regra Clientes enterprise solta na posição 3 de 7.',
      ),
    )
  },
}

export const EscapeCancelsTheMove: Story = {
  play: async ({ args, canvasElement }) => {
    ;(await handleOf(canvasElement, 'Escalonamento urgente')).focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(liveRegionText()).toBe(
        'Movimento da regra Escalonamento urgente cancelado.',
      ),
    )
    await expect(args.onRuleMove).not.toHaveBeenCalled()
    await expect(firstCellsOf(canvasElement)[0]).toBe('Escalonamento urgente')
  },
}

export const ResetOrderWaitsForAChange: Story = {
  play: async ({ args, canvasElement }) => {
    const reset = within(canvasElement).getByRole('button', {
      name: 'Restaurar ordem',
    })
    await expect(reset).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(reset)
    await expect(args.onResetOrder).not.toHaveBeenCalled()
    ;(await handleOf(canvasElement, 'Escalonamento urgente')).focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')
    await waitFor(() => expect(reset).toHaveAttribute('aria-disabled', 'false'))
    await userEvent.click(reset)
    await expect(args.onResetOrder).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(firstCellsOf(canvasElement)[0]).toBe('Escalonamento urgente'),
    )
    await expect(reset).toHaveAttribute('aria-disabled', 'true')
  },
}

export const WithoutOnRuleMoveHandlesAreInert: Story = {
  args: { reorder: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', {
        name: 'Arrastar para reordenar a regra Escalonamento urgente',
      }),
    ).toBeDisabled()
    await expect(
      canvas.queryByRole('button', { name: 'Restaurar ordem' }),
    ).toBeNull()
  },
}

export const TheSwitchReportsTheRuleState: Story = {
  play: async ({ args, canvasElement }) => {
    const name = 'Ativar a regra Sinal fraco'
    await userEvent.click(within(canvasElement).getByRole('switch', { name }))
    await expect(args.onEnabledChange).toHaveBeenCalledWith(
      'rule-low-signal',
      true,
    )
    await waitFor(() =>
      expect(within(canvasElement).getByRole('switch', { name })).toBeChecked(),
    )
    await expect(
      within(canvasElement).getByText(
        'A primeira regra que casar vence · 6 ativas · 1.280 correspondências',
      ),
    ).toBeVisible()
  },
}

export const RowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações da regra Fora do expediente',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith(
      'delete',
      'rule-after-hours',
    )
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table7
      labels={{
        columns: { rule: 'Nome' },
        summary: (active) => `${active} em uso`,
        title: 'Triagem',
      }}
      rules={rules}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Triagem' })).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Nome/ }),
    ).toBeVisible()
    await expect(canvas.getByText('5 em uso')).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => (
    <Table7 onResetOrder={retry} orderChanged pending rules={rules} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando regras')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(
      canvas.queryByRole('button', { name: 'Restaurar ordem' }),
    ).toBeNull()
    await expect(
      canvas.queryByText(/A primeira regra que casar vence/),
    ).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Table7 error onRetry={retry} rules={rules} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as regras'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Table7 error rules={rules} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Table7 error pending rules={rules} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando regras')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as regras'),
    ).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Table7 error rules={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as regras'),
    ).toBeVisible()
    await expect(canvas.queryByText('Nenhuma regra de roteamento.')).toBeNull()
  },
}
