import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsSecurity1,
  type SettingsSecurity1Control,
} from '@tc96/ui/blocks/application/settings/security/settings-security-1'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = await canvas.findByRole('switch', {
      name: 'Acesso do suporte',
    })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsSecurity1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar a privacidade'),
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
    msw.use(settingsSecurity1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando privacidade',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
