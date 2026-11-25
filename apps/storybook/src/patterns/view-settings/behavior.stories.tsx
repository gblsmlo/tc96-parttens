import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from '@tc96/ui/menu'
import {
  CollectionToolbar,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { viewSettingsControlArgs } from './view-settings-controls.ts'
import { spreadsheetModes, viewModes } from './view-settings-data.tsx'
import {
  ComposedViewSettings,
  StackedModeTabsLayout,
} from './view-settings-layouts.tsx'

const onClearFilters = fn()
const onModeChange = fn()
const onSavePreference = fn()

const meta = {
  args: { children: null },
  component: ViewSettingsMenu,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettings/Behavior',
} satisfies Meta<typeof ViewSettingsMenu>

export default meta

type Story = StoryObj<typeof meta>

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const expectMenuClosed = async () => {
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const openSettings = async (canvasElement: HTMLElement, name = 'Exibição') => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  return within(await screen.findByRole('menu'))
}

export const TriggerIsAGhostToolbarButton: Story = {
  render: () => (
    <CollectionToolbar
      right={<ComposedViewSettings {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Exibição',
    })
    await expect(trigger.closest('[role="toolbar"]')).not.toBeNull()
    await expect(trigger).toHaveClass('hover:bg-accent')
  },
}

export const NoTabsKeepTheMenuNarrow: Story = {
  render: () => (
    <CollectionToolbar
      right={<ComposedViewSettings {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await expect(menu.queryAllByRole('menuitemradio')).toHaveLength(0)
    await expect(await screen.findByRole('menu')).toHaveClass('w-56')
    await closeMenu()
  },
}

export const PickingATabCallsOnModeChangeAndCloses: Story = {
  render: () => (
    <CollectionToolbar
      right={
        <ViewSettingsMenu
          mode="kanban"
          modes={viewModes}
          onModeChange={onModeChange}
        >
          <ViewSettingsSection label="Exibição">
            <MenuItem>Densidade</MenuItem>
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    onModeChange.mockClear()
    const menu = await openSettings(canvasElement)
    await expect(
      menu.getByRole('menuitemradio', { name: 'Kanban' }),
    ).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(menu.getByRole('menuitemradio', { name: 'Lista' }))
    await expect(onModeChange).toHaveBeenCalledWith('list')
    await expectMenuClosed()
  },
}

export const SavePreferenceRendersOnlyWithItsHandler: Story = {
  render: () => (
    <CollectionToolbar
      right={
        <>
          <ViewSettingsMenu label="Sem salvar">
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettingsMenu>
          <ViewSettingsMenu
            label="Com salvar"
            onSavePreference={onSavePreference}
          >
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettingsMenu>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    onSavePreference.mockClear()
    let menu = await openSettings(canvasElement, 'Sem salvar')
    await expect(
      menu.queryByRole('menuitem', { name: 'Salvar preferência' }),
    ).toBeNull()
    await closeMenu()
    menu = await openSettings(canvasElement, 'Com salvar')
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(onSavePreference).toHaveBeenCalledTimes(1)
    await expectMenuClosed()
  },
}

export const ModeTabsComeBeforeTheSections: Story = {
  render: () => (
    <CollectionToolbar
      right={
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
  render: () => (
    <CollectionToolbar
      right={
        <ComposedViewSettings
          {...viewSettingsControlArgs}
          filters={false}
          modes={spreadsheetModes}
        />
      }
    />
  ),
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
  render: () => (
    <CollectionToolbar
      right={<StackedModeTabsLayout {...viewSettingsControlArgs} />}
    />
  ),
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
      right={
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
