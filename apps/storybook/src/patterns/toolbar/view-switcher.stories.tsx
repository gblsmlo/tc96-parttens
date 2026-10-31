import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { Separator } from '@tc96/ui/separator'
import {
  CopyPlusIcon,
  LayoutGridIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { collectionToolbarArgTypes } from '../../test-utils/story-arg-types'

interface SavedView {
  id: string
  label: string
}

const views: SavedView[] = [
  { id: 'recent', label: 'Pessoas contatadas recentemente' },
  { id: 'all', label: 'Todas as pessoas' },
  { id: 'overdue', label: 'Aguardando retorno' },
]

const viewIcon = (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <LayoutGridIcon aria-hidden="true" className="size-3" />
  </span>
)

const meta = {
  args: {
    'aria-label': 'Controles da coleção',
    variant: 'plain',
  },
  argTypes: collectionToolbarArgTypes,
  component: CollectionToolbar,
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl p-2">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  subcomponents: {
    ViewSwitcherCreate,
    ViewSwitcherItem,
    ViewSwitcherItems,
    ViewSwitcherMenu,
    ViewSwitcherSearch,
  },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/View Switcher',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A view selecionada no slot esquerdo da toolbar, a mesma composição do `Default` de `Patterns/Toolbar`. O popover reúne busca, as views (as favoritas num grupo próprio no início), as opções da view ativa e a criação de uma nova view.',
      },
    },
  },
  render: function Default(args) {
    const [savedViews, setSavedViews] = useState(views)
    const [selectedId, setSelectedId] = useState('recent')
    const [favoriteIds, setFavoriteIds] = useState<string[]>([])
    const [query, setQuery] = useState('')

    const selected = savedViews.find((view) => view.id === selectedId)
    const visibleViews = savedViews.filter((view) =>
      view.label
        .toLocaleLowerCase('pt-BR')
        .includes(query.toLocaleLowerCase('pt-BR')),
    )
    const favoriteViews = visibleViews.filter((view) =>
      favoriteIds.includes(view.id),
    )
    const otherViews = visibleViews.filter(
      (view) => !favoriteIds.includes(view.id),
    )

    const addView = (label: string) => {
      const id = crypto.randomUUID()
      setSavedViews((current) => [...current, { id, label }])
      setSelectedId(id)
    }

    const deleteView = (id: string) => {
      const remaining = savedViews.filter((view) => view.id !== id)
      setSavedViews(remaining)
      setFavoriteIds((current) => current.filter((item) => item !== id))
      setSelectedId(remaining[0]?.id ?? '')
    }

    const renderView = (view: SavedView) => {
      const favorite = favoriteIds.includes(view.id)

      return (
        <ViewSwitcherItem
          icon={viewIcon}
          key={view.id}
          label={view.label}
          onSelect={() => setSelectedId(view.id)}
          options={
            view.id === selectedId ? (
              <>
                <MenuItem
                  className="whitespace-nowrap"
                  onClick={() =>
                    setFavoriteIds((current) =>
                      favorite
                        ? current.filter((item) => item !== view.id)
                        : [...current, view.id],
                    )
                  }
                >
                  <StarIcon
                    aria-hidden="true"
                    fill={favorite ? 'currentColor' : 'none'}
                  />
                  {favorite
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'}
                </MenuItem>
                <MenuItem onClick={() => addView(`${view.label} (cópia)`)}>
                  <CopyPlusIcon aria-hidden="true" />
                  Duplicar
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  disabled={savedViews.length === 1}
                  onClick={() => deleteView(view.id)}
                  variant="destructive"
                >
                  <Trash2Icon aria-hidden="true" />
                  Excluir
                </MenuItem>
                <div className="mt-1 border-t px-2 pt-2 pb-1 text-muted-foreground text-xs">
                  Criado pela equipe · 30 set 2026
                </div>
              </>
            ) : undefined
          }
          selected={view.id === selectedId}
        />
      )
    }

    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <ViewSwitcherMenu
            icon={viewIcon}
            label={selected?.label ?? 'Selecionar view'}
          >
            <ViewSwitcherSearch onValueChange={setQuery} value={query} />
            {favoriteViews.length ? (
              <ViewSwitcherItems label="Favoritos">
                <p
                  aria-hidden="true"
                  className="px-2 py-1 font-medium text-muted-foreground text-xs"
                >
                  Favoritos
                </p>
                {favoriteViews.map(renderView)}
              </ViewSwitcherItems>
            ) : null}
            {favoriteViews.length && otherViews.length ? <Separator /> : null}
            {otherViews.length ? (
              <ViewSwitcherItems>
                {otherViews.map(renderView)}
              </ViewSwitcherItems>
            ) : null}
            {visibleViews.length ? null : (
              <p className="px-2 py-1.5 text-muted-foreground text-sm">
                Nenhuma view encontrada
              </p>
            )}
            <Separator />
            <ViewSwitcherCreate onClick={() => addView('Nova view')} />
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

const openViewSwitcher = async (canvasElement: HTMLElement, label: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: label }),
  )
  return within(await screen.findByRole('dialog', { name: label }))
}

