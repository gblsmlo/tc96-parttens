import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Wizard,
  WizardFooter,
  WizardNext,
  type WizardNextProps,
  WizardPrevious,
  type WizardStep,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const steps: WizardStep[] = [
  { title: 'Tipo', value: 'type' },
  { title: 'Detalhes', value: 'details' },
  { disabled: true, title: 'Revisão', value: 'review' },
]

interface ControlledWizardProps {
  defaultValue?: string
  nextProps?: WizardNextProps
  onValueChange?: (value: string) => void
}

function ControlledWizard({
  defaultValue = 'type',
  nextProps,
  onValueChange,
}: ControlledWizardProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <Wizard
      label="Etapas"
      onValueChange={(next) => {
        onValueChange?.(next)
        setValue(next)
      }}
      steps={steps}
      value={value}
    >
      <WizardFooter>
        <WizardPrevious>Anterior</WizardPrevious>
        <WizardNext {...nextProps}>Próximo</WizardNext>
      </WizardFooter>
    </Wizard>
  )
}

const previousButtonOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Anterior' })
const nextButtonOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Próximo' })
const panelOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="wizard-panel"]')

const meta = {
  args: { onValueChange: fn() },
  component: ControlledWizard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Composition/Footer',
} satisfies Meta<typeof ControlledWizard>

export default meta
type Story = StoryObj<typeof meta>

export const ActionsInFooter: Story = {
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector('[data-slot="wizard-footer"]')

    await expect(footer?.contains(previousButtonOf(canvasElement))).toBe(true)
    await expect(previousButtonOf(canvasElement)).toHaveAttribute(
      'data-slot',
      'wizard-previous',
    )
    await expect(nextButtonOf(canvasElement)).toHaveAttribute(
      'data-slot',
      'wizard-next',
    )
  },
}

export const PreviousDisabledOnFirstStep: Story = {
  play: async ({ canvasElement }) => {
    await expect(previousButtonOf(canvasElement)).toBeDisabled()
    await expect(nextButtonOf(canvasElement)).toBeEnabled()
  },
}

export const NextDisabledOnLastStep: Story = {
  args: { defaultValue: 'review' },
  play: async ({ canvasElement }) => {
    await expect(previousButtonOf(canvasElement)).toBeEnabled()
    await expect(nextButtonOf(canvasElement)).toBeDisabled()
  },
}

export const MovesToAdjacentStepsIncludingDisabled: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(nextButtonOf(canvasElement))
    await userEvent.click(nextButtonOf(canvasElement))
    await userEvent.click(previousButtonOf(canvasElement))

    await expect(args.onValueChange).toHaveBeenNthCalledWith(1, 'details')
    await expect(args.onValueChange).toHaveBeenNthCalledWith(2, 'review')
    await expect(args.onValueChange).toHaveBeenNthCalledWith(3, 'details')
    await expect(args.onValueChange).toHaveBeenCalledTimes(3)
  },
}

export const FocusesPanelAfterMove: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(nextButtonOf(canvasElement))

    await waitFor(() =>
      expect(canvasElement.ownerDocument.activeElement).toBe(
        panelOf(canvasElement),
      ),
    )
    await expect(
      panelOf(canvasElement)?.getAttribute('aria-labelledby'),
    ).toBeTruthy()
  },
}

export const StaysWhenConsumerPreventsClick: Story = {
  args: { nextProps: { onClick: (event) => event.preventDefault() } },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(nextButtonOf(canvasElement))

    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const KeepsConsumerDisabledOnNext: Story = {
  args: { nextProps: { disabled: true } },
  play: async ({ canvasElement }) => {
    await expect(nextButtonOf(canvasElement)).toBeDisabled()
  },
}
