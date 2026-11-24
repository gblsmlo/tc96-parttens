import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar1 } from '@tc96/blocks/application/navbar/navbar-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { breadcrumbs, collaborators, tabs } from '../fixtures/navbar-1.ts'
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

export const TabFollowsTheTabProp: Story = {
  args: { tab: 'files' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('tab', { name: 'Arquivos' }),
    ).toHaveAttribute('aria-selected', 'true')
  },
}

const onTabChange = fn()

export const ClickingATabCallsOnTabChange: Story = {
  render: () => (
    <Navbar1
      breadcrumbs={breadcrumbs}
      onTabChange={onTabChange}
      tab="overview"
      tabs={tabs}
    />
  ),
  play: async ({ canvasElement }) => {
    onTabChange.mockClear()
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Tarefas' }))
    await expect(onTabChange).toHaveBeenCalledWith('tasks')
    await expect(
      canvas.getByRole('tab', { name: 'Visão geral' }),
    ).toHaveAttribute('aria-selected', 'true')
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
      onTabChange={() => {}}
      tab="overview"
      tabs={tabs}
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
        share: 'Convidar',
        tabs: 'Abas',
      }}
      onShare={() => {}}
      onTabChange={() => {}}
      tab="overview"
      tabs={tabs}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Trilha' }),
    ).toBeVisible()
    await expect(canvas.getByRole('tablist', { name: 'Abas' })).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Equipe de 6' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Convidar' })).toBeVisible()
  },
}
