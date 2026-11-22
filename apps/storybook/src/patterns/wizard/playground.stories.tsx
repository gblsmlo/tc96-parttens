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
  render: (args) => <ComposedWizard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Playground',
} satisfies Meta<WizardControls>

export default meta

type Story = StoryObj<WizardControls>

export const Playground: Story = {}
