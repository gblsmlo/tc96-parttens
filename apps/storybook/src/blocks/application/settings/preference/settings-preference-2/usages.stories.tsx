import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsPreference2 } from '@tc96/ui/blocks/application/settings/preference/settings-preference-2'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsPreference2Handlers } from '../../../../../mocks/settings-preference-2.ts'
import type { SettingsPreference2Data } from '../../fixtures/settings-preference-2.ts'
import { settingsPreference2ControlArgs } from './settings-preference-2-controls.ts'
import { ComposedSettingsPreference2 } from './settings-preference-2-layouts.tsx'

const InterfaceSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsPreference2Data>('/settings/interface'),
    queryKey: ['settings', 'interface'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsPreference2
        {...settingsPreference2ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsPreference2
      onValueChange={fn()}
      options={data.options}
      values={data.values}
    />
  )
}

const meta = {
  component: InterfaceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Preference/Settings2/Usages',
} satisfies Meta<typeof InterfaceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference2Handlers.pending)
  },
}
