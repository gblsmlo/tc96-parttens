import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Projects1Controls,
  projects1ControlArgs,
  projects1ControlArgTypes,
} from './projects-1-controls.ts'
import { ComposedProjects1 } from './projects-1-layouts.tsx'

const meta = {
  args: projects1ControlArgs,
  argTypes: projects1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedProjects1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects1/Playground',
} satisfies Meta<Projects1Controls>

export default meta

type Story = StoryObj<Projects1Controls>

export const Playground: Story = {}
