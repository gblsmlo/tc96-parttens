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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedScrollArea {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ScrollArea/Playground',
} satisfies Meta<ScrollAreaControls>

export default meta

type Story = StoryObj<ScrollAreaControls>

export const Playground: Story = {}
