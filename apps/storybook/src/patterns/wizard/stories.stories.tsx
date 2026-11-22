import type { Meta, StoryObj } from '@storybook/react-vite'
import { WizardCanvas } from './wizard-canvas.tsx'
import {
  type WizardControls,
  wizardControlArgs,
  wizardControlArgTypes,
} from './wizard-controls.ts'
import { ComposedWizard } from './wizard-layouts.tsx'

const meta = {
  args: wizardControlArgs,
  argTypes: wizardControlArgTypes,
  decorators: [WizardCanvas],
  parameters: { controls: { exclude: ['value'] } },
  render: (args) => <ComposedWizard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Stories',
} satisfies Meta<WizardControls>

export default meta

type Story = StoryObj<WizardControls>

export const Default: Story = {}

export const ValueType: Story = {
  args: { value: 'type' },
  name: 'Value type',
}

export const ValueUsage: Story = {
  args: { value: 'usage' },
  name: 'Value usage',
}

export const ValueReview: Story = {
  args: { value: 'review' },
  name: 'Value review',
}
