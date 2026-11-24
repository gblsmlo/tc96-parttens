import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings18 } from '@tc96/blocks/application/settings/settings-18'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings18Handlers } from '../../../../mocks/settings-18.ts'
import type { RolePermissions } from '../fixtures/settings-18.ts'
import { settings18ControlArgs } from './settings-18-controls.ts'
import { ComposedSettings18 } from './settings-18-layouts.tsx'

const PermissionsForm = ({
  initial,
}: Readonly<{ initial: RolePermissions }>) => {
  const [role, setRole] = useState(initial.role)
  const [capabilities, setCapabilities] = useState(initial.capabilities)

  return (
    <Settings18
      capabilities={capabilities}
      onCapabilityChange={(id, checked) =>
        setCapabilities((current) =>
          current.map((capability) =>
            capability.id === id ? { ...capability, checked } : capability,
          ),
        )
      }
      onRoleChange={setRole}
      roles={initial.roles}
      selectedRole={role}
    />
  )
}

const WorkspacePermissions = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<RolePermissions>('/settings/permissions'),
    queryKey: ['settings', 'permissions'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings18
        {...settings18ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <PermissionsForm initial={data} />
}

const meta = {
  component: WorkspacePermissions,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings18/Usages',
} satisfies Meta<typeof WorkspacePermissions>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings18Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const toggle = await within(canvasElement).findByRole('switch', {
      name: 'Editar leads',
    })
    await expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings18Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma capacidade'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings18Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as permissões'),
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
    msw.use(settings18Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando permissões',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
