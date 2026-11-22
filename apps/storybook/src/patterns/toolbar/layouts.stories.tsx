import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarCanvas } from './toolbar-canvas.tsx'
import { toolbarControlArgs } from './toolbar-controls.ts'
import { savedViews } from './toolbar-data.tsx'
import {
  ChildrenToolbar,
  ComposedToolbar,
  FourModesToolbar,
  ThreeModesToolbar,
} from './toolbar-layouts.tsx'

const meta = {
  decorators: [ToolbarCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithCenterSlot: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} centerSlot />,
}

export const WithoutViewSwitcher: Story = {
  render: () => <ComposedToolbar {...toolbarControlArgs} switcher={false} />,
}

export const WithChildren: Story = {
  render: () => <ChildrenToolbar />,
}

export const ThreeModes: Story = {
  render: () => <ThreeModesToolbar />,
}

export const FourModes: Story = {
  render: () => <FourModesToolbar />,
}

export const Favorites: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      initialFavoriteIds={['all', 'overdue']}
      initialSelectedId="overdue"
    />
  ),
}

export const LongLabel: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      narrowSwitcher
      views={[
        {
          id: 'regional',
          label:
            'Pessoas contatadas recentemente pela equipe comercial da região sul',
        },
      ]}
    />
  ),
}

export const WithoutIcons: Story = {
  render: () => (
    <ComposedToolbar {...toolbarControlArgs} switcherIcon={false} />
  ),
}

export const SingleView: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      switcherOptions
      views={savedViews.slice(0, 1)}
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <ComposedToolbar
      {...toolbarControlArgs}
      initialSelectedId="all"
      switcherLoading
    />
  ),
}
