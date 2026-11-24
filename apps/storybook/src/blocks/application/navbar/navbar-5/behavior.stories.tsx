import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar5 } from '@tc96/blocks/application/navbar/navbar-5'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { actions, breadcrumb, people } from '../fixtures/navbar-5.ts'
import {
  type Navbar5Controls,
  navbar5ControlArgs,
} from './navbar-5-controls.ts'
import { ComposedNavbar5, navbar5Handlers } from './navbar-5-layouts.tsx'

const meta = {
  args: navbar5ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar5Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar5/Behavior',
} satisfies Meta<Navbar5Controls>

export default meta

type Story = StoryObj<typeof meta>

export const BreadcrumbEndsOnTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Projetos' }),
    ).toHaveAttribute('href', '/projetos')
    await expect(canvas.getByText('Página inicial')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      canvas.queryByRole('link', { name: 'Página inicial' }),
    ).toBeNull()
  },
}

export const HeaderIsABannerWithABorder: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('banner')
    await expect(header).toHaveClass('border-b', 'w-full')
  },
}

export const PeopleShowInitialsAndOverflow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: 'Ana Souza' }),
    ).toHaveTextContent('AS')
    await expect(canvas.getAllByRole('img')).toHaveLength(4)
    await expect(
      canvas.getByRole('img', { name: 'Mais 2 pessoas' }),
    ).toHaveTextContent('+2')
    await expect(canvas.queryByRole('img', { name: 'Diego Alves' })).toBeNull()
  },
}

export const NoOverflowWhenEveryoneFits: Story = {
  args: { maxPeople: 5 },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="navbar-overflow"]'),
    ).toBeNull()
    await expect(within(canvasElement).getAllByRole('img')).toHaveLength(5)
  },
}

export const DraftStatusShowsRascunho: Story = {
  args: { status: 'draft' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Rascunho')).toHaveAttribute(
      'data-status',
      'draft',
    )
  },
}

export const PublishedStatusShowsPublicado: Story = {
  args: { status: 'published' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Publicado')).toHaveAttribute(
      'data-status',
      'published',
    )
  },
}

export const ChangedStatusShowsUnpublishedChanges: Story = {
  args: { status: 'changed' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Alterações não publicadas'),
    ).toHaveAttribute('data-status', 'changed')
  },
}

export const PublishCallsOnPublish: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Publicar' }),
    )
    await expect(navbar5Handlers.onPublish).toHaveBeenCalledTimes(1)
  },
}

export const MenuActionCallsOnPublishActionWithItsId: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Mais opções de publicação',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Agendar publicação' }),
    )
    await expect(navbar5Handlers.onPublishAction).toHaveBeenCalledWith(
      'schedule',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MenuListsEveryAction: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Mais opções de publicação',
      }),
    )
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(
      actions.length,
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutActionsNoMenuRenders: Story = {
  args: { showActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Publicar' })).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Mais opções de publicação' }),
    ).toBeNull()
  },
}

export const WithoutOnPublishNoSplitRenders: Story = {
  args: { showPublish: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0)
  },
}

export const PendingDisablesPublish: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Publicar' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Mais opções de publicação' }),
    ).toBeDisabled()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar5
      actions={actions}
      breadcrumb={breadcrumb}
      labels={{
        overflow: (count) => `+${count} pessoas online`,
        publish: 'Colocar no ar',
        status: {
          changed: 'Alterações não publicadas',
          draft: 'Rascunho',
          published: 'No ar',
        },
      }}
      maxPeople={1}
      onPublish={() => undefined}
      onPublishAction={() => undefined}
      people={people}
      status="published"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Colocar no ar' }),
    ).toBeVisible()
    await expect(canvas.getByText('No ar')).toBeVisible()
    await expect(
      canvas.getByRole('img', { name: '+4 pessoas online' }),
    ).toBeVisible()
  },
}
