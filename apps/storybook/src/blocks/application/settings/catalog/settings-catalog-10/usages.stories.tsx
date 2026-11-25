import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog10,
  type SettingsCatalog10CostCenter,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-10'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog10Handlers } from '../../../../../mocks/settings-catalog-10.ts'
import { settingsCatalog10ControlArgs } from './settings-catalog-10-controls.ts'
import { ComposedSettingsCatalog10 } from './settings-catalog-10-layouts.tsx'

const WorkspaceCostCenters = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsCatalog10CostCenter[]>('/settings/cost-centers'),
    queryKey: ['settings', 'cost-centers'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog10
        {...settingsCatalog10ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsCatalog10
      costCenters={data}
      onCostCenterAction={fn()}
      onCreate={fn()}
    />
  )
}

const meta = {
  component: WorkspaceCostCenters,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings10/Usages',
} satisfies Meta<typeof WorkspaceCostCenters>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCenters)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Advocacia cível')).toBeVisible()
    await expect(canvas.getByText('Administrativo')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCentersEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum centro de custo ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog10Handlers.costCentersError)
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
    msw.use(settingsCatalog10Handlers.costCentersPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText(
        'Carregando centros de custo',
      ),
    ).toBeVisible()
  },
}
