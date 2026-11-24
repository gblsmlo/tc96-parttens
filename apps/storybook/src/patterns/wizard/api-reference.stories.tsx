import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Wizard,
  WizardFooter,
  WizardNext,
  WizardPrevious,
} from '@tc96/ui/patterns'
import { expect, fn, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { dealSteps } from './fixtures/deal.tsx'
import { WizardCanvas } from './wizard-canvas.tsx'

const meta = {
  args: {
    label: 'Etapas do cupom',
    onValueChange: fn(),
    steps: dealSteps,
    value: 'details',
  },
  component: Wizard,
  decorators: [WizardCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Wizard/API Reference',
} satisfies Meta<typeof Wizard>

export default meta

type Story = StoryObj<typeof meta>

const anatomySlots = [
  'wizard',
  'card',
  'wizard-nav',
  'wizard-step',
  'wizard-step-trigger',
  'wizard-step-indicator',
  'wizard-step-title',
  'wizard-step-description',
  'wizard-panel',
  'wizard-footer',
  'wizard-previous',
  'wizard-next',
]

export const Anatomy: Story = {
  render: (args) => (
    <Wizard {...args}>
      <Slot name="children" />
      <WizardFooter>
        <WizardPrevious>WizardPrevious</WizardPrevious>
        <WizardNext>WizardNext</WizardNext>
      </WizardFooter>
    </Wizard>
  ),
  play: async ({ canvasElement }) => {
    for (const slot of anatomySlots) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
    await expect(within(canvasElement).getByText('children')).toBeVisible()
  },
}
