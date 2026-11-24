import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar3Controls,
  navbar3ControlArgs,
  navbar3ControlArgTypes,
} from './navbar-3-controls.ts'
import { ComposedNavbar3 } from './navbar-3-layouts.tsx'

const meta = {
  args: navbar3ControlArgs,
  argTypes: navbar3ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar3/Playground',
} satisfies Meta<Navbar3Controls>

export default meta

type Story = StoryObj<Navbar3Controls>

export const Playground: Story = {}
