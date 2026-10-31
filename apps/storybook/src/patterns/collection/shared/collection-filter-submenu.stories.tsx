import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  FilterRadioSubmenu,
  type FilterRadioSubmenuProps,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { CircleDotIcon } from 'lucide-react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const OPTIONS = [
  ['person', 'Pessoa'],
  ['organization', 'Organização'],
] as const

const onValueChange = fn()

function Submenu({ value }: Readonly<Pick<FilterRadioSubmenuProps, 'value'>>) {
  return (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu onClearFilters={() => undefined}>
          <ViewSettingsSection label="Filtros">
            <FilterRadioSubmenu
              icon={CircleDotIcon}
              label="Tipo"
              onValueChange={onValueChange}
              options={OPTIONS}
              value={value}
            />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      }
    />
  )
}

const openTypeSubmenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
}

const meta = {
  parameters: { layout: 'padded' },
  render: ({ value }: Pick<FilterRadioSubmenuProps, 'value'>) => (
    <Submenu value={value} />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Shared/Filter Submenu',
} satisfies Meta<Pick<FilterRadioSubmenuProps, 'value'>>

export default meta
type Story = StoryObj<typeof meta>

export const MarksActiveOptionAndReturnsChoice: Story = {
  args: { value: 'person' },
  play: async ({ canvasElement }) => {
    onValueChange.mockClear()
    await openTypeSubmenu(canvasElement)

    await expect(
      await screen.findByRole('menuitemradio', { name: 'Pessoa' }),
    ).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(
      screen.getByRole('menuitemradio', { name: 'Organização' }),
    )
    await expect(onValueChange).toHaveBeenCalledWith('organization')
  },
}

export const NoValueMarksAllOption: Story = {
  play: async ({ canvasElement }) => {
    await openTypeSubmenu(canvasElement)

    await expect(
      await screen.findByRole('menuitemradio', { name: 'Todos' }),
    ).toHaveAttribute('aria-checked', 'true')
  },
}

export const AllOptionReturnsEmptyString: Story = {
  args: { value: 'person' },
  play: async ({ canvasElement }) => {
    onValueChange.mockClear()
    await openTypeSubmenu(canvasElement)

    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Todos' }),
    )
    await expect(onValueChange).toHaveBeenCalledWith('')
  },
}
