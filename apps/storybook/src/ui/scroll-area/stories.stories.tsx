import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ScrollAreaControls,
  scrollAreaControlArgs,
  scrollAreaControlArgTypes,
} from './scroll-area-controls.ts'
import { ComposedScrollArea } from './scroll-area-layouts.tsx'

const meta = {
  args: scrollAreaControlArgs,
  argTypes: scrollAreaControlArgTypes,
  parameters: {
    controls: { exclude: ['clampContentMinWidth', 'scrollFade'] },
    layout: 'centered',
  },
  render: (args) => <ComposedScrollArea {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ScrollArea/Stories',
} satisfies Meta<ScrollAreaControls>

export default meta

type Story = StoryObj<ScrollAreaControls>

export const Default: Story = {}

export const ScrollFade: Story = {
  args: { scrollFade: true },
}

export const GrowsToWidestLine: Story = {
  args: { clampContentMinWidth: false },
  name: 'clampContentMinWidth false',
}
