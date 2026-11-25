import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import { MenuItem } from '@tc96/ui/menu'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { breadcrumbs, collaborators } from '../fixtures/navbar-1.ts'
import {
  type Navbar1Controls,
  navbar1ControlArgs,
} from './navbar-1-controls.ts'
import { ComposedNavbar1 } from './navbar-1-layouts.tsx'

const meta = {
  args: navbar1ControlArgs,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar1/Behavior',
} satisfies Meta<Navbar1Controls>

export default meta

type Story = StoryObj<typeof meta>

export const BreadcrumbLinksAllButTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Caminho da página' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Projetos' }),
    ).toHaveAttribute('href', '/projetos')
    await expect(
      canvas.getByText('Visão geral', { selector: '[aria-current]' }),
    ).toBeVisible()
  },
}

export const FirstFourCollaboratorsShowAndTheRestBecomeACount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: '6 colaboradores' }),
    ).toBeVisible()
    await expect(canvas.getByText('+2')).toBeVisible()
  },
}

export const NoCollaboratorsRendersNoGroup: Story = {
  args: { collaboratorCount: 0 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('group')).toBeNull()
  },
}

const onShare = fn()

export const ShareCallsOnShare: Story = {
  render: () => (
    <Navbar1
      breadcrumbs={breadcrumbs}
      collaborators={collaborators}
      onShare={onShare}
    />
  ),
  play: async ({ canvasElement }) => {
    onShare.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Compartilhar' }),
    )
    await expect(onShare).toHaveBeenCalledTimes(1)
  },
}

export const MenuOpensTheGlobalActions: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Mais ações' }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Duplicar projeto' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
  },
}

export const WithoutMenuNoMoreActionsButtonRenders: Story = {
  args: { menu: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Mais ações' }),
    ).toBeNull()
  },
}

export const ShareIsThePrimaryButton: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Compartilhar' }),
    ).toHaveClass('bg-primary', 'text-primary-foreground')
  },
}

export const WithoutOnShareNoButtonRenders: Story = {
  args: { shareable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Compartilhar' }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar1
      breadcrumbs={breadcrumbs}
      collaborators={collaborators}
      labels={{
        breadcrumb: 'Trilha',
        collaborators: (count) => `Equipe de ${count}`,
        menu: 'Outras ações',
        share: 'Convidar',
      }}
      menu={<MenuItem>Duplicar</MenuItem>}
      onShare={() => {}}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Trilha' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Equipe de 6' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Convidar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Outras ações' }),
    ).toBeVisible()
  },
}
