import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings2,
  type Settings2Options,
  type Settings2Values,
} from '@tc96/blocks/application/settings/settings-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings2Handlers } from '../../../../mocks/settings-2.ts'
import { settings2ControlArgs } from './settings-2-controls.ts'
import { ComposedSettings2 } from './settings-2-layouts.tsx'

interface Settings2Preferences {
  options: Settings2Options
  values: Settings2Values
}

const PreferencesSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings2Preferences>('/settings/preferences'),
    queryKey: ['settings', 'preferences'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings2
        {...settings2ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings2
      onValueChange={fn()}
      options={data.options}
      values={data.values}
    />
  )
}

const meta = {
  component: PreferencesSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings2/Usages',
} satisfies Meta<typeof PreferencesSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Interface e tema')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Tema da interface' }),
    ).toHaveTextContent('Claro')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as preferências'),
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
    msw.use(settings2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando preferências',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
