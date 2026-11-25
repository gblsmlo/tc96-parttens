import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsPreference1,
  type SettingsPreference1Options,
  type SettingsPreference1Values,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsPreference1Handlers } from '../../../../../mocks/settings-preference-1.ts'
import { settingsPreference1ControlArgs } from './settings-preference-1-controls.ts'
import { ComposedSettingsPreference1 } from './settings-preference-1-layouts.tsx'

interface SettingsPreference1Preferences {
  options: SettingsPreference1Options
  values: SettingsPreference1Values
}

const PreferencesSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsPreference1Preferences>('/settings/preferences'),
    queryKey: ['settings', 'preferences'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsPreference1
        {...settingsPreference1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsPreference1
      onValueChange={fn()}
      options={data.options}
      values={data.values}
    />
  )
}

const meta = {
  component: PreferencesSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Preference/Settings1/Usages',
} satisfies Meta<typeof PreferencesSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference1Handlers.loaded)
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
    msw.use(settingsPreference1Handlers.error)
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
    msw.use(settingsPreference1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando preferências',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
