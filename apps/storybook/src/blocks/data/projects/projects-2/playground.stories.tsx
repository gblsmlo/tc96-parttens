import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Projects2Controls,
  projects2ControlArgs,
  projects2ControlArgTypes,
} from './projects-2-controls.ts'
import { ComposedProjects2 } from './projects-2-layouts.tsx'

const meta = {
  args: projects2ControlArgs,
  argTypes: projects2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedProjects2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects2/Playground',
} satisfies Meta<Projects2Controls>

export default meta

type Story = StoryObj<Projects2Controls>

export const Playground: Story = {}
