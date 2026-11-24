import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar1Controls,
  navbar1ControlArgs,
  navbar1ControlArgTypes,
} from './navbar-1-controls.ts'
import { ComposedNavbar1 } from './navbar-1-layouts.tsx'

const meta = {
  args: navbar1ControlArgs,
  argTypes: navbar1ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar1/Playground',
} satisfies Meta<Navbar1Controls>

export default meta

type Story = StoryObj<Navbar1Controls>

export const Playground: Story = {}
