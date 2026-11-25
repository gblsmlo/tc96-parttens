import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSwitcherCanvas } from './view-switcher-canvas.tsx'
import { viewSwitcherControlArgs } from './view-switcher-controls.ts'
import {
  ComposedViewSwitcher,
  FavoritesAboveLayout,
} from './view-switcher-layouts.tsx'

const meta = {
  decorators: [ViewSwitcherCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSwitcher/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedViewSwitcher {...viewSwitcherControlArgs} />,
}

export const FavoritesAbove: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two `ViewSwitcherItems` in the popover: the favorites first, under their own label, then the other views after a separator. For a list long enough that the user pins the views they return to.',
      },
    },
  },
  render: () => <FavoritesAboveLayout {...viewSwitcherControlArgs} />,
}
