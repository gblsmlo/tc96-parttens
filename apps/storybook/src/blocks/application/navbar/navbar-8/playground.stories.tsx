import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar8Controls,
  navbar8ControlArgs,
  navbar8ControlArgTypes,
} from './navbar-8-controls.ts'
import { ComposedNavbar8 } from './navbar-8-layouts.tsx'

const meta = {
  args: navbar8ControlArgs,
  argTypes: navbar8ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar8/Playground',
} satisfies Meta<Navbar8Controls>

export default meta

type Story = StoryObj<Navbar8Controls>

export const Playground: Story = {}
