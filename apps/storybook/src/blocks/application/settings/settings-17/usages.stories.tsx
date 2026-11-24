import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings17,
  type Settings17Control,
} from '@tc96/blocks/application/settings/settings-17'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings17Handlers } from '../../../../mocks/settings-17.ts'
import { settings17ControlArgs } from './settings-17-controls.ts'
import { ComposedSettings17 } from './settings-17-layouts.tsx'

const PrivacyForm = ({
  initial,
}: Readonly<{ initial: Settings17Control[] }>) => {
  const [controls, setControls] = useState(initial)

  return (
    <Settings17
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
    queryFn: () => fetchJson<Settings17Control[]>('/settings/privacy'),
    queryKey: ['settings', 'privacy'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings17
        {...settings17ControlArgs}
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
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings17/Usages',
} satisfies Meta<typeof WorkspacePrivacy>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings17Handlers.loaded)
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
    msw.use(settings17Handlers.error)
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
    msw.use(settings17Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando privacidade',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
