import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Marketing2Controls,
  marketing2ControlArgs,
  marketing2ControlArgTypes,
} from './marketing-2-controls.ts'
import { ComposedMarketing2 } from './marketing-2-layouts.tsx'

const meta = {
  args: marketing2ControlArgs,
  argTypes: marketing2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedMarketing2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Marketing/Marketing2/Playground',
} satisfies Meta<Marketing2Controls>

export default meta

type Story = StoryObj<Marketing2Controls>

export const Playground: Story = {}
