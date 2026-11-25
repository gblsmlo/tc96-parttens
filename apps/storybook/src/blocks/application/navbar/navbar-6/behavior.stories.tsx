import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar6 } from '@tc96/ui/blocks/application/navbar/navbar-6'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  breadcrumb,
  filterOptions,
  people,
  sortOptions,
} from '../fixtures/navbar-6.ts'
import {
  type Navbar6Controls,
  navbar6ControlArgs,
} from './navbar-6-controls.ts'
import { ComposedNavbar6, navbar6Handlers } from './navbar-6-layouts.tsx'

const meta = {
  args: navbar6ControlArgs,
  beforeEach: () => {
    for (const handler of Object.values(navbar6Handlers)) handler.mockClear()
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar6/Behavior',
} satisfies Meta<Navbar6Controls>

export default meta

type Story = StoryObj<typeof meta>

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const BreadcrumbEndsOnTheCurrentPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Caminho da página' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Projetos' }),
    ).toHaveAttribute('href', '/projetos')
    await expect(canvas.getByText('Quadro da equipe')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(
      canvas.queryByRole('link', { name: 'Quadro da equipe' }),
    ).toBeNull()
  },
}

export const HomeIconPrecedesTheFirstItem: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation')
    const icon = nav.querySelector('svg')
    const first = within(nav).getByRole('link', { name: 'Projetos' })
    if (!icon) throw new Error('home icon missing')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(
      icon.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
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
      canvas.getByRole('group', { name: 'Pessoas nesta página' }),
    ).toBeVisible()
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

export const InviteCallsOnInvite: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Convidar' }),
    )
    await expect(navbar6Handlers.onInvite).toHaveBeenCalledTimes(1)
  },
}

export const FilterMenuListsOptionsAsCheckboxes: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Filtrar' }),
    )
    await expect(await screen.findAllByRole('menuitemcheckbox')).toHaveLength(
      filterOptions.length,
    )
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'Em aberto' }),
    ).toHaveAttribute('aria-checked', 'false')
    await closeMenu()
  },
}

export const CheckingAFilterCallsOnFiltersChangeWithItsId: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Filtrar' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Em aberto' }),
    )
    await expect(navbar6Handlers.onFiltersChange).toHaveBeenCalledWith(['open'])
    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Atrasadas' }),
    )
    await expect(navbar6Handlers.onFiltersChange).toHaveBeenLastCalledWith([
      'open',
      'late',
    ])
    await closeMenu()
  },
}

export const UncheckingAFilterRemovesItsId: Story = {
  args: { activeFilters: 2 },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Filtrar' }),
    )
    const mine = await screen.findByRole('menuitemcheckbox', {
      name: 'Atribuídas a mim',
    })
    await expect(mine).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(mine)
    await expect(navbar6Handlers.onFiltersChange).toHaveBeenCalledWith(['open'])
    await closeMenu()
  },
}

export const FilterTriggerLooksActiveOnlyWithFilters: Story = {
  args: { activeFilters: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Filtrar' }),
    ).toHaveAttribute('data-active')
    await expect(
      canvas.getByRole('button', { name: 'Ordenar' }),
    ).not.toHaveAttribute('data-active')
  },
}

export const FilterTriggerIsIdleWithoutFilters: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Filtrar' }),
    ).not.toHaveAttribute('data-active')
  },
}

export const SortMenuMarksTheSelectedOption: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ordenar' }),
    )
    await expect(await screen.findAllByRole('menuitemradio')).toHaveLength(
      sortOptions.length,
    )
    await expect(
      screen.getByRole('menuitemradio', { name: 'Mais recentes' }),
    ).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemradio', { name: 'Prazo' }),
    ).toHaveAttribute('aria-checked', 'false')
    await closeMenu()
  },
}

export const ChoosingASortCallsOnSortChangeAndCloses: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ordenar' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Prazo' }),
    )
    await expect(navbar6Handlers.onSortChange).toHaveBeenCalledWith('deadline')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const MenusOpenFromTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Ordenar',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await expect(await screen.findByRole('menu')).toBeVisible()
    await waitFor(() =>
      expect(
        screen.getByRole('menuitemradio', { name: 'Mais recentes' }),
      ).toHaveFocus(),
    )
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() =>
      expect(navbar6Handlers.onSortChange).toHaveBeenCalledWith('name'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const OverflowMenuListsTheItems: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Mais opções' }),
    )
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(3)
    await expect(
      screen.getByRole('menuitem', { name: 'Excluir quadro' }),
    ).toBeVisible()
    await closeMenu()
  },
}

export const WithoutInviteNoButtonRenders: Story = {
  args: { showInvite: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Convidar' }),
    ).toBeNull()
  },
}

export const WithoutFilterDataNoFilterMenuRenders: Story = {
  args: { showFilter: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Filtrar' }),
    ).toBeNull()
  },
}

export const WithoutSortDataNoSortMenuRenders: Story = {
  args: { showSort: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Ordenar' }),
    ).toBeNull()
  },
}

export const WithoutMenuNoOverflowTriggerRenders: Story = {
  args: { showMenu: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Mais opções' }),
    ).toBeNull()
  },
}

export const WithoutPeopleNoAvatarGroupRenders: Story = {
  args: { peopleCount: 0 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('group', {
        name: 'Pessoas nesta página',
      }),
    ).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Navbar6
      breadcrumb={breadcrumb}
      filterOptions={filterOptions}
      filters={[]}
      labels={{
        filter: 'Refinar',
        invite: 'Chamar pessoas',
        overflow: (count) => `+${count} online`,
        sort: 'Classificar',
      }}
      maxPeople={1}
      onFiltersChange={() => undefined}
      onInvite={() => undefined}
      onSortChange={() => undefined}
      people={people}
      sort="recent"
      sortOptions={sortOptions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Chamar pessoas' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Refinar' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Classificar' }),
    ).toBeVisible()
    await expect(canvas.getByRole('img', { name: '+4 online' })).toBeVisible()
  },
}
