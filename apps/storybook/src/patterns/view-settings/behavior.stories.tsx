import type { Meta, StoryObj } from '@storybook/react-vite'
import { MenuItem } from '@tc96/ui/menu'
import {
  CollectionToolbar,
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { viewSettingsControlArgs } from './view-settings-controls.ts'
import { spreadsheetModes, viewModes } from './view-settings-data.tsx'
import {
  ComposedViewSettings,
  FieldSettingsLayout,
  PropertySubmenusLayout,
  StackedModeTabsLayout,
} from './view-settings-layouts.tsx'

const onClearFilters = fn()
const onModeChange = fn()
const onReset = fn()
const onSavePreference = fn()

const meta = {
  args: { children: null },
  component: ViewSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettings/Behavior',
} satisfies Meta<typeof ViewSettings>

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

export const NoTabsUseTheBaseWidth: Story = {
  render: () => (
    <CollectionToolbar
      right={<ComposedViewSettings {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await expect(menu.queryAllByRole('menuitemradio')).toHaveLength(0)
    await expect(await screen.findByRole('menu')).toHaveClass('w-80')
    await closeMenu()
  },
}

export const PickingATabCallsOnModeChangeAndCloses: Story = {
  render: () => (
    <CollectionToolbar
      right={
        <ViewSettings
          mode="kanban"
          modes={viewModes}
          onModeChange={onModeChange}
        >
          <ViewSettingsSection label="Exibição">
            <MenuItem>Densidade</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
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
          <ViewSettings label="Sem salvar">
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettings>
          <ViewSettings label="Com salvar" onSavePreference={onSavePreference}>
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettings>
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
        <ViewSettings
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
        </ViewSettings>
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

export const ClearFiltersKeepsTheMenuOpen: Story = {
  render: () => (
    <CollectionToolbar
      right={
        <ViewSettings activeFilterCount={2} onClearFilters={onClearFilters}>
          <ViewSettingsSection label="Filtros">
            <MenuItem>Status</MenuItem>
          </ViewSettingsSection>
        </ViewSettings>
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
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenu()
  },
}

const fieldSettings = () => (
  <CollectionToolbar
    right={<FieldSettingsLayout {...viewSettingsControlArgs} />}
  />
)

const fieldGroup = (name: string) =>
  screen.getByRole('group', { name: new RegExp(`^${name} \\d+$`) })

export const SubmenuTriggerShowsTheCurrentValue: Story = {
  render: fieldSettings,
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    const trigger = menu.getByRole('menuitem', { name: /Agrupar por/ })
    await expect(trigger).toHaveTextContent('Agrupar porVisibilidade')
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Tipo' }),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: /Agrupar por/ }),
      ).toHaveTextContent('Agrupar porTipo'),
    )
    await userEvent.keyboard('{Escape}')
    await closeMenu()
  },
}

export const FieldSwitchKeepsTheMenuOpenAndMovesTheField: Story = {
  render: fieldSettings,
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    const visible = fieldGroup('Visíveis')
    await expect(visible).toHaveAccessibleName('Visíveis 4')
    await userEvent.click(
      within(visible).getByRole('menuitemcheckbox', { name: /Status/ }),
    )
    await expect(
      menu.getByRole('menuitemcheckbox', { name: /Status/ }),
    ).toBeVisible()
    await expect(fieldGroup('Visíveis')).toHaveAccessibleName('Visíveis 3')
    await expect(
      within(fieldGroup('Ocultos')).getByRole('menuitemcheckbox', {
        name: /Status/,
      }),
    ).toHaveAttribute('aria-checked', 'false')
    await closeMenu()
  },
}

export const ShowAllFieldsEmptiesTheHiddenSection: Story = {
  render: fieldSettings,
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    const showAll = menu.getByRole('menuitem', {
      name: 'Mostrar todos os campos',
    })
    await userEvent.click(showAll)
    await expect(screen.getByRole('menu')).toBeVisible()
    await expect(screen.queryByRole('group', { name: /^Ocultos/ })).toBeNull()
    await expect(showAll).toHaveAttribute('aria-disabled', 'true')
    await closeMenu()
  },
}

export const AllIsCheckedUntilAFilterValueIsPicked: Story = {
  render: () => (
    <CollectionToolbar
      right={<ComposedViewSettings {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Status' }))
    const all = await screen.findByRole('menuitemcheckbox', { name: 'Todos' })
    await expect(all).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'A fazer' }),
    )
    await expect(all).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(all)
    await expect(all).toHaveAttribute('aria-checked', 'true')
    await expect(
      screen.getByRole('menuitemcheckbox', { name: 'A fazer' }),
    ).toHaveAttribute('aria-checked', 'false')
    await userEvent.keyboard('{Escape}')
    await closeMenu()
  },
}

export const SubmenuTriggerFollowsTheCurrentOption: Story = {
  render: () => (
    <CollectionToolbar
      right={<PropertySubmenusLayout {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    await expect(
      menu.getByRole('menuitem', { name: /Início/ }),
    ).toHaveTextContent(/^Início$/)
    const status = menu.getByRole('menuitem', { name: /Status/ })
    await expect(status).toHaveTextContent('StatusA fazer')
    await userEvent.click(status)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Em andamento' }),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: /Status/ }),
      ).toHaveTextContent('StatusEm andamento'),
    )
    await expect(
      screen
        .getByRole('menuitem', { name: /Status/ })
        .querySelector('[data-slot="property-meta-icon"][data-tone="purple"]'),
    ).not.toBeNull()
    await userEvent.keyboard('{Escape}')
    await closeMenu()
  },
}

export const ResetComesBeforeSaveAndKeepsTheMenuOpen: Story = {
  render: () => (
    <CollectionToolbar
      right={<PropertySubmenusLayout {...viewSettingsControlArgs} />}
    />
  ),
  play: async ({ canvasElement }) => {
    const menu = await openSettings(canvasElement)
    const footer = menu
      .getAllByRole('menuitem')
      .map((item) => item.textContent)
      .slice(-2)
    await expect(footer).toEqual(['Redefinir', 'Salvar preferência'])
    const reset = menu.getByRole('menuitem', { name: 'Redefinir' })
    await expect(reset).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(menu.getByRole('menuitem', { name: /Densidade/ }))
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Compacta' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: 'Redefinir' }),
      ).not.toHaveAttribute('aria-disabled', 'true'),
    )
    await userEvent.click(screen.getByRole('menuitem', { name: 'Redefinir' }))
    await expect(screen.getByRole('menu')).toBeVisible()
    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: /Densidade/ }),
      ).toHaveTextContent('DensidadeConfortável'),
    )
    await expect(
      screen.getByRole('menuitem', { name: 'Redefinir' }),
    ).toHaveAttribute('aria-disabled', 'true')
    await closeMenu()
  },
}

export const ResetRendersOnlyWithItsHandler: Story = {
  render: () => (
    <CollectionToolbar
      right={
        <>
          <ViewSettings label="Sem redefinir">
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettings>
          <ViewSettings label="Com redefinir" onReset={onReset}>
            <ViewSettingsSection label="Exibição">
              <MenuItem>Densidade</MenuItem>
            </ViewSettingsSection>
          </ViewSettings>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    onReset.mockClear()
    let menu = await openSettings(canvasElement, 'Sem redefinir')
    await expect(menu.queryByRole('menuitem', { name: 'Redefinir' })).toBeNull()
    await closeMenu()
    menu = await openSettings(canvasElement, 'Com redefinir')
    await userEvent.click(menu.getByRole('menuitem', { name: 'Redefinir' }))
    await expect(onReset).toHaveBeenCalledTimes(1)
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenu()
  },
}
