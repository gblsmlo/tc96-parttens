import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Navbar7,
  type Navbar7Range,
} from '@tc96/ui/blocks/application/navbar/navbar-7'
import { MenuItem } from '@tc96/ui/menu'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  novemberRange,
  refreshOptions,
  searchItems,
} from '../fixtures/navbar-7.ts'

const reports = searchItems.filter((item) => item.group === 'Relatórios')

const AnalyticsPage = () => {
  const [report, setReport] = useState(reports[0])
  const [range, setRange] = useState<Navbar7Range>(novemberRange)
  const [compare, setCompare] = useState(false)
  const [interval, setInterval] = useState('off')
  const [refreshes, setRefreshes] = useState(0)

  return (
    <div className="min-h-80">
      <Navbar7
        breadcrumb={[
          { href: '/analises', id: 'analytics', label: 'Análises' },
          { id: report.id, label: report.label },
        ]}
        compare={compare}
        menu={
          <>
            <MenuItem>Exportar como PDF</MenuItem>
            <MenuItem>Duplicar painel</MenuItem>
          </>
        }
        onCompareChange={setCompare}
        onRangeChange={setRange}
        onRefresh={() => setRefreshes((count) => count + 1)}
        onRefreshIntervalChange={setInterval}
        onSearchSelect={(id) => {
          const next = reports.find((item) => item.id === id)
          if (next) setReport(next)
        }}
        onShare={() => undefined}
        range={range}
        refreshInterval={interval}
        refreshOptions={refreshOptions}
        searchItems={searchItems}
      />
      <main className="flex flex-col gap-2 p-6 text-sm">
        <h1 className="font-semibold text-lg">{report.label}</h1>
        <p className="text-muted-foreground">
          {compare
            ? 'Comparando com o período anterior.'
            : 'Sem comparação com o período anterior.'}
        </p>
        <p className="text-muted-foreground">
          Dados atualizados {refreshes} {refreshes === 1 ? 'vez' : 'vezes'}.
        </p>
      </main>
    </div>
  )
}

const meta = {
  component: AnalyticsPage,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar7/Usages',
} satisfies Meta<typeof AnalyticsPage>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchingReportsFromTheSearch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Visão de crescimento' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: /Buscar/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Retenção de clientes' }),
    )
    await expect(
      canvas.getByRole('heading', { name: 'Retenção de clientes' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Retenção de clientes', { selector: '[aria-current]' }),
    ).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const ComparingAndRefreshing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Comparar' }))
    await expect(
      canvas.getByText('Comparando com o período anterior.'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Atualizar dados' }),
    )
    await expect(canvas.getByText('Dados atualizados 1 vez.')).toBeVisible()
  },
}
