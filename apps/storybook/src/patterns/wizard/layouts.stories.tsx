import type { Meta, StoryObj } from '@storybook/react-vite'
import { WizardCanvas } from './wizard-canvas.tsx'
import { wizardControlArgs } from './wizard-controls.ts'
import {
  CancelOnFirstStepWizard,
  ComposedWizard,
  SubmitOnLastStepWizard,
} from './wizard-layouts.tsx'

const meta = {
  decorators: [WizardCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Numbered: Story = {
  render: () => <ComposedWizard {...wizardControlArgs} icons={false} />,
}

export const WithoutDescriptions: Story = {
  render: () => <ComposedWizard {...wizardControlArgs} descriptions={false} />,
}

export const LockedSteps: Story = {
  render: () => <ComposedWizard {...wizardControlArgs} lockedSteps />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedWizard {...wizardControlArgs} footer={false} />,
}

export const SubmitOnLastStep: Story = {
  render: () => <SubmitOnLastStepWizard />,
}

export const CancelOnFirstStep: Story = {
  render: () => <CancelOnFirstStepWizard />,
}
