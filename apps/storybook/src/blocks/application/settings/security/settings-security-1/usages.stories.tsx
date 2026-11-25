import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsSecurity1,
  type SettingsSecurity1Control,
} from '@tc96/ui/blocks/application/settings/security/settings-security-1'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsSecurity1Handlers } from '../../../../../mocks/settings-security-1.ts'
import { settingsSecurity1ControlArgs } from './settings-security-1-controls.ts'
import { ComposedSettingsSecurity1 } from './settings-security-1-layouts.tsx'

const PrivacyForm = ({
  initial,
}: Readonly<{ initial: SettingsSecurity1Control[] }>) => {
  const [controls, setControls] = useState(initial)

  return (
    <SettingsSecurity1
      controls={controls}
      onAction={fn()}
      onCheckedChange={(id, checked) =>
        setControls((current) =>
          current.map((control) =>
            control.id === id ? { ...control, checked } : control,
          ),
        )
      }
    />
  )
}

const WorkspacePrivacy = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<SettingsSecurity1Control[]>('/settings/privacy'),
    queryKey: ['settings', 'privacy'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsSecurity1
        {...settingsSecurity1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <PrivacyForm initial={data} />
}

const meta = {
  component: WorkspacePrivacy,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Security/Settings1/Usages',
} satisfies Meta<typeof WorkspacePrivacy>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsSecurity1Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsSecurity1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsSecurity1Handlers.pending)
  },
}
