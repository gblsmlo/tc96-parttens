import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar4Controls,
  navbar4ControlArgs,
  navbar4ControlArgTypes,
} from './navbar-4-controls.ts'
import { ComposedNavbar4 } from './navbar-4-layouts.tsx'

const meta = {
  args: navbar4ControlArgs,
  argTypes: navbar4ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar4/Playground',
} satisfies Meta<Navbar4Controls>

export default meta

type Story = StoryObj<Navbar4Controls>

export const Playground: Story = {}
