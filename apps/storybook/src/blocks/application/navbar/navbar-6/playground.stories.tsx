import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar6Controls,
  navbar6ControlArgs,
  navbar6ControlArgTypes,
} from './navbar-6-controls.ts'
import { ComposedNavbar6 } from './navbar-6-layouts.tsx'

const meta = {
  args: navbar6ControlArgs,
  argTypes: navbar6ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar6/Playground',
} satisfies Meta<Navbar6Controls>

export default meta

type Story = StoryObj<Navbar6Controls>

export const Playground: Story = {}
