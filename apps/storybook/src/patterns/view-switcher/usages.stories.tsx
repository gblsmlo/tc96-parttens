import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ViewSwitcherCanvas } from './view-switcher-canvas.tsx'
import { viewSwitcherControlArgs } from './view-switcher-controls.ts'
import {
  ComposedViewSwitcher,
  FavoritesAboveLayout,
} from './view-switcher-layouts.tsx'

const meta = {
  decorators: [ViewSwitcherCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSwitcher/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const ManagedViews: Story = {
  parameters: describe(
    'The saved views of a contact list, on the [Default](?path=/story/patterns-viewswitcher-layouts--default) layout: the popover searches the views, the selected one has its options menu (favorite, duplicate, delete) and Criar nova view adds one.',
  ),
  render: () => (
    <ComposedViewSwitcher {...viewSwitcherControlArgs} create options search />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Pessoas contatadas recentemente',
      }),
    ).toBeVisible()
  },
}

export const FavoriteViews: Story = {
  parameters: describe(
    'A contact list with two pinned views, on the [Favorites Above](?path=/story/patterns-viewswitcher-layouts--favorites-above) layout: the trigger is the `default` variant, and Favoritos holds Todas as pessoas and Aguardando retorno above the rest.',
  ),
  render: () => <FavoritesAboveLayout {...viewSwitcherControlArgs} options />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Todas as pessoas' }),
    ).toBeVisible()
  },
}

export const RegionalView: Story = {
  parameters: describe(
    'A view with a long name in a narrow column, on the [Default](?path=/story/patterns-viewswitcher-layouts--default) layout: the trigger truncates the name instead of growing past its column.',
  ),
  render: () => (
    <ComposedViewSwitcher
      {...viewSwitcherControlArgs}
      narrow
      views={[
        {
          id: 'regional',
          label:
            'Pessoas contatadas recentemente pela equipe comercial da região sul',
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Pessoas contatadas recentemente pela equipe comercial da região sul',
      }),
    ).toBeVisible()
  },
}

export const SavedViewsLoading: Story = {
  parameters: describe(
    'The saved views still loading, on the [Default](?path=/story/patterns-viewswitcher-layouts--default) layout: Todas as pessoas, the view the screen already knows, stays selectable above the skeleton rows.',
  ),
  render: () => (
    <ComposedViewSwitcher
      {...viewSwitcherControlArgs}
      initialSelectedId="all"
      loading
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todas as pessoas' }),
    )
    const dialog = await screen.findByRole('dialog', {
      name: 'Todas as pessoas',
    })
    await expect(
      within(dialog).getByRole('group', { name: 'Views' }),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}
