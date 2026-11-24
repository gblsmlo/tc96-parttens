import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings16,
  type Settings16CostCenter,
} from '@tc96/blocks/application/settings/settings-16'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings16Handlers } from '../../../../mocks/settings-16.ts'
import { settings16ControlArgs } from './settings-16-controls.ts'
import { ComposedSettings16 } from './settings-16-layouts.tsx'

const WorkspaceCostCenters = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings16CostCenter[]>('/settings/cost-centers'),
    queryKey: ['settings', 'cost-centers'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings16
        {...settings16ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings16 costCenters={data} onCostCenterAction={fn()} onCreate={fn()} />
  )
}

const meta = {
  component: WorkspaceCostCenters,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings16/Usages',
} satisfies Meta<typeof WorkspaceCostCenters>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings16Handlers.costCenters)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Advocacia cível')).toBeVisible()
    await expect(canvas.getByText('Administrativo')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings16Handlers.costCentersEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum centro de custo ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings16Handlers.costCentersError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os centros de custo'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings16Handlers.costCentersPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando centros de custo',
      ),
    ).toBeVisible()
  },
}