export const ViewSwitcherInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await waitFor(() =>
      expect(
        popover.getByRole('searchbox', { name: 'Buscar views' }),
      ).toBeVisible(),
    )
    await expect(
      popover.getByRole('button', { name: 'Pessoas contatadas recentemente' }),
    ).toHaveAttribute('aria-current', 'true')
    await expect(
      popover.getByRole('button', { name: 'Criar nova view' }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const SearchViewsInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await userEvent.type(
      popover.getByRole('searchbox', { name: 'Buscar views' }),
      'retorno',
    )
    await waitFor(() =>
      expect(
        popover.getByRole('button', { name: 'Aguardando retorno' }),
      ).toBeVisible(),
    )
    await waitFor(() =>
      expect(popover.queryByRole('button', { name: 'Todas as pessoas' })).toBe(
        null,
      ),
    )
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Pessoas contatadas recentemente',
      }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const ViewOptionsInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await openViewSwitcher(canvasElement, 'Pessoas contatadas recentemente')
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Opções de Pessoas contatadas recentemente',
      }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    ).toBeVisible()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(
      await within(canvasElement).findByRole('button', {
        name: 'Pessoas contatadas recentemente (cópia)',
      }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const FavoritesInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const picker = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await userEvent.click(
      picker.getByRole('button', { name: 'Aguardando retorno' }),
    )
    await openViewSwitcher(canvasElement, 'Aguardando retorno')
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Opções de Aguardando retorno',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Adicionar aos favoritos' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Aguardando retorno' }),
    )

    const popover = within(
      await screen.findByRole('dialog', { name: 'Aguardando retorno' }),
    )
    await waitFor(() => expect(popover.getByText('Favoritos')).toBeVisible())
    const viewLabels = popover
      .getAllByRole('button')
      .map((item) => item.textContent)
      .filter((label) => views.some((view) => view.label === label))
    await expect(viewLabels).toEqual([
      'Aguardando retorno',
      'Pessoas contatadas recentemente',
      'Todas as pessoas',
    ])
    await expect(popover.getAllByRole('separator')).toHaveLength(2)
  },
  tags: interaction,
}

export const CreateViewInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await userEvent.click(
      popover.getByRole('button', { name: 'Criar nova view' }),
    )
    await expect(
      await within(canvasElement).findByRole('button', { name: 'Nova view' }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const Items: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A lista pode ser composta sozinha, com um item ativo e alternativas, sem busca, opções nem criação.',
      },
    },
  },
  render: function Items(args) {
    const [selectedId, setSelectedId] = useState('recent')
    const selected = views.find((view) => view.id === selectedId)

    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <ViewSwitcherMenu
            icon={viewIcon}
            label={selected?.label ?? 'Selecionar view'}
          >
            <ViewSwitcherItems>
              {views.map((view) => (
                <ViewSwitcherItem
                  icon={viewIcon}
                  key={view.id}
                  label={view.label}
                  onSelect={() => setSelectedId(view.id)}
                  selected={view.id === selectedId}
                />
              ))}
            </ViewSwitcherItems>
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const ItemsInteraction: Story = {
  ...Items,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await expect(popover.queryByRole('searchbox')).toBe(null)
    await expect(
      popover.queryByRole('button', { name: 'Criar nova view' }),
    ).toBe(null)
    await expect(
      popover.queryByRole('button', {
        name: 'Opções de Pessoas contatadas recentemente',
      }),
    ).toBe(null)
    await userEvent.click(
      popover.getByRole('button', { name: 'Todas as pessoas' }),
    )
    await expect(
      canvas.getByRole('button', { name: 'Todas as pessoas' }),
    ).toBeVisible()
  },
  tags: interaction,
}

