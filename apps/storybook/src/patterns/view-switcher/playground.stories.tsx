import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSwitcherCanvas } from './view-switcher-canvas.tsx'
import {
  type ViewSwitcherControls,
  viewSwitcherControlArgs,
  viewSwitcherControlArgTypes,
} from './view-switcher-controls.ts'
import { ComposedViewSwitcher } from './view-switcher-layouts.tsx'

const meta = {
  args: viewSwitcherControlArgs,
  argTypes: viewSwitcherControlArgTypes,
  decorators: [ViewSwitcherCanvas],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedViewSwitcher {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ViewSwitcher/Playground',
} satisfies Meta<ViewSwitcherControls>

export default meta

type Story = StoryObj<ViewSwitcherControls>

export const Playground: Story = {}
