import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar2Controls,
  navbar2ControlArgs,
  navbar2ControlArgTypes,
} from './navbar-2-controls.ts'
import { ComposedNavbar2 } from './navbar-2-layouts.tsx'

const meta = {
  args: navbar2ControlArgs,
  argTypes: navbar2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar2/Playground',
} satisfies Meta<Navbar2Controls>

export default meta

type Story = StoryObj<Navbar2Controls>

export const Playground: Story = {}
