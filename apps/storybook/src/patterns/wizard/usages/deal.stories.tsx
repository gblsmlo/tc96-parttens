import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Wizard,
  WizardFooter,
  WizardNext,
  WizardPrevious,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Radio, RadioGroup } from '@tc96/ui/radio-group'
import { Switch } from '@tc96/ui/switch'
import { Textarea } from '@tc96/ui/textarea'
import { ArrowLeftIcon, ArrowRightIcon, CircleCheckIcon } from 'lucide-react'
import { type ReactNode, type RefObject, useId, useRef, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  blackFridayDeal,
  cardConditions,
  type DealDraft,
  type DealStepValue,
  dealStatuses,
  dealSteps,
  dealTypes,
  labelOf,
  notifyChannels,
  offeredItems,
  paymentMethods,
  regions,
  userTypes,
} from '../fixtures/deal'
import { CurrencyField, DateField, SelectField } from '../fixtures/fields'

type UpdateDeal = (patch: Partial<DealDraft>) => void

interface StepProps {
  deal: DealDraft
  update: UpdateDeal
}

function DealTypeStep({ deal, update }: Readonly<StepProps>) {
  const id = useId()

  return (
    <>
      <RadioGroup
        aria-label="Tipo do cupom"
        className="grid gap-4 @xl/wizard:grid-cols-3"
        onValueChange={(type) => update({ type: String(type) })}
        value={deal.type}
      >
        {dealTypes.map(({ description, icon: Icon, label, value }) => (
          <div
            className="relative flex flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors hover:bg-accent/50 has-data-checked:border-primary"
            key={value}
          >
            <Icon aria-hidden="true" className="size-8 stroke-1" />
            <div className="flex flex-col gap-1">
              <label
                className="font-medium text-sm after:absolute after:inset-0"
                htmlFor={`${id}-${value}`}
              >
                {label}
              </label>
              <p
                className="text-muted-foreground text-xs"
                id={`${id}-${value}-description`}
              >
                {description}
              </p>
            </div>
            <Radio
              aria-describedby={`${id}-${value}-description`}
              id={`${id}-${value}`}
              value={value}
            />
          </div>
        ))}
      </RadioGroup>
      <div className="grid gap-6 @xl/wizard:grid-cols-2">
        <Field>
          <FieldLabel>Desconto</FieldLabel>
          <Input
            size="lg"
            inputMode="decimal"
            onValueChange={(discount) => update({ discount })}
            value={deal.discount}
          />
          <FieldDescription>
            Porcentagem do desconto: 10 equivale a 10%.
          </FieldDescription>
        </Field>
        <SelectField
          description="Região onde o cupom vale."
          label="Região"
          onValueChange={(region) => update({ region })}
          options={regions}
          placeholder="Selecione a região"
          value={deal.region}
        />
      </div>
    </>
  )
}

