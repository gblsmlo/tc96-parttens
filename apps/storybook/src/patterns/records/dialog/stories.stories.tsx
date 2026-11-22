import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordDialogControls,
  recordDialogControlArgs,
  recordDialogControlArgTypes,
} from './record-dialog-controls.ts'
import { ComposedRecordDialog } from './record-dialog-layouts.tsx'

const meta = {
  args: recordDialogControlArgs,
  argTypes: recordDialogControlArgTypes,
  parameters: {
    controls: {
      exclude: ['size', 'stretchBody', 'submitDisabled', 'submitOnModEnter'],
    },
  },
  render: (args) => <ComposedRecordDialog {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Stories',
} satisfies Meta<RecordDialogControls>

export default meta

type Story = StoryObj<RecordDialogControls>

export const Default: Story = {}

export const SizeSmall: Story = {
  args: { size: 'small' },
  name: 'Size small',
}

export const SizeLarge: Story = {
  args: { size: 'large' },
  name: 'Size large',
}

export const StretchBody: Story = {
  args: { stretchBody: true },
  name: 'stretchBody',
}

export const SubmitDisabled: Story = {
  args: { submitDisabled: true },
  name: 'submitDisabled',
}

export const SubmitOnModEnter: Story = {
  args: { submitOnModEnter: true },
  name: 'submitOnModEnter',
}
