import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DialogControls,
  dialogControlArgs,
  dialogControlArgTypes,
} from './dialog-controls.ts'
import { ComposedDialog } from './dialog-layouts.tsx'

const meta = {
  args: dialogControlArgs,
  argTypes: dialogControlArgTypes,
  render: (args) => <ComposedDialog {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Dialog/Playground',
} satisfies Meta<DialogControls>

export default meta

type Story = StoryObj<DialogControls>

export const Playground: Story = {}
