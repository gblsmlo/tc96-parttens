import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsPreference3 } from '@tc96/ui/blocks/application/settings/preference/settings-preference-3'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsPreference3Handlers } from '../../../../../mocks/settings-preference-3.ts'
import type { SettingsPreference3Data } from '../../fixtures/settings-preference-3.ts'
import { settingsPreference3ControlArgs } from './settings-preference-3-controls.ts'
import { ComposedSettingsPreference3 } from './settings-preference-3-layouts.tsx'

const AppearanceSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsPreference3Data>('/settings/appearance'),
    queryKey: ['settings', 'appearance'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsPreference3
        {...settingsPreference3ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <SettingsPreference3
      colorTheme={data.colorTheme}
      mode={data.mode}
      modeOptions={data.modeOptions}
      onColorThemeChange={fn()}
      onModeChange={fn()}
      themeGroups={data.themeGroups}
    />
  )
}

const meta = {
  component: AppearanceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Preference/Settings3/Usages',
} satisfies Meta<typeof AppearanceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference3Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference3Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsPreference3Handlers.pending)
  },
}