function DealDetailsStep({
  deal,
  showErrors,
  titleRef,
  update,
}: Readonly<
  StepProps & {
    showErrors: boolean
    titleRef: RefObject<HTMLInputElement | null>
  }
>) {
  const id = useId()
  const titleMissing = showErrors && !deal.title.trim()

  return (
    <div className="grid gap-6 @xl/wizard:grid-cols-2">
      <Field invalid={titleMissing}>
        <FieldLabel>Título</FieldLabel>
        <Input
          size="lg"
          onValueChange={(title) => update({ title })}
          placeholder="Black Friday, 25% OFF"
          ref={titleRef}
          value={deal.title}
        />
        {titleMissing ? (
          <FieldError match>Informe o título do cupom.</FieldError>
        ) : null}
      </Field>
      <Field>
        <FieldLabel>Código</FieldLabel>
        <Input
          size="lg"
          onValueChange={(code) => update({ code: code.toUpperCase() })}
          value={deal.code}
        />
      </Field>
      <Field className="@xl/wizard:row-span-2">
        <FieldLabel>Descrição</FieldLabel>
        <Textarea
          size="lg"
          onChange={(event) => update({ description: event.target.value })}
          placeholder="Descreva o cupom"
          value={deal.description}
        />
      </Field>
      <SelectField
        label="Itens ofertados"
        onValueChange={(next) => update({ offeredItems: next })}
        options={offeredItems}
        placeholder="Selecione os itens"
        value={deal.offeredItems}
      />
      <SelectField
        label="Condição do cartão"
        onValueChange={(cardCondition) => update({ cardCondition })}
        options={cardConditions}
        placeholder="Selecione a condição"
        value={deal.cardCondition}
      />
      <div className="grid grid-cols-2 gap-4">
        <DateField
          label="Início"
          onValueChange={(startsOn) => update({ startsOn })}
          value={deal.startsOn}
        />
        <DateField
          label="Fim"
          onValueChange={(endsOn) => update({ endsOn })}
          value={deal.endsOn}
        />
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-medium text-sm">Notificar clientes</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {notifyChannels.map((channel) => (
            <div className="flex items-center gap-2" key={channel.value}>
              <Checkbox
                checked={deal.notify.includes(channel.value)}
                id={`${id}-${channel.value}`}
                onCheckedChange={(checked) =>
                  update({
                    notify: checked
                      ? [...deal.notify, channel.value]
                      : deal.notify.filter((value) => value !== channel.value),
                  })
                }
              />
              <label className="text-sm" htmlFor={`${id}-${channel.value}`}>
                {channel.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

function DealUsageStep({ deal, update }: Readonly<StepProps>) {
  const id = useId()

  return (
    <div className="grid gap-6 @xl/wizard:grid-cols-2">
      <SelectField
        label="Tipo de cliente"
        onValueChange={(userType) => update({ userType })}
        options={userTypes}
        placeholder="Selecione o tipo"
        value={deal.userType}
      />
      <Field>
        <FieldLabel>Máximo de clientes</FieldLabel>
        <Input
          size="lg"
          inputMode="numeric"
          onValueChange={(maxUsers) => update({ maxUsers })}
          value={deal.maxUsers}
        />
      </Field>
      <CurrencyField
        label="Valor mínimo do carrinho"
        onValueChange={(minimumCart) => update({ minimumCart })}
        value={deal.minimumCart}
      />
      <CurrencyField
        label="Taxa promocional"
        onValueChange={(promotionalFee) => update({ promotionalFee })}
        value={deal.promotionalFee}
      />
      <SelectField
        label="Forma de pagamento"
        onValueChange={(paymentMethod) => update({ paymentMethod })}
        options={paymentMethods}
        placeholder="Selecione a forma"
        value={deal.paymentMethod}
      />
      <SelectField
        label="Status"
        onValueChange={(status) => update({ status })}
        options={dealStatuses}
        placeholder="Selecione o status"
        value={deal.status}
      />
      <div className="flex items-center gap-2 @xl/wizard:col-span-2">
        <Switch
          checked={deal.singleUse}
          id={`${id}-single-use`}
          onCheckedChange={(singleUse) => update({ singleUse })}
        />
        <label className="text-sm" htmlFor={`${id}-single-use`}>
          Limitar a um uso por cliente
        </label>
      </div>
    </div>
  )
}

const formatDate = (value: string) =>
  value ? value.split('-').reverse().join('/') : '—'

function DealReviewStep({
  confirmed,
  deal,
  onConfirmedChange,
}: Readonly<{
  confirmed: boolean
  deal: DealDraft
  onConfirmedChange: (confirmed: boolean) => void
}>) {
  const id = useId()
  const amount =
    deal.type === 'flat' ? `R$ ${deal.discount}` : `${deal.discount}%`
  const summary: [string, ReactNode][] = [
    ['Tipo', labelOf(dealTypes, deal.type)],
    ['Desconto', amount],
    ['Código', <Badge key="code">{deal.code || '—'}</Badge>],
    ['Título', deal.title || '—'],
    ['Vigência', `${formatDate(deal.startsOn)} a ${formatDate(deal.endsOn)}`],
    ['Região', labelOf(regions, deal.region) ?? '—'],
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-lg">Quase lá!</h2>
        <p className="text-muted-foreground text-sm">
          Confira os dados do cupom e confirme para criá-lo.
        </p>
      </div>
      <dl className="grid grid-cols-[8rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
        {summary.map(([term, detail]) => (
          <div className="contents" key={term}>
            <dt className="font-medium">{term}</dt>
            <dd className="text-muted-foreground">{detail}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center gap-2">
        <Switch
          checked={confirmed}
          id={`${id}-confirmed`}
          onCheckedChange={onConfirmedChange}
        />
        <label className="text-sm" htmlFor={`${id}-confirmed`}>
          Confirmei os dados do cupom
        </label>
      </div>
    </div>
  )
}

const stepIndex = (value: string) =>
  dealSteps.findIndex((step) => step.value === value)

interface DealWizardArgs {
  deal: DealDraft
  defaultStep: DealStepValue
  onSubmit: (deal: DealDraft) => void
}

function DealWizard({
  deal: initialDeal,
  defaultStep,
  onSubmit,
}: DealWizardArgs) {
  const [step, setStep] = useState<string>(defaultStep)
  const [reached, setReached] = useState(stepIndex(defaultStep))
  const [deal, setDeal] = useState(initialDeal)
  const [showErrors, setShowErrors] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const update: UpdateDeal = (patch) =>
    setDeal((current) => ({ ...current, ...patch }))
  const steps = dealSteps.map((item, index) => ({
    ...item,
    disabled: index > reached,
  }))

  return (
    <Wizard
      className="mx-auto max-w-5xl"
      label="Etapas do cupom"
      onValueChange={(next) => {
        setStep(next)
        setReached((current) => Math.max(current, stepIndex(next)))
        setShowErrors(false)
      }}
      steps={steps}
      value={step}
    >
      {step === 'type' ? <DealTypeStep deal={deal} update={update} /> : null}
      {step === 'details' ? (
        <DealDetailsStep
          deal={deal}
          showErrors={showErrors}
          titleRef={titleRef}
          update={update}
        />
      ) : null}
      {step === 'usage' ? <DealUsageStep deal={deal} update={update} /> : null}
      {step === 'review' ? (
        <DealReviewStep
          confirmed={confirmed}
          deal={deal}
          onConfirmedChange={setConfirmed}
        />
      ) : null}
      <output className="flex items-center gap-2 text-sm empty:hidden">
        {submitted ? (
          <>
            <CircleCheckIcon aria-hidden="true" className="size-4" />
            Cupom {deal.code} criado.
          </>
        ) : null}
      </output>
      <WizardFooter>
        <WizardPrevious>
          <ArrowLeftIcon aria-hidden="true" />
          Anterior
        </WizardPrevious>
        {step === 'review' ? (
          <Button
            disabled={!confirmed || submitted}
            onClick={() => {
              onSubmit(deal)
              setSubmitted(true)
            }}
          >
            Criar cupom
          </Button>
        ) : (
          <WizardNext
            onClick={(event) => {
              if (step !== 'details' || deal.title.trim()) return
              event.preventDefault()
              setShowErrors(true)
              titleRef.current?.focus()
            }}
          >
            Próximo
            <ArrowRightIcon aria-hidden="true" />
          </WizardNext>
        )}
      </WizardFooter>
    </Wizard>
  )
}

const meta = {
  args: {
    deal: blackFridayDeal,
    defaultStep: 'type',
    onSubmit: fn((_deal: DealDraft) => {}),
  },
  argTypes: {
    deal: { control: false },
    defaultStep: {
      control: 'inline-radio',
      options: dealSteps.map((step) => step.value),
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A four-step deal wizard on the `Wizard` pattern, after the Multi Step 2 block of shadcn studio: deal type (radio cards, discount and region), details, usage limits and a review that creates the deal. The story owns the step, the draft and the furthest step reached, as a consumer would: steps after it stay disabled in the nav, `WizardNext` cancels its move with `event.preventDefault()` while the title is empty, and the review swaps `WizardNext` for the submit button.',
      },
    },
  },
  render: (args) => <DealWizard key={args.defaultStep} {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Usages/Deal',
} satisfies Meta<DealWizardArgs>

export default meta

type Story = StoryObj<typeof meta>

const nextButton = () => screen.getByRole('button', { name: 'Próximo' })

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByRole('region', { name: 'Tipo do cupom' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: /^Uso/ })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Anterior' }),
    ).toBeDisabled()

    await userEvent.click(canvas.getByRole('radio', { name: 'Valor fixo' }))
    await expect(
      canvas.getByRole('radio', { name: 'Valor fixo' }),
    ).toBeChecked()

    for (const [title, index] of [
      ['Detalhes', 1],
      ['Uso', 2],
      ['Revisão', 3],
    ] as const) {
      await userEvent.click(nextButton())
      const panel = canvas.getByRole('region', { name: title })
      await waitFor(() => expect(panel).toHaveFocus())
      await expect(
        canvas.getByRole('button', { name: new RegExp(`^${title}`) }),
      ).toHaveAttribute('aria-current', 'step')
      const nav = canvas.getByRole('navigation', { name: 'Etapas do cupom' })
      await expect(within(nav).getAllByRole('listitem')[index]).toHaveAttribute(
        'data-status',
        'current',
      )
    }

    await expect(canvas.getByText('R$ 25')).toBeVisible()
    const submit = canvas.getByRole('button', { name: 'Criar cupom' })
    await expect(submit).toBeDisabled()

    await userEvent.click(
      canvas.getByRole('switch', { name: 'Confirmei os dados do cupom' }),
    )
    await userEvent.click(submit)

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'BLACKFRIDAY25', type: 'flat' }),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Cupom BLACKFRIDAY25 criado.',
    )
  },
}

