import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wizard, type WizardStep } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const steps: WizardStep[] = [
  {
    description: 'Escolha o tipo',
    icon: <svg aria-hidden="true" data-testid="type-icon" />,
    title: 'Tipo',
    value: 'type',
  },
  { description: 'Informe os dados', title: 'Detalhes', value: 'details' },
  { disabled: true, title: 'Revisão', value: 'review' },
]

const navOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('navigation', { name: 'Etapas do cupom' })
const stepItemsOf = (canvasElement: HTMLElement) =>
  within(navOf(canvasElement)).getAllByRole('listitem')
const stepButtonOf = (canvasElement: HTMLElement, name: RegExp) =>
  within(navOf(canvasElement)).getByRole('button', { name })
const indicatorOf = (canvasElement: HTMLElement, index: number) =>
  stepItemsOf(canvasElement)[index]?.querySelector(
    '[data-slot="wizard-step-indicator"]',
  )

function JumpingWizard() {
  const [value, setValue] = useState('review')

  return (
    <Wizard
      label="Etapas do cupom"
      onValueChange={setValue}
      steps={steps}
      value={value}
    >
      {value === 'review' ? (
        <button onClick={() => setValue('type')} type="button">
          Editar tipo
        </button>
      ) : (
        <p>Conteúdo</p>
      )}
    </Wizard>
  )
}

const meta = {
  args: {
    children: <p>Conteúdo</p>,
    label: 'Etapas do cupom',
    onValueChange: fn(),
    steps,
    value: 'details',
  },
  component: Wizard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Composition/Wizard',
} satisfies Meta<typeof Wizard>

export default meta
type Story = StoryObj<typeof meta>

export const StepsInOrderedListInsideNamedNav: Story = {
  play: async ({ canvasElement }) => {
    await expect(stepItemsOf(canvasElement)[0]?.parentElement?.tagName).toBe(
      'OL',
    )
    await expect(stepItemsOf(canvasElement)).toHaveLength(3)
    await expect(stepButtonOf(canvasElement, /^Tipo/).textContent).toBe(
      'TipoEscolha o tipo',
    )
  },
}

export const StatusFromPositionAgainstValue: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      stepItemsOf(canvasElement).map((item) =>
        item.getAttribute('data-status'),
      ),
    ).toEqual(['complete', 'current', 'upcoming'])
    await expect(stepButtonOf(canvasElement, /^Detalhes/)).toHaveAttribute(
      'aria-current',
      'step',
    )
    await expect(
      stepButtonOf(canvasElement, /^Tipo/).hasAttribute('aria-current'),
    ).toBe(false)
  },
}

export const IndicatorShowsIconOrNumber: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      indicatorOf(canvasElement, 0)?.querySelector('[data-testid="type-icon"]'),
    ).not.toBeNull()
    await expect(indicatorOf(canvasElement, 0)).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    await expect(indicatorOf(canvasElement, 1)?.textContent).toBe('2')
    await expect(indicatorOf(canvasElement, 2)?.textContent).toBe('3')
  },
}

export const IndicatorShowsCheckWhenComplete: Story = {
  args: { children: undefined, value: 'review' },
  play: async ({ canvasElement }) => {
    await expect(
      indicatorOf(canvasElement, 1)?.querySelector('svg'),
    ).not.toBeNull()
    await expect(indicatorOf(canvasElement, 1)?.textContent).toBe('')
  },
}

export const SelectsAnotherStepAndSkipsCurrent: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(stepButtonOf(canvasElement, /^Tipo/))
    await userEvent.click(stepButtonOf(canvasElement, /^Detalhes/))

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith('type')
  },
}

export const DisabledStepOutOfReach: Story = {
  play: async ({ args, canvasElement }) => {
    const review = stepButtonOf(canvasElement, /^Revisão/)

    await userEvent.click(review)

    await expect(review).toBeDisabled()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const PanelNamedByCurrentStep: Story = {
  play: async ({ canvasElement }) => {
    const panel = within(canvasElement).getByRole('region', {
      name: 'Detalhes',
    })

    await expect(panel).toHaveAttribute('data-slot', 'wizard-panel')
    await expect(panel).toHaveAttribute('tabindex', '-1')
    await expect(panel.textContent).toBe('Conteúdo')
  },
}

export const PanelUnnamedWhenValueIsNotAStep: Story = {
  args: { value: 'missing' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('region')).toBeNull()
    await expect(
      stepItemsOf(canvasElement).every(
        (item) => item.getAttribute('data-status') === 'upcoming',
      ),
    ).toBe(true)
  },
}

export const NavOnOuterCardPanelOnRaisedCard: Story = {
  args: { className: 'max-w-4xl' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector(
      '[data-slot="wizard"]',
    ) as HTMLElement
    const shell = root.querySelector('[data-slot="card"]') as HTMLElement
    const panel = within(canvasElement).getByRole('region', {
      name: 'Detalhes',
    })
    const panelCard = panel.parentElement as HTMLElement

    await expect(root.className).toContain('max-w-4xl')
    await expect(shell.parentElement).toBe(root)
    await expect(navOf(canvasElement).parentElement).toBe(shell)
    await expect(panelCard).toHaveAttribute('data-slot', 'card')
    await expect(panelCard.parentElement).toBe(shell)
    await expect(shell.className).toContain('bg-muted')
    await expect(panelCard.className).not.toContain('bg-muted')
  },
}

export const FocusesPanelWhenJumpUnmountsFocusedElement: Story = {
  render: () => <JumpingWizard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const edit = canvas.getByRole('button', { name: 'Editar tipo' })

    await expect(canvasElement.ownerDocument.activeElement).not.toBe(
      canvas.getByRole('region', { name: 'Revisão' }),
    )

    await userEvent.click(edit)

    await waitFor(() =>
      expect(canvasElement.ownerDocument.activeElement).toBe(
        canvas.getByRole('region', { name: 'Tipo' }),
      ),
    )
  },
}

export const KeepsFocusOnNavStepAfterClick: Story = {
  render: () => <JumpingWizard />,
  play: async ({ canvasElement }) => {
    const typeStep = stepButtonOf(canvasElement, /^Tipo/)

    await userEvent.click(typeStep)

    await expect(
      within(canvasElement).getByRole('region', { name: 'Tipo' }),
    ).toBeVisible()
    await expect(canvasElement.ownerDocument.activeElement).toBe(typeStep)
  },
}
