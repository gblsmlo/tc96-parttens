import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsCatalog5 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-5'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog5Handlers } from '../../../../../mocks/settings-catalog-5.ts'
import {
  type SettingsCatalog5Wire,
  toSettingsCatalog5Groups,
} from '../../fixtures/settings-catalog-5.ts'
import { settingsCatalog5ControlArgs } from './settings-catalog-5-controls.ts'
import { ComposedSettingsCatalog5 } from './settings-catalog-5-layouts.tsx'

const WorkspaceStatuses = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog5Wire[]>('/settings/statuses'),
    queryKey: ['settings', 'statuses'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog5
        {...settingsCatalog5ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsCatalog5
      groups={toSettingsCatalog5Groups(data)}
      onCreate={fn()}
      onStatusAction={fn()}
    />
  )
}

const meta = {
  component: WorkspaceStatuses,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings5/Usages',
} satisfies Meta<typeof WorkspaceStatuses>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog5Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Em andamento')).toBeVisible()
    await expect(canvas.getByText('Encerrados')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog5Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os status'),
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
    msw.use(settingsCatalog5Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando status')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
