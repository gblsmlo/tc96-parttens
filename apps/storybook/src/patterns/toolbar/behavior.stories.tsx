import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from '@tc96/ui/menu'
import {
  Action,
  CollectionToolbar,
  CollectionToolbarGroup,
  PresetsMenu,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { viewModes } from './toolbar-data.tsx'
import { FourModesToolbar, ThreeModesToolbar } from './toolbar-layouts.tsx'

const onClearFilters = fn()
const onAction = fn()

const meta = {
  component: CollectionToolbar,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Behavior',
} satisfies Meta<typeof CollectionToolbar>

export default meta

type Story = StoryObj<typeof CollectionToolbar>

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const expectMenuClosed = async () => {
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const toolbarOf = (canvasElement: HTMLElement, name = 'Controles da coleção') =>
  within(canvasElement).getByRole('toolbar', { name })

export const SlotsAndFreeCompositionStayOutOfTheDom: Story = {
  render: () => (
    <CollectionToolbar
      endSlot={<button type="button">Ações</button>}
      startSlot={<button type="button">Contexto</button>}
    >
      <span>Composição livre</span>
    </CollectionToolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).not.toHaveAttribute('startslot')
    await expect(toolbar).not.toHaveAttribute('endslot')
    await expect(canvas.getByText('Composição livre')).toBeVisible()
    await expect(
      canvas
        .getByRole('button', { name: 'Contexto' })
        .closest('[data-slot="toolbar-group"]'),
    ).not.toBeNull()
    await expect(
      canvas
        .getByRole('button', { name: 'Ações' })
        .closest('[data-slot="toolbar-group"]'),
    ).not.toBeNull()
  },
}

export const CenterSlotBetweenEqualWidthGroups: Story = {
  render: () => (
    <CollectionToolbar
      centerSlot={<button type="button">Período</button>}
      endSlot={<button type="button">Ações</button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).not.toHaveAttribute('centerslot')
    const [spacer, center, end] = Array.from(toolbar.children)
    await expect(spacer).toHaveAttribute('aria-hidden', 'true')
    await expect(spacer?.className).toBe('flex-1 basis-0')
    await expect(center).toHaveTextContent(/^Período$/)
    await expect(center).toHaveClass('shrink-0')
    await expect(end).toHaveClass('flex-1', 'basis-0', 'justify-end')
  },
}

export const CenterSlotSitsAtTheMidpoint: Story = {
  render: () => (
    <CollectionToolbar
      centerSlot={<button type="button">Período</button>}
      endSlot={<button type="button">Ações</button>}
      startSlot={
        <button className="w-60" type="button">
          Contexto
        </button>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    const center = within(canvasElement)
      .getByRole('button', { name: 'Período' })
      .closest('[data-slot="toolbar-group"]')
    if (!(center instanceof HTMLElement))
      throw new Error('The center slot did not render.')

    const toolbarRect = toolbar.getBoundingClientRect()
    const centerRect = center.getBoundingClientRect()
    await expect(
      Math.abs(
        centerRect.left +
          centerRect.width / 2 -
          (toolbarRect.left + toolbarRect.width / 2),
      ),
    ).toBeLessThan(1)
  },
}

export const PlainIsTheDefaultVariant: Story = {
  render: () => <CollectionToolbar />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-variant', 'plain')
    await expect(toolbar).toHaveClass('border-0', 'bg-transparent')
  },
}

export const DefaultVariantKeepsTheFrame: Story = {
  render: () => <CollectionToolbar variant="default" />,
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-variant', 'default')
    await expect(toolbar).not.toHaveClass('border-0')
    await expect(toolbar).not.toHaveClass('bg-transparent')
  },
}

export const TextVariantRendersHeadingAndDescription: Story = {
  render: () => (
    <CollectionToolbar
      aria-label="Controles das tarefas"
      description="Acompanhe e organize o trabalho da equipe."
      title="Tarefas"
      variant="text"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = toolbarOf(canvasElement, 'Controles das tarefas')
    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    await expect(toolbar).not.toHaveAttribute('title')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Tarefas' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Acompanhe e organize o trabalho da equipe.'),
    ).toBeVisible()
  },
}

export const TitleIsATooltipOutsideTheTextVariant: Story = {
  render: () => <CollectionToolbar title="Tarefas da equipe" />,
  play: async ({ canvasElement }) => {
    await expect(toolbarOf(canvasElement)).toHaveAttribute(
      'title',
      'Tarefas da equipe',
    )
    await expect(within(canvasElement).queryByRole('heading')).toBeNull()
  },
}

