import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { SettingsCatalog2 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-2'
import { useState } from 'react'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsCatalog2Handlers } from '../../../../../mocks/settings-catalog-2.ts'
import type { SettingsCatalog2Sla } from '../../fixtures/settings-catalog-2.ts'
import { settingsCatalog2ControlArgs } from './settings-catalog-2-controls.ts'
import { ComposedSettingsCatalog2 } from './settings-catalog-2-layouts.tsx'

const SlaSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog2Sla>('/settings/sla'),
    queryKey: ['settings', 'sla'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog2
        {...settingsCatalog2ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <SlaSwitch initial={data.enabled} />
}

const SlaSwitch = ({ initial }: { initial: boolean }) => {
  const [enabled, setEnabled] = useState(initial)
  return <SettingsCatalog2 enabled={enabled} onEnabledChange={setEnabled} />
}

const meta = {
  component: SlaSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings2/Usages',
} satisfies Meta<typeof SlaSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsCatalog2Handlers.pending)
  },
}
