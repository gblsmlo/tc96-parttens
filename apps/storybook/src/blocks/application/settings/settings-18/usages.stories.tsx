import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings18 } from '@tc96/blocks/application/settings/settings-18'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings18Handlers } from '../../../../mocks/settings-18.ts'
import type { RolePermissions } from '../fixtures/settings-18.ts'

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
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<RolePermissions>('/settings/permissions'),
    queryKey: ['settings', 'permissions'],
  })

  if (isPending) return <Spinner aria-label="Carregando permissões" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as permissões</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <PermissionsForm initial={data} />
}

const meta = {
  component: WorkspacePermissions,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
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
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as permissões',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings18Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando permissões'),
    ).toBeVisible()
  },
}
