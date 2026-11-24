import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Navbar5Controls,
  navbar5ControlArgs,
  navbar5ControlArgTypes,
} from './navbar-5-controls.ts'
import { ComposedNavbar5 } from './navbar-5-layouts.tsx'

const meta = {
  args: navbar5ControlArgs,
  argTypes: navbar5ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedNavbar5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Navbar/Navbar5/Playground',
} satisfies Meta<Navbar5Controls>

export default meta

type Story = StoryObj<Navbar5Controls>

export const Playground: Story = {}
