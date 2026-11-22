import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagCanvas } from './flag-canvas.tsx'
import {
  type FlagControls,
  flagControlArgs,
  flagControlArgTypes,
} from './flag-controls.ts'
import { ComposedFlag } from './flag-layouts.tsx'

const meta = {
  args: flagControlArgs,
  argTypes: flagControlArgTypes,
  decorators: [FlagCanvas],
  render: (args) => <ComposedFlag {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Playground',
} satisfies Meta<FlagControls>

export default meta

type Story = StoryObj<FlagControls>

export const Playground: Story = {}
