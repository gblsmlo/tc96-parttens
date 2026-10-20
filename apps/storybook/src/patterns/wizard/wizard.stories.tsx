import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Wizard,
  WizardFooter,
  WizardNext,
  WizardPrevious,
  type WizardProps,
  type WizardStep,
} from '@tc96/parttens'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { wizardArgTypes } from '../../test-utils/story-arg-types'
import { dealSteps } from './fixtures/deal'

const usage = `
import {
  Wizard,
  WizardFooter,
  WizardNext,
  WizardPrevious,
} from '@acme/patterns'

<Wizard label="Etapas do cupom" onValueChange={setStep} steps={steps} value={step}>
  {step === 'type' ? <DealTypeFields /> : null}
  {step === 'details' ? <DealDetailsFields /> : null}
  <WizardFooter>
    <WizardPrevious>
      <ArrowLeftIcon aria-hidden="true" />
      Anterior
    </WizardPrevious>
    {step === 'review' ? (
      <Button onClick={submit}>Criar cupom</Button>
    ) : (
      <WizardNext onClick={(event) => !isValid(step) && event.preventDefault()}>
        Próximo
        <ArrowRightIcon aria-hidden="true" />
      </WizardNext>
    )}
  </WizardFooter>
</Wizard>
`

const docs = {
  api: [
    {
      description:
        'Root component. Two layers of COSS `Card`: the steps in a `nav` named by `label` on the recessed outer card (`bg-muted`, the theme `sidebar` token in dark), and the current step in a `section` named by its title on the default card raised over it. `steps` take `value`, `title`, `description`, `icon` and `disabled`; each renders as a button whose `IconFrame` shows the `icon` (or a check once complete, or the step number), and the status (`complete`, `current`, `upcoming`) comes from the order against `value`. A click on another step calls `onValueChange`; a `disabled` step stays out of reach of the nav. Below a 42rem container the nav stacks above the inner card.',
      name: 'Wizard',
    },
    {
      description:
        'The row of actions at the end of the panel, with the first child at the start and the last at the end.',
      name: 'WizardFooter',
    },
    {
      description:
        'COSS `Button`s that call `onValueChange` with the step before or after `value`, including a step disabled in the nav, and then focus the panel. Each is disabled when there is no such step. The consumer `onClick` runs first, and `event.preventDefault()` there keeps the wizard on the step, which is how a step validates. `WizardPrevious` defaults to the `secondary` variant.',
      name: 'WizardPrevious, WizardNext',
    },
  ],
  description: {
    component:
      'A controlled multi-step flow. The consumer owns the current step, the data of each step, the validation and the submission, and decides which steps the nav can reach; the pattern renders the steps, their status and the moves between them.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const numberedSteps = dealSteps.map(({ icon: _icon, ...step }) => step)

function ControlledWizard(args: WizardProps) {
  const [value, setValue] = useState(args.value)
  const step = args.steps.find((item) => item.value === value)

  return (
    <Wizard
      {...args}
      onValueChange={(next) => {
        args.onValueChange(next)
        setValue(next)
      }}
      value={value}
    >
      <div className="flex min-h-40 flex-col gap-1">
        <h2 className="font-semibold text-lg">{step?.title}</h2>
        <p className="text-muted-foreground text-sm">{step?.description}</p>
      </div>
      <WizardFooter>
        <WizardPrevious>
          <ArrowLeftIcon aria-hidden="true" />
          Anterior
        </WizardPrevious>
        <WizardNext>
          Próximo
          <ArrowRightIcon aria-hidden="true" />
        </WizardNext>
      </WizardFooter>
    </Wizard>
  )
}

const meta = {
  args: {
    className: 'mx-auto max-w-4xl',
    label: 'Etapas do cupom',
    onValueChange: fn((_value: string) => {}),
    steps: dealSteps,
    value: 'details',
  },
  argTypes: {
    ...wizardArgTypes,
    value: {
      control: 'inline-radio',
      options: dealSteps.map((step) => step.value),
    },
  },
  component: Wizard,
  parameters: { docs, layout: 'padded' },
  render: (args) => <ControlledWizard key={args.value} {...args} />,
  title: 'Patterns/Wizard',
} satisfies Meta<typeof Wizard>

export default meta

type Story = StoryObj<typeof meta>

const nav = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('navigation', { name: 'Etapas do cupom' })

const statuses = (canvasElement: HTMLElement) =>
  within(nav(canvasElement))
    .getAllByRole('listitem')
    .map((item) => item.getAttribute('data-status'))

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(statuses(canvasElement)).toEqual([
      'complete',
      'current',
      'upcoming',
      'upcoming',
    ])
    await expect(
      within(nav(canvasElement)).getByRole('button', { current: 'step' }),
    ).toHaveAccessibleName(/^Detalhes/)

    await userEvent.click(canvas.getByRole('button', { name: 'Próximo' }))

    await expect(args.onValueChange).toHaveBeenCalledWith('usage')
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Uso' })).toHaveFocus(),
    )

    await userEvent.click(
      within(nav(canvasElement)).getByRole('button', {
        name: /^Tipo do cupom/,
      }),
    )

    await expect(
      canvas.getByRole('button', { name: 'Anterior' }),
    ).toBeDisabled()
  },
  tags: ['!dev', '!autodocs'],
}

export const Numbered: Story = {
  args: { steps: numberedSteps },
}

export const NumberedInteraction: Story = {
  ...Numbered,
  play: async ({ canvasElement }) => {
    const indicators = nav(canvasElement).querySelectorAll(
      '[data-slot="wizard-step-indicator"]',
    )
    await expect(indicators[0]?.querySelector('svg')).not.toBeNull()
    await expect(
      [...indicators].slice(1).map((indicator) => indicator.textContent),
    ).toEqual(['2', '3', '4'])
  },
  tags: ['!dev', '!autodocs'],
}

const lockedSteps: WizardStep[] = dealSteps.map((step, index) => ({
  ...step,
  disabled: index > 1,
}))

export const LockedSteps: Story = {
  args: { steps: lockedSteps },
}

export const LockedStepsInteraction: Story = {
  ...LockedSteps,
  play: async ({ args, canvasElement }) => {
    const review = within(nav(canvasElement)).getByRole('button', {
      name: /^Revisão/,
    })
    await expect(review).toBeDisabled()

    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Próximo' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledWith('usage')
  },
  tags: ['!dev', '!autodocs'],
}
