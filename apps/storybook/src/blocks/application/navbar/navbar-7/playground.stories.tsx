import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar7Controls,
  navbar7ControlArgs,
  navbar7ControlArgTypes,
} from './navbar-7-controls.ts'
import { ComposedNavbar7 } from './navbar-7-layouts.tsx'

const meta = {
  args: navbar7ControlArgs,
  argTypes: navbar7ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar7/Playground',
} satisfies Meta<Navbar7Controls>

export default meta

type Story = StoryObj<Navbar7Controls>

export const Playground: Story = {}
