import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Projects3Controls,
  projects3ControlArgs,
  projects3ControlArgTypes,
} from './projects-3-controls.ts'
import { ComposedProjects3 } from './projects-3-layouts.tsx'

const meta = {
  args: projects3ControlArgs,
  argTypes: projects3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedProjects3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects3/Playground',
} satisfies Meta<Projects3Controls>

export default meta

type Story = StoryObj<Projects3Controls>

export const Playground: Story = {}
