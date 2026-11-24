import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar2 } from '@tc96/ui/blocks/application/navbar/navbar-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { environments, organizations, projects } from '../fixtures/navbar-2.ts'
import {
  type Navbar2Controls,
  navbar2ControlArgs,
} from './navbar-2-controls.ts'
import { ComposedNavbar2 } from './navbar-2-layouts.tsx'

const meta = {
  args: navbar2ControlArgs,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar2/Behavior',
} satisfies Meta<Navbar2Controls>

export default meta

type Story = StoryObj<typeof meta>

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const TriggersShowTheSelectedNames: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Organização: Acme Logística' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Projeto: Checkout' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ambiente: Homologação' }),
    ).toBeVisible()
  },
}

export const EnvironmentShowsABadgeWithTheTone: Story = {
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('Homologação')
    await expect(badge).toHaveAttribute('data-slot', 'badge')
  },
}

export const MenuMarksTheSelectedOption: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Organização/ }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Acme Logística' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemradio', { name: 'Nuvem Digital' }),
    ).toHaveAttribute('aria-checked', 'false')
    await closeMenu()
  },
}

const onOrgChange = fn()
const onProjectChange = fn()
const onEnvironmentChange = fn()

export const PickingAnOptionCallsItsCallbackWithTheId: Story = {
  render: () => (
    <Navbar2
      environmentId="staging"
      environments={environments}
      onEnvironmentChange={onEnvironmentChange}
      onOrgChange={onOrgChange}
      onProjectChange={onProjectChange}
      organizationId="acme"
      organizations={organizations}
      projectId="checkout"
      projects={projects}
    />
  ),
  play: async ({ canvasElement }) => {
    onOrgChange.mockClear()
    onProjectChange.mockClear()
    onEnvironmentChange.mockClear()
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: /Organização/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Nuvem Digital' }),
    )
    await expect(onOrgChange).toHaveBeenCalledWith('nuvem')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await userEvent.click(canvas.getByRole('button', { name: /Projeto/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Portal do cliente' }),
    )
    await expect(onProjectChange).toHaveBeenCalledWith('portal')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await userEvent.click(canvas.getByRole('button', { name: /Ambiente/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Produção' }),
    )
    await expect(onEnvironmentChange).toHaveBeenCalledWith('production')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const SelectionIsControlled: Story = {
  render: () => (
    <Navbar2
      environmentId="staging"
      environments={environments}
      onEnvironmentChange={() => {}}
      onOrgChange={() => {}}
      onProjectChange={() => {}}
      organizationId="acme"
      organizations={organizations}
      projectId="checkout"
      projects={projects}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Projeto/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Portal do cliente' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      canvas.getByRole('button', { name: 'Projeto: Checkout' }),
    ).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar2
      environmentId="staging"
      environments={environments}
      labels={{
        breadcrumb: 'Onde você está',
        organizationTrigger: (name) => `Trocar empresa, atual ${name}`,
      }}
      onEnvironmentChange={() => {}}
      onOrgChange={() => {}}
      onProjectChange={() => {}}
      organizationId="acme"
      organizations={organizations}
      projectId="checkout"
      projects={projects}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Onde você está' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', {
        name: 'Trocar empresa, atual Acme Logística',
      }),
    ).toBeVisible()
  },
}
