import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar9Controls,
  navbar9ControlArgs,
  navbar9ControlArgTypes,
} from './navbar-9-controls.ts'
import { ComposedNavbar9 } from './navbar-9-layouts.tsx'

const meta = {
  args: navbar9ControlArgs,
  argTypes: navbar9ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar9/Playground',
} satisfies Meta<Navbar9Controls>

export default meta

type Story = StoryObj<Navbar9Controls>

export const Playground: Story = {}
