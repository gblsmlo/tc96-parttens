import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  ViewSwitcherCreate,
  ViewSwitcherItem,
  ViewSwitcherItems,
  ViewSwitcherMenu,
  ViewSwitcherSearch,
} from '@tc96/parttens'
import type { ButtonProps } from '@tc96/ui/button'
import { MenuItem } from '@tc96/ui/menu'
import type { ReactNode } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const onSearch = fn((_value: string) => {})
const onSelect = fn()
const onOption = fn()
const onCreate = fn()

const longLabel =
  'Pessoas contatadas recentemente pela equipe comercial da região sul'

const meta = {
  component: CollectionToolbar,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Behavior',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

const menu = (
  children: ReactNode,
  label = 'Todas as pessoas',
  variant?: ButtonProps['variant'],
) => (
  <CollectionToolbar
    startSlot={
      <ViewSwitcherMenu
        icon={<i data-testid="icon" />}
        label={label}
        variant={variant}
      >
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
}

const closeDialog = async () => {
  await userEvent.keyboard('{Escape}')
  await expectClosed()
}

export const OpensLabelledDialogNotMenu: Story = {
  render: () => menu(<span>Conteúdo</span>),
  play: async ({ canvasElement }) => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(within(canvasElement).getByTestId('icon')).toBeInTheDocument()
    const dialog = await open(canvasElement)
    await expect(dialog).toHaveTextContent('Conteúdo')
    await expect(screen.queryByRole('menu')).toBeNull()
    await closeDialog()
  },
}

export const KeyboardOpensTheDialogAndEscapeClosesIt: Story = {
  render: () => menu(<span>Conteúdo</span>),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Todas as pessoas',
    })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    const dialog = await screen.findByRole('dialog', {
      name: 'Todas as pessoas',
    })
    await waitFor(() => expect(dialog).toBeVisible())

    await closeDialog()
    await waitFor(() => expect(trigger).toHaveFocus())
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

export const TriggerIsGhostByDefault: Story = {
  render: () => menu(<span>Conteúdo</span>),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Todas as pessoas',
    })
    await expect(trigger).toHaveClass('hover:bg-accent')
    await expect(trigger).not.toHaveClass('bg-secondary')
  },
}

export const SecondaryVariantFillsTheTrigger: Story = {
  render: () => menu(<span>Conteúdo</span>, 'Todas as pessoas', 'secondary'),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Todas as pessoas',
    })
    await expect(trigger).toHaveClass(
      'bg-secondary',
      'text-secondary-foreground',
    )
    await expect(trigger).not.toHaveClass('hover:bg-accent')
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

export const TruncatesLongItemLabel: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem label={longLabel} onSelect={onSelect} selected />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog
        .getByRole('button', { name: longLabel })
        .querySelector('.truncate'),
    ).not.toBeNull()
    await closeDialog()
  },
}

export const SearchDefaultLabelAndPlaceholder: Story = {
  render: () => menu(<ViewSwitcherSearch onValueChange={onSearch} value="" />),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    await expect(
      dialog.getByRole('searchbox', { name: 'Buscar views' }),
    ).toHaveAttribute('placeholder', 'Buscar views...')
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
  },
}

export const ItemIconIsOptional: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems>
        <ViewSwitcherItem
          icon={<i data-testid="item-icon" />}
          label="Com ícone"
          onSelect={onSelect}
        />
        <ViewSwitcherItem label="Sem ícone" onSelect={onSelect} />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    const withIcon = dialog.getByRole('button', { name: 'Com ícone' })
    const withoutIcon = dialog.getByRole('button', { name: 'Sem ícone' })
    await expect(within(withIcon).getByTestId('item-icon')).toBeInTheDocument()
    await expect(withIcon.querySelector('.shrink-0')).not.toBeNull()
    await expect(withoutIcon.querySelector('.shrink-0')).toBeNull()
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
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
    await closeDialog()
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

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await closeDialog()
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
    await closeDialog()
  },
}

export const LoadingMarksTheListBusyWithSkeletonRows: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems loading>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} selected />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    const items = dialog.getByRole('group', { name: 'Views' })
    await expect(items).toHaveAttribute('aria-busy', 'true')
    const skeletonRows = items.querySelectorAll(':scope > [aria-hidden="true"]')
    await expect(skeletonRows).toHaveLength(3)
    for (const row of skeletonRows) {
      await expect(row.querySelector('[data-slot="skeleton"]')).not.toBeNull()
    }
    await closeDialog()
  },
}

export const LoadingItemCountSetsTheRows: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems loading loadingItemCount={5}>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} selected />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    const dialog = within(await open(canvasElement))
    const items = dialog.getByRole('group', { name: 'Views' })
    await expect(
      items.querySelectorAll(':scope > [aria-hidden="true"]'),
    ).toHaveLength(5)
    await closeDialog()
  },
}

export const LoadingKeepsTheKnownViewSelectable: Story = {
  render: () =>
    menu(
      <ViewSwitcherItems loading>
        <ViewSwitcherItem label="Todas" onSelect={onSelect} selected />
      </ViewSwitcherItems>,
    ),
  play: async ({ canvasElement }) => {
    onSelect.mockClear()
    const dialog = within(await open(canvasElement))
    const items = within(dialog.getByRole('group', { name: 'Views' }))
    const known = items.getByRole('button', { name: 'Todas' })
    await expect(items.getAllByRole('button')).toEqual([known])
    await expect(known).toHaveAttribute('aria-current', 'true')

    await userEvent.click(known)
    await expect(onSelect).toHaveBeenCalledTimes(1)
    await expectClosed()
  },
}
