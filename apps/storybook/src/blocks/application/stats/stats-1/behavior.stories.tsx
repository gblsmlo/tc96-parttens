import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats1 } from '@tc96/blocks/application/stats/stats-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { stats } from '../fixtures/stats-1.ts'
import { type Stats1Controls, stats1ControlArgs } from './stats-1-controls.ts'
import { ComposedStats1 } from './stats-1-layouts.tsx'

const meta = {
  args: { ...stats1ControlArgs, onStatAction: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats1/Behavior',
} satisfies Meta<
  Stats1Controls & { onStatAction: (statId: string, action: string) => void }
>

export default meta

type Story = StoryObj<typeof meta>

export const EachStatIsARegionNamedByItsLabel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('region')).toHaveLength(5)
    await expect(
      canvas.getByRole('region', { name: 'Receita do mês' }),
    ).toHaveTextContent(/R\$\s*128\.450,90/)
    await expect(
      canvas.getByRole('region', { name: 'Taxa de conversão' }),
    ).toHaveTextContent(/24,1%/)
    await expect(
      canvas.getByRole('region', { name: 'Novos leads' }),
    ).toHaveTextContent('1.284')
  },
}

export const TrendFollowsTheSign: Story = {
  play: async ({ canvasElement }) => {
    const directions = canvasElement.querySelectorAll('[data-direction]')
    await expect(
      Array.from(directions).map((node) => node.getAttribute('data-direction')),
    ).toEqual(['up', 'up', 'down', 'flat'])
    const down = within(
      within(canvasElement).getByRole('region', { name: 'Taxa de conversão' }),
    ).getByText(/Queda de/)
    await expect(down).toHaveClass('sr-only')
  },
}

export const EmptyListShowsStateSurface: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status')
    await expect(status).toHaveAttribute('data-kind', 'empty')
    await expect(status).toHaveTextContent('Nenhum indicador ainda')
  },
}

export const MenuNeedsOnStatAction: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /^Ações de/ }),
    ).toBeNull()
  },
}

export const MenuCallsOnStatAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Novos leads',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Ver detalhes',
      'Exportar',
    ])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Exportar' }))
    await waitFor(() =>
      expect(args.onStatAction).toHaveBeenCalledWith('leads', 'export'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Stats1
      labels={{
        actions: (label) => `Opções de ${label}`,
        title: 'Resumo',
        trend: { down: 'Baixa de', flat: 'Estável', up: 'Subida de' },
      }}
      onStatAction={args.onStatAction}
      stats={stats}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Resumo' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Opções de Novos leads' }),
    ).toBeVisible()
    await expect(canvas.getAllByText(/Subida de/)).toHaveLength(2)
    await expect(canvas.queryByText(/Alta de/)).toBeNull()
  },
}
