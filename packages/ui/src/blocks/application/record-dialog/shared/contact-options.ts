import {
  CircleIcon,
  HandshakeIcon,
  ProhibitInsetIcon,
  RadioButtonIcon,
} from '@phosphor-icons/react'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { ContactDialogStage, ContactDialogTag } from './contact-types'

export const contactStageOptions = [
  { icon: CircleIcon, label: 'Sem etapa', tone: 'neutral', value: 'none' },
  {
    icon: RadioButtonIcon,
    label: 'Qualificado',
    tone: 'info',
    value: 'qualified',
  },
  { icon: HandshakeIcon, label: 'Cliente', tone: 'success', value: 'customer' },
  {
    icon: ProhibitInsetIcon,
    label: 'Inativo',
    tone: 'warning',
    value: 'inactive',
  },
] as const satisfies readonly (PropertyOption & {
  value: ContactDialogStage
})[]

export const contactTagOptions: readonly PropertyOption<ContactDialogTag>[] = [
  { label: 'Decisor', value: 'decision-maker' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Evento', value: 'event' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'VIP', value: 'vip' },
]

export const isContactDialogStage = (
  value: string,
): value is ContactDialogStage =>
  contactStageOptions.some((option) => option.value === value)

export const isContactDialogTag = (value: string): value is ContactDialogTag =>
  contactTagOptions.some((option) => option.value === value)