export const GroupGathersItsControls: Story = {
  render: () => (
    <CollectionToolbar>
      <CollectionToolbarGroup>
        <ToolbarButton>Hoje</ToolbarButton>
        <ToolbarButton>Esta semana</ToolbarButton>
      </CollectionToolbarGroup>
    </CollectionToolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group')
    await expect(group).toHaveAttribute('data-slot', 'toolbar-group')
    await expect(within(group).getAllByRole('button')).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { name: 'Hoje' }).closest('[role="group"]'),
    ).toBe(group)
  },
}

export const ArrowKeysMoveFocusBetweenToolbarItems: Story = {
  render: () => (
    <CollectionToolbar
      startSlot={
        <>
          <ToolbarButton>Primeiro</ToolbarButton>
          <ToolbarButton>Segundo</ToolbarButton>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: 'Primeiro' })
    const second = canvas.getByRole('button', { name: 'Segundo' })
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(second).toHaveFocus()
    await expect(first).toHaveAttribute('tabindex', '-1')
  },
}

export const ModeTabsComeBeforeTheSections: Story = {
  render: () => (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu
          mode="kanban"
          modes={viewModes}
          onClearFilters={() => undefined}
        >
          <ViewSettingsSection label="Exibição">
            <MenuItem>Densidade</MenuItem>
          </ViewSettingsSection>
          <ViewSettingsSection label="Filtros">
            <MenuItem>Status</MenuItem>
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    const [firstTab] = menu.getAllByRole('menuitemradio')
    await expect(
      firstTab?.closest('[data-slot="menu-radio-group"]')?.nextElementSibling,
    ).toHaveAttribute('data-slot', 'menu-group')
    for (const section of ['Exibição', 'Filtros']) {
      await expect(menu.getByText(section)).toBeVisible()
    }
    await closeMenu()
  },
}

export const ThreeModesKeepTheirLabelsWhole: Story = {
  render: () => <ThreeModesToolbar />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    const tabs = menu.getAllByRole('menuitemradio')
    await expect(tabs).toHaveLength(3)
    for (const tab of tabs) {
      await expect(tab).toHaveAttribute('data-layout', 'inline')
      const label = tab.querySelector('.truncate')
      if (!(label instanceof HTMLElement))
        throw new Error('The mode tab did not render its label.')
      await waitFor(() =>
        expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth),
      )
    }
    await closeMenu()
  },
}

export const FourModesStackTheTabs: Story = {
  render: () => <FourModesToolbar />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    const tabs = menu.getAllByRole('menuitemradio')
    await expect(tabs).toHaveLength(4)
    for (const tab of tabs) {
      await expect(tab).toHaveAttribute('data-layout', 'stacked')
    }
    await closeMenu()
  },
}

export const FilterCountAndClear: Story = {
  render: () => (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu activeFilterCount={2} onClearFilters={onClearFilters}>
          <ViewSettingsSection label="Filtros">
            <MenuItem>Status</MenuItem>
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    onClearFilters.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição (2)' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(onClearFilters).toHaveBeenCalledTimes(1)
    await expectMenuClosed()
  },
}

export const PresetsWithLabelCountAndMenu: Story = {
  render: () => (
    <CollectionToolbar
      startSlot={
        <PresetsMenu count={24} countLabel="24 tarefas" label="Minhas tarefas">
          <MenuItem>Todos os filtros</MenuItem>
        </PresetsMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const savedViews = canvas.getByRole('button', { name: /Minhas tarefas/ })
    await expect(canvas.getByText('24')).toBeVisible()
    await expect(canvas.getByLabelText('24 tarefas')).toBeInTheDocument()
    await expect(savedViews).toHaveClass('hover:bg-accent')

    await userEvent.click(savedViews)
    const savedView = await screen.findByRole('menuitem', {
      name: 'Todos os filtros',
    })
    await expect(savedView).toBeVisible()
    await userEvent.click(savedView)
    await expectMenuClosed()
  },
}

export const NeutralSettingsAndPrimaryActionWithoutIcon: Story = {
  render: () => (
    <CollectionToolbar
      endSlot={
        <>
          <ViewSettingsMenu onClearFilters={() => undefined}>
            <ViewSettingsSection label="Exibição">
              <MenuItem>Layout</MenuItem>
            </ViewSettingsSection>
          </ViewSettingsMenu>
          <Action label="Nova tarefa" onClick={onAction} />
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    onAction.mockClear()
    const canvas = within(canvasElement)
    const settings = canvas.getByRole('button', { name: 'Exibição' })
    await expect(settings).toHaveClass('hover:bg-accent')

    await userEvent.click(settings)
    await expect(await screen.findByRole('menu')).toHaveClass('w-56')
    await closeMenu()

    const action = canvas.getByRole('button', { name: 'Nova tarefa' })
    await expect(action.querySelector('svg')).toBeNull()
    await userEvent.click(action)
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}
