import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  ViewSettingsMenu,
  type ViewSettingsMode,
} from '@tc96/parttens'
import { LayoutGridIcon } from 'lucide-react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

const modesOf = (count: number): ViewSettingsMode[] =>
  Array.from({ length: count }, (_, index) => ({
    icon: LayoutGridIcon,
    label: `Modo ${index + 1}`,
    value: `mode-${index + 1}`,
  }))

interface Args {
  modeCount: number
}

const meta = {
  args: { modeCount: 0 },
  parameters: { layout: 'padded' },
  render: ({ modeCount }: Args) => (
    <CollectionToolbar
      endSlot={
        <ViewSettingsMenu
          mode="mode-1"
          modes={modesOf(modeCount)}
          onClearFilters={fn()}
        >
          <span>Seção</span>
        </ViewSettingsMenu>
      }
    />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Shared/View Settings',
} satisfies Meta<Args>

export default meta
type Story = StoryObj<typeof meta>

const expectPopupWidthRem = async (canvasElement: HTMLElement, rem: number) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  const menu = await screen.findByRole('menu')
  const rootPx = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  )

  await expect(menu.offsetWidth).toBe(rem * rootPx)
}

export const NoModes: Story = {
  args: { modeCount: 0 },
  play: async ({ canvasElement }) => {
    await expectPopupWidthRem(canvasElement, 14)
  },
}

export const TwoModes: Story = {
  args: { modeCount: 2 },
  play: async ({ canvasElement }) => {
    await expectPopupWidthRem(canvasElement, 16)
  },
}

export const ThreeModes: Story = {
  args: { modeCount: 3 },
  play: async ({ canvasElement }) => {
    await expectPopupWidthRem(canvasElement, 18)
  },
}

export const FourModes: Story = {
  args: { modeCount: 4 },
  play: async ({ canvasElement }) => {
    await expectPopupWidthRem(canvasElement, 24)
  },
}
