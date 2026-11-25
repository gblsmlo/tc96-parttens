import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Marketing1Controls,
  marketing1ControlArgs,
  marketing1ControlArgTypes,
} from './marketing-1-controls.ts'
import { ComposedMarketing1 } from './marketing-1-layouts.tsx'

const meta = {
  args: marketing1ControlArgs,
  argTypes: marketing1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedMarketing1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Marketing/Marketing1/Playground',
} satisfies Meta<Marketing1Controls>

export default meta

type Story = StoryObj<Marketing1Controls>

export const Playground: Story = {}
