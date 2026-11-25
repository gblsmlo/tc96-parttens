import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Navbar7,
  type Navbar7Range,
} from '@tc96/ui/blocks/application/navbar/navbar-7'
import { MenuItem } from '@tc96/ui/menu'
import { useState } from 'react'
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

export const SwitchingReportsFromTheSearch: Story = {}

export const ComparingAndRefreshing: Story = {}
