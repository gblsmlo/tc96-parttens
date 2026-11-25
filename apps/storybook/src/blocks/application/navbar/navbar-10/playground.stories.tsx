import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar10Controls,
  navbar10ControlArgs,
  navbar10ControlArgTypes,
} from './navbar-10-controls.ts'
import { ComposedNavbar10 } from './navbar-10-layouts.tsx'

const meta = {
  args: navbar10ControlArgs,
  argTypes: navbar10ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar10/Playground',
} satisfies Meta<Navbar10Controls>

export default meta

type Story = StoryObj<Navbar10Controls>

export const Playground: Story = {}
