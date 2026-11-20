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
  parameters: {
    controls: { exclude: ['bottomStickOnMobile', 'footerVariant'] },
  },
  render: (args) => <ComposedDialog {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Dialog/Stories',
} satisfies Meta<DialogControls>

export default meta

type Story = StoryObj<DialogControls>

export const Default: Story = {}

export const FooterBare: Story = {
  args: { footerVariant: 'bare' },
  name: 'Footer bare',
}

export const BottomStickOnMobileFalse: Story = {
  args: { bottomStickOnMobile: false },
  name: 'bottomStickOnMobile false',
}
