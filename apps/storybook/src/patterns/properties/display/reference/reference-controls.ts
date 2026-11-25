import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant, ReferencePropertyKind } from '@tc96/ui/patterns'

export const referenceKinds = [
  'account',
  'product',
  'record',
] as const satisfies readonly ReferencePropertyKind[]

export const referenceVariants = [
  'badge',
  'plain',
] as const satisfies readonly PropertyVariant[]

export interface ReferenceControls {
  ariaLabel: string
  kind: ReferencePropertyKind
  label: string
  variant: PropertyVariant
}

export const referenceControlArgs: ReferenceControls = {
  ariaLabel: '',
  kind: 'record',
  label: 'Lead autorizado',
  variant: 'badge',
}

export const referenceControlArgTypes: Partial<ArgTypes<ReferenceControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `ReferenceProperty`: with text, the chip reads as one image named `<ariaLabel>: <label>`; empty passes nothing.',
  },
  kind: {
    control: 'inline-radio',
    description: 'The `kind` of `ReferenceProperty`: picks the icon.',
    options: referenceKinds,
  },
  label: {
    control: 'text',
    description: 'The `label` of `ReferenceProperty`.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `ReferenceProperty`.',
    options: referenceVariants,
  },
}
