import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsCatalog1,
  type SettingsCatalog1Tag,
} from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-1'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsHandlers } from '../../../../../mocks/settings.ts'
import { settingsCatalog1ControlArgs } from './settings-catalog-1-controls.ts'
import { ComposedSettingsCatalog1 } from './settings-catalog-1-layouts.tsx'

const WorkspaceTags = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsCatalog1Tag[]>('/settings/tags'),
    queryKey: ['settings', 'tags'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsCatalog1
        {...settingsCatalog1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <SettingsCatalog1 onCreate={fn()} onTagAction={fn()} tags={data} />
}

const meta = {
  component: WorkspaceTags,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Catalog/Settings1/Usages',
} satisfies Meta<typeof WorkspaceTags>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tags)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsPending)
  },
}
