import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import { MenuItem } from '@tc96/ui/menu'
import type { ReactNode } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const onSearch = fn((_value: string) => {})
const onSelect = fn()
const onOption = fn()
const onCreate = fn()

const meta = {
  component: CollectionToolbar,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/View Switcher/Behavior',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

const menu = (children: ReactNode, label = 'Todas as pessoas') => (
  <CollectionToolbar
    startSlot={
      <ViewSwitcherMenu icon={<i data-testid="icon" />} label={label}>
        {children}
      </ViewSwitcherMenu>
    }
  />
)

const open = async (canvasElement: HTMLElement, name = 'Todas as pessoas') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  const dialog = await screen.findByRole('dialog', { name })
  await waitFor(() => expect(dialog).toBeVisible())
  return dialog
}

const expectClosed = async () => {
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() =>
    expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull(),
  )
}

export const OpensLabelledDialogNotMenu: Story = {
  render: () => menu(<span>Conteúdo</span>),
  play: async ({ canvasElement }) => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(within(canvasElement).getByTestId('icon')).toBeInTheDocument()
    const dialog = await open(canvasElement)
    await expect(dialog).toHaveTextContent('Conteúdo')
    await expect(screen.queryByRole('menu')).toBeNull()
  },
}

export const NoIconWrapperWithoutIcon: Story = {
  render: () => (
    <CollectionToolbar
      startSlot={
        <ViewSwitcherMenu label="Sem ícone">
          <span>Conteúdo</span>
        </ViewSwitcherMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Sem ícone',
    })
    await expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    await expect(trigger.querySelector('.shrink-0:not(svg)')).toBeNull()
  },
}

export const TruncatesLongLabel: Story = {
  render: () => menu(<span>Conteúdo</span>, 'Um nome muito longo de view'),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByRole('button', { name: 'Um nome muito longo de view' })
        .querySelector('.truncate'),
    ).not.toBeNull()
  },
}

export const SearchDefaultLabelAndPlaceholder: Story = {
  render: () => menu(<ViewSwitcherSearch onValueChange={onSearch} value="" />),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.getByRole('searchbox', { name: 'Buscar views' }),
    ).toHaveAttribute('placeholder', 'Buscar views...')
  },
}

export const SearchCustomLabelAndPlaceholder: Story = {
  render: () =>
    menu(
      <ViewSwitcherSearch
        label="Procurar"
        onValueChange={onSearch}
        placeholder="Procurar..."
        value=""
      />,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.getByRole('searchbox', { name: 'Procurar' }),
    ).toHaveAttribute('placeholder', 'Procurar...')
  },
}

export const SearchReportsTypedValue: Story = {
  render: () => menu(<ViewSwitcherSearch onValueChange={onSearch} value="" />),
  play: async ({ canvasElement }) => {
    onSearch.mockClear()
    const dialog = within(await open(canvasElement))
    await userEvent.click(dialog.getByRole('searchbox'))
    await userEvent.paste('retorno')
    await expect(onSearch).toHaveBeenCalledWith('retorno')
  },
}

export const ItemsGroupedAsViewsByDefault: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="A" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(dialog.getByRole('group', { name: 'Views' })).toBeVisible()
  },
}

export const ItemsCustomGroupLabel: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems label="Favoritos">
        <ViewSwitcherItem label="A" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(dialog.getByRole('group', { name: 'Favoritos' })).toBeVisible()
  },
}

export const MarksOnlySelectedItemAsCurrent: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="Recentes" onSelect={onSelect} selected />
        <ViewSwitcherItem label="Todas" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = await open(canvasElement)
    const popover = within(dialog)
    const current = popover.getByRole('button', { name: 'Recentes' })
    const other = popover.getByRole('button', { name: 'Todas' })
    await expect(current).toHaveAttribute('aria-current', 'true')
    await expect(other).not.toHaveAttribute('aria-current')
    await expect(
      current.closest('[data-slot="view-switcher-item"]'),
    ).toHaveAttribute('data-selected')
    await expect(
      other.closest('[data-slot="view-switcher-item"]'),
    ).not.toHaveAttribute('data-selected')
    await expect(dialog.querySelectorAll('[data-selected]')).toHaveLength(1)
  },
}

export const SelectingItemCallsOnSelectAndCloses: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    onSelect.mockClear()
    const dialog = within(await open(canvasElement))
    await userEvent.click(dialog.getByRole('button', { name: 'Todas' }))
    await expect(onSelect).toHaveBeenCalledTimes(1)
    await expectClosed()
  },
}

export const NoOptionsButtonWithoutOptions: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.queryByRole('button', { name: 'Opções de Todas' }),
    ).toBeNull()
  },
}

export const OptionsButtonNamedAfterView: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={onSelect}
          options={<MenuItem>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.getByRole('button', { name: 'Opções de Todas' }),
    ).toBeVisible()
  },
}

export const OptionsCustomLabel: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={onSelect}
          options={<MenuItem>Duplicar</MenuItem>}
          optionsLabel="Mais ações"
        />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.getByRole('button', { name: 'Mais ações' }),
    ).toBeVisible()
  },
}

export const OptionsOpenAsMenuNextToPopover: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={onSelect}
          options={<MenuItem>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await userEvent.click(
      dialog.getByRole('button', { name: 'Opções de Todas' }),
    )
    await expect(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    ).toBeVisible()
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
  },
}

export const UsingOptionRunsItAndCloses: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          label="Todas"
          onSelect={onSelect}
          options={<MenuItem onClick={onOption}>Duplicar</MenuItem>}
        />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    onOption.mockClear()
    const dialog = within(await open(canvasElement))
    await userEvent.click(
      dialog.getByRole('button', { name: 'Opções de Todas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(onOption).toHaveBeenCalledTimes(1)
    await expectClosed()
  },
}

export const CreateDefaultLabelCallsOnClickAndCloses: Story = {
  render: () => menu(<ViewSwitcherCreate onClick={onCreate} />),
  play: async ({ canvasElement }) => {
    onCreate.mockClear()
    const dialog = within(await open(canvasElement))
    await userEvent.click(
      dialog.getByRole('button', { name: 'Criar nova view' }),
    )
    await expect(onCreate).toHaveBeenCalledTimes(1)
    await expectClosed()
  },
}

export const CreateCustomLabel: Story = {
  render: () => menu(<ViewSwitcherCreate label="Nova" onClick={onCreate} />),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(dialog.getByRole('button', { name: 'Nova' })).toBeVisible()
  },
}
