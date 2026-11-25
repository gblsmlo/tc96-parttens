import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar12Controls,
  navbar12ControlArgs,
  navbar12ControlArgTypes,
} from './navbar-12-controls.ts'
import { ComposedNavbar12 } from './navbar-12-layouts.tsx'

const meta = {
  args: navbar12ControlArgs,
  argTypes: navbar12ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar12 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar12/Playground',
} satisfies Meta<Navbar12Controls>

export default meta

type Story = StoryObj<Navbar12Controls>

export const Playground: Story = {}