export const RequiredTitle: Story = {
  args: {
    deal: { ...blackFridayDeal, title: '' },
    defaultStep: 'details',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`WizardNext` runs the consumer `onClick` first; here it calls `event.preventDefault()` while the title is empty, shows the `FieldError` and focuses the field, so the wizard stays on `Detalhes`.',
      },
    },
  },
  play: async ({ canvas }) => {
    await userEvent.click(nextButton())

    await expect(canvas.getByText('Informe o título do cupom.')).toBeVisible()
    await expect(canvas.getByRole('textbox', { name: 'Título' })).toHaveFocus()
    await expect(canvas.getByRole('region', { name: 'Detalhes' })).toBeVisible()

    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Título' }),
      'Semana do cliente',
    )
    await userEvent.click(nextButton())

    await expect(canvas.getByRole('region', { name: 'Uso' })).toBeVisible()
  },
}

export const BackToAReachedStep: Story = {
  args: { defaultStep: 'usage' },
  parameters: {
    docs: {
      description: {
        story:
          'The nav reaches any step up to the furthest one visited. Going back to `Tipo do cupom` keeps `Detalhes` and `Uso` enabled, and the later `Revisão` stays disabled until the user gets there.',
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /^Revisão/ }),
    ).toBeDisabled()

    await userEvent.click(
      canvas.getByRole('button', { name: /^Tipo do cupom/ }),
    )

    await expect(
      canvas.getByRole('region', { name: 'Tipo do cupom' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: /^Uso/ })).toBeEnabled()
    await expect(
      canvas.getByRole('button', { name: /^Revisão/ }),
    ).toBeDisabled()
  },
}
