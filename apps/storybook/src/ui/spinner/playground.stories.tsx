import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SpinnerControls,
  spinnerControlArgs,
  spinnerControlArgTypes,
} from './spinner-controls.ts'
import { ComposedSpinner } from './spinner-layouts.tsx'

const meta = {
  args: spinnerControlArgs,
  argTypes: spinnerControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSpinner {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Spinner/Playground',
} satisfies Meta<SpinnerControls>

export default meta

type Story = StoryObj<SpinnerControls>

export const Playground: Story = {}
