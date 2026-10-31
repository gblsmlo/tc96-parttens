import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspectorLogs, type FlowLogEntry } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const entries: FlowLogEntry[] = [
  {
    description: 'Passed: 1.842 tokens',
    id: 'a',
    sequence: 1,
    status: 'success',
    stepId: 's1',
    stepName: 'Claude',
  },
  {
    description: 'Falhou ao enviar',
    id: 'b',
    sequence: 2,
    status: 'failed',
    stepId: 's2',
    stepName: 'Resend',
  },
]

const meta = {
  args: { entries, filter: 'all', onFilterChange: fn() },
  component: FlowInspectorLogs,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Renderers/Logs',
} satisfies Meta<typeof FlowInspectorLogs>

export default meta
type Story = StoryObj<typeof meta>

export const ListsEntries: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('2 entradas')).toBeVisible()
    const items = canvas.getAllByRole('listitem')
    await expect(items).toHaveLength(2)
    const [first, second] = items as [HTMLElement, HTMLElement]
    await expect(within(first).getByText('Claude')).toBeVisible()
    await expect(within(first).getByText('#1')).toBeVisible()
    await expect(within(first).getByText('Passed: 1.842 tokens')).toBeVisible()
    await expect(
      within(second).getByRole('img', { name: 'Falhou' }),
    ).toBeInTheDocument()
  },
}

export const CountsOneInSingular: Story = {
  args: { entries: entries.slice(0, 1), filter: 'step' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 entrada')).toBeVisible()
  },
}

export const FilterPressedAndReported: Story = {
  args: { filter: 'step' },
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Filtrar logs',
    })
    const step = within(group).getByRole('button', { name: 'Este passo' })
    const all = within(group).getByRole('button', { name: 'Todos os passos' })
    await expect(step).toHaveAttribute('aria-pressed', 'true')
    await expect(all).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(all)
    await expect(args.onFilterChange).toHaveBeenCalledWith('all')
  },
}

export const EmptyRunsAction: Story = {
  args: {
    emptyActionLabel: 'Executar uma vez',
    entries: [],
    onEmptyAction: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Sem logs ainda')).toBeVisible()
    await expect(canvas.getByText('0 entradas')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Executar uma vez' }),
    )
    await expect(args.onEmptyAction).toHaveBeenCalledTimes(1)
  },
}

export const EmptyActionNeedsCallback: Story = {
  args: { emptyActionLabel: 'Executar uma vez', entries: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Executar uma vez',
      }),
    ).toBeNull()
  },
}
