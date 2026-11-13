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

type SubmenuArgs = Pick<FilterRadioSubmenuProps, 'loading' | 'value'>

function Submenu({ loading, value }: Readonly<SubmenuArgs>) {
  return (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu onClearFilters={() => undefined}>
          <ViewSettingsSection label="Filtros">
            <FilterRadioSubmenu
              icon={CircleDotIcon}
              label="Tipo"
              loading={loading}
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
  render: ({ loading, value }: SubmenuArgs) => (
    <Submenu loading={loading} value={value} />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Shared/Filter Submenu',
} satisfies Meta<SubmenuArgs>

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

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    onValueChange.mockClear()
    await openTypeSubmenu(canvasElement)

    const allOption = await screen.findByRole('menuitemradio', {
      name: 'Todos',
    })
    const submenu = allOption.closest('[role="menu"]') as HTMLElement
    await expect(submenu).toHaveAttribute('aria-busy', 'true')
    await expect(
      submenu.querySelectorAll('[data-slot="skeleton"]'),
    ).toHaveLength(3)
    await expect(within(submenu).getAllByRole('menuitemradio')).toEqual([
      allOption,
    ])

    await userEvent.click(allOption)
    await expect(onValueChange).toHaveBeenCalledWith('')
  },
}
