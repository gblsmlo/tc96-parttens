import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar11Controls,
  navbar11ControlArgs,
  navbar11ControlArgTypes,
} from './navbar-11-controls.ts'
import { ComposedNavbar11 } from './navbar-11-layouts.tsx'

const meta = {
  args: navbar11ControlArgs,
  argTypes: navbar11ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar11 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar11/Playground',
} satisfies Meta<Navbar11Controls>

export default meta

type Story = StoryObj<Navbar11Controls>

export const Playground: Story = {}
