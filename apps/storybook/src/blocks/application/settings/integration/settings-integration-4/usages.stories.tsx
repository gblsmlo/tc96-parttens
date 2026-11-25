import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsIntegration4,
  type SettingsIntegration4Section,
} from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsIntegration4Handlers } from '../../../../../mocks/settings-integration-4.ts'
import { settingsIntegration4ControlArgs } from './settings-integration-4-controls.ts'
import { ComposedSettingsIntegration4 } from './settings-integration-4-layouts.tsx'

const Connections = ({
  initial,
}: Readonly<{ initial: SettingsIntegration4Section[] }>) => {
  const [sections, setSections] = useState(initial)

  useEffect(() => setSections(initial), [initial])

  const disconnect = (appId: string) =>
    setSections((current) =>
      current.map((section) => ({
        ...section,
        apps: section.apps.filter((app) => app.id !== appId),
      })),
    )

  return (
    <SettingsIntegration4
      onAction={(appId, action) => {
        if (action === 'disconnect') disconnect(appId)
      }}
      onCreate={() => undefined}
      sections={sections}
    />
  )
}

const WorkspaceConnections = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<SettingsIntegration4Section[]>('/settings/connections'),
    queryKey: ['settings', 'connections'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsIntegration4
        {...settingsIntegration4ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <Connections initial={data} />
}

const meta = {
  component: WorkspaceConnections,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Integration/Settings4/Usages',
} satisfies Meta<typeof WorkspaceConnections>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration4Handlers.sections)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ações de Slack' }),
    )
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: 'Desconectar',
      }),
    )
    await expect(canvas.queryByText('Slack')).toBeNull()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration4Handlers.sectionsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma conexão'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsIntegration4Handlers.sectionsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as conexões'),
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
    msw.use(settingsIntegration4Handlers.sectionsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando conexões',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