export const Favorites: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'As views favoritas abrem o popover num grupo próprio, antes das demais, separado por um `Separator`.',
      },
    },
  },
  render: function Favorites(args) {
    const [selectedId, setSelectedId] = useState('overdue')
    const selected = views.find((view) => view.id === selectedId)
    const favoriteViews = views.filter((view) => view.id !== 'recent')
    const otherViews = views.filter((view) => view.id === 'recent')

    const renderView = (view: SavedView) => (
      <ViewSwitcherItem
        icon={viewIcon}
        key={view.id}
        label={view.label}
        onSelect={() => setSelectedId(view.id)}
        selected={view.id === selectedId}
      />
    )

    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <ViewSwitcherMenu
            icon={viewIcon}
            label={selected?.label ?? 'Selecionar view'}
          >
            <ViewSwitcherItems label="Favoritos">
              <p
                aria-hidden="true"
                className="px-2 py-1 font-medium text-muted-foreground text-xs"
              >
                Favoritos
              </p>
              {favoriteViews.map(renderView)}
            </ViewSwitcherItems>
            <Separator />
            <ViewSwitcherItems>{otherViews.map(renderView)}</ViewSwitcherItems>
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const FavoritesGroupInteraction: Story = {
  ...Favorites,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(canvasElement, 'Aguardando retorno')
    const groups = popover.getAllByRole('group')
    await expect(
      groups.map((group) => group.getAttribute('aria-label')),
    ).toEqual(['Favoritos', 'Views'])
    await expect(
      within(groups[0] as HTMLElement)
        .getAllByRole('button')
        .map((item) => item.textContent),
    ).toEqual(['Todas as pessoas', 'Aguardando retorno'])
    await expect(popover.getAllByRole('separator')).toHaveLength(1)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
  },
  tags: interaction,
}

export const LongLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Um nome longo é truncado no gatilho e na lista; o nome acessível continua inteiro.',
      },
    },
  },
  render: function LongLabel(args) {
    const label =
      'Pessoas contatadas recentemente pela equipe comercial da região sul'
    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <div className="w-48 min-w-0">
            <ViewSwitcherMenu icon={viewIcon} label={label}>
              <ViewSwitcherItems>
                <ViewSwitcherItem
                  icon={viewIcon}
                  label={label}
                  onSelect={() => undefined}
                  selected
                />
              </ViewSwitcherItems>
            </ViewSwitcherMenu>
          </div>
        }
      />
    )
  },
}

export const LongLabelInteraction: Story = {
  ...LongLabel,
  play: async ({ canvasElement }) => {
    const label =
      'Pessoas contatadas recentemente pela equipe comercial da região sul'
    const popover = await openViewSwitcher(canvasElement, label)
    const trigger = within(canvasElement).getByRole('button', { name: label })
    await expect(trigger.querySelector('.truncate')).not.toBeNull()
    await expect(
      popover.getByRole('button', { name: label }).querySelector('.truncate'),
    ).not.toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
  },
  tags: interaction,
}

export const WithoutIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'O ícone é opcional no gatilho e em cada item.',
      },
    },
  },
  render: function WithoutIcons(args) {
    const [selectedId, setSelectedId] = useState('recent')
    const selected = views.find((view) => view.id === selectedId)

    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <ViewSwitcherMenu label={selected?.label ?? 'Selecionar view'}>
            <ViewSwitcherItems>
              {views.map((view) => (
                <ViewSwitcherItem
                  key={view.id}
                  label={view.label}
                  onSelect={() => setSelectedId(view.id)}
                  selected={view.id === selectedId}
                />
              ))}
            </ViewSwitcherItems>
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const WithoutIconsInteraction: Story = {
  ...WithoutIcons,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Pessoas contatadas recentemente',
    })
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(
      popover
        .getByRole('button', { name: 'Todas as pessoas' })
        .querySelectorAll('svg'),
    ).toHaveLength(0)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
  },
  tags: interaction,
}

export const SingleView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Com uma única view, `Excluir` fica desabilitado: a coleção nunca fica sem view ativa.',
      },
    },
  },
  render: function SingleView(args) {
    return (
      <CollectionToolbar
        {...args}
        startSlot={
          <ViewSwitcherMenu icon={viewIcon} label={views[0]?.label ?? ''}>
            <ViewSwitcherItems>
              <ViewSwitcherItem
                icon={viewIcon}
                label={views[0]?.label ?? ''}
                onSelect={() => undefined}
                options={
                  <MenuItem disabled variant="destructive">
                    <Trash2Icon aria-hidden="true" />
                    Excluir
                  </MenuItem>
                }
                selected
              />
            </ViewSwitcherItems>
          </ViewSwitcherMenu>
        }
      />
    )
  },
}

export const SingleViewInteraction: Story = {
  ...SingleView,
  play: async ({ canvasElement }) => {
    await openViewSwitcher(canvasElement, 'Pessoas contatadas recentemente')
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Opções de Pessoas contatadas recentemente',
      }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
  tags: interaction,
}

export const EmptySearchInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const popover = await openViewSwitcher(
      canvasElement,
      'Pessoas contatadas recentemente',
    )
    await userEvent.type(
      popover.getByRole('searchbox', { name: 'Buscar views' }),
      'zzz',
    )
    await waitFor(() =>
      expect(popover.getByText('Nenhuma view encontrada')).toBeVisible(),
    )
    await expect(
      popover.queryAllByRole('button', { name: /pessoas|retorno/i }),
    ).toHaveLength(0)
    await expect(
      popover.getByRole('button', { name: 'Criar nova view' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBe(null))
  },
  tags: interaction,
}
