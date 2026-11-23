import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SignupControls,
  signupControlArgs,
  signupControlArgTypes,
} from './signup-1-controls.ts'
import { ComposedSignup } from './signup-1-layouts.tsx'

const meta = {
  args: signupControlArgs,
  argTypes: signupControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedSignup {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Signup1/Playground',
} satisfies Meta<SignupControls>

export default meta

type Story = StoryObj<SignupControls>

export const Playground: Story = {}
