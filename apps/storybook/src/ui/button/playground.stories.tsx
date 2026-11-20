import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ButtonControls,
  buttonControlArgs,
  buttonControlArgTypes,
} from './button-controls.ts'
import { ComposedButton } from './button-layouts.tsx'

const meta = {
  args: buttonControlArgs,
  argTypes: buttonControlArgTypes,
  render: (args) => <ComposedButton {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Button/Playground',
} satisfies Meta<ButtonControls>

export default meta

type Story = StoryObj<ButtonControls>

export const Playground: Story = {}
