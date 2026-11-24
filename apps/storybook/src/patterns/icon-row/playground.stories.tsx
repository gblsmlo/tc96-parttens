import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconRowCanvas } from './icon-row-canvas.tsx'
import {
  type IconRowControls,
  iconRowControlArgs,
  iconRowControlArgTypes,
} from './icon-row-controls.ts'
import { ComposedIconRow } from './icon-row-layouts.tsx'

const meta = {
  args: iconRowControlArgs,
  argTypes: iconRowControlArgTypes,
  decorators: [IconRowCanvas],
  render: (args) => <ComposedIconRow {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/IconRow/Playground',
} satisfies Meta<IconRowControls>

export default meta

type Story = StoryObj<IconRowControls>

export const Playground: Story = {}
