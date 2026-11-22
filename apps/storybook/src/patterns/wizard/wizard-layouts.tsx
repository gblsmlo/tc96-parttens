import {
  Wizard,
  WizardFooter,
  WizardNext,
  type WizardNextProps,
  WizardPrevious,
  type WizardProps,
  type WizardStep,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { dealSteps } from './fixtures/deal.tsx'
import type { WizardControls } from './wizard-controls.ts'
import { behaviorSteps } from './wizard-data.tsx'

export interface StatefulWizardProps
  extends Omit<WizardProps, 'onValueChange' | 'value'> {
  defaultValue: string
  onValueChange?: (value: string) => void
}

export const StatefulWizard = ({
  defaultValue,
  onValueChange,
  ...props
}: Readonly<StatefulWizardProps>) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <Wizard
      {...props}
      onValueChange={(next) => {
        onValueChange?.(next)
        setValue(next)
      }}
      value={value}
    />
  )
}

const StepIntro = ({ step }: Readonly<{ step?: WizardStep }>) => (
  <div className="flex min-h-40 flex-col gap-1">
    <h2 className="font-semibold text-lg">{step?.title}</h2>
    {step?.description ? (
      <p className="text-muted-foreground text-sm">{step.description}</p>
    ) : null}
  </div>
)

const PreviousStep = ({ children }: Readonly<{ children: ReactNode }>) => (
  <WizardPrevious>
    <ArrowLeftIcon aria-hidden="true" />
    {children}
  </WizardPrevious>
)

const NextStep = ({ children }: Readonly<{ children: ReactNode }>) => (
  <WizardNext>
    {children}
    <ArrowRightIcon aria-hidden="true" />
  </WizardNext>
)

const stepsOf = ({
  descriptions,
  icons,
  lockedSteps,
}: Pick<
  WizardControls,
  'descriptions' | 'icons' | 'lockedSteps'
>): WizardStep[] =>
  dealSteps.map(({ description, icon, ...step }, index) => ({
    ...step,
    description: descriptions ? description : undefined,
    disabled: lockedSteps && index > 1,
    icon: icons ? icon : undefined,
  }))

const ControlledWizard = ({
  descriptions,
  footer,
  icons,
  label,
  lockedSteps,
  nextLabel,
  previousLabel,
  value: initialValue,
}: Readonly<WizardControls>) => {
  const [value, setValue] = useState(initialValue)
  const steps = stepsOf({ descriptions, icons, lockedSteps })

  return (
    <Wizard
      label={label || 'Etapas do cupom'}
      onValueChange={setValue}
      steps={steps}
      value={value}
    >
      <StepIntro step={steps.find((step) => step.value === value)} />
      {footer ? (
        <WizardFooter>
          <PreviousStep>{previousLabel || 'Anterior'}</PreviousStep>
          <NextStep>{nextLabel || 'Próximo'}</NextStep>
        </WizardFooter>
      ) : null}
    </Wizard>
  )
}

export const ComposedWizard = (props: Readonly<WizardControls>) => (
  <ControlledWizard {...props} key={props.value} />
)

interface FooterWizardProps {
  footer: (value: string) => ReactNode
  initialValue: string
}

const FooterWizard = ({
  footer,
  initialValue,
}: Readonly<FooterWizardProps>) => {
  const [value, setValue] = useState(initialValue)

  return (
    <Wizard
      label="Etapas do cupom"
      onValueChange={setValue}
      steps={dealSteps}
      value={value}
    >
      <StepIntro step={dealSteps.find((step) => step.value === value)} />
      <WizardFooter>{footer(value)}</WizardFooter>
    </Wizard>
  )
}

export const SubmitOnLastStepWizard = () => (
  <FooterWizard
    footer={(value) => (
      <>
        <PreviousStep>Anterior</PreviousStep>
        {value === 'review' ? (
          <Button>Criar cupom</Button>
        ) : (
          <NextStep>Próximo</NextStep>
        )}
      </>
    )}
    initialValue="review"
  />
)

export const CancelOnFirstStepWizard = () => (
  <FooterWizard
    footer={(value) => (
      <>
        {value === 'type' ? (
          <Button variant="ghost">Cancelar</Button>
        ) : (
          <PreviousStep>Anterior</PreviousStep>
        )}
        <NextStep>Próximo</NextStep>
      </>
    )}
    initialValue="type"
  />
)

export const BehaviorFooter = ({
  nextProps,
}: Readonly<{ nextProps?: WizardNextProps }>) => (
  <WizardFooter>
    <WizardPrevious>Anterior</WizardPrevious>
    <WizardNext {...nextProps}>Próximo</WizardNext>
  </WizardFooter>
)

export const JumpingWizard = () => {
  const [value, setValue] = useState('review')

  return (
    <Wizard
      label="Etapas do cupom"
      onValueChange={setValue}
      steps={behaviorSteps}
      value={value}
    >
      {value === 'review' ? (
        <Button onClick={() => setValue('type')} variant="outline">
          Editar tipo
        </Button>
      ) : (
        <p>Conteúdo</p>
      )}
    </Wizard>
  )
}
