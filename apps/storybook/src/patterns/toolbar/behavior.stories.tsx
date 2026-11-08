import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  CollectionToolbar,
  PresetsMenu,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { MenuItem } from '@tc96/ui/menu'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const onClearFilters = fn()
const onAction = fn()

const meta = {
  component: CollectionToolbar,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Behavior',
} satisfies Meta<typeof CollectionToolbar>

export default meta

const expectMenuClosed = async () => {
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  await waitFor(() =>
    expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull(),
  )
}

type Story = StoryObj<typeof CollectionToolbar>

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles da coleção' })

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
    await expect(center).toHaveTextContent(/^Período$/)
    const toolbarBox = toolbar.getBoundingClientRect()
    const centerBox = (center as HTMLElement).getBoundingClientRect()
    await expect(
      (spacer as HTMLElement).getBoundingClientRect().width,
    ).toBeCloseTo((end as HTMLElement).getBoundingClientRect().width, 0)
    await expect(centerBox.left + centerBox.width / 2).toBeCloseTo(
      toolbarBox.left + toolbarBox.width / 2,
      0,
    )
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

    await userEvent.click(settings)
    await expect(await screen.findByRole('menu')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expectMenuClosed()

    const action = canvas.getByRole('button', { name: 'Nova tarefa' })
    await expect(action.querySelector('svg')).toBeNull()
    await userEvent.click(action)
    await expect(onAction).toHaveBeenCalledTimes(1)
  },
}
