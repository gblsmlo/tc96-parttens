import {
  BriefcaseIcon,
  EnvelopeSimpleIcon,
  GavelIcon,
  PhoneIcon,
  RadioButtonIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type {
  SelectPropertyGroup,
  SelectPropertyOption,
} from '@tc96/ui/patterns'

export const activityOptions: SelectPropertyOption[] = [
  { icon: UsersIcon, label: 'Reunião', tone: 'info', value: 'meeting' },
  { icon: PhoneIcon, label: 'Ligação', tone: 'success', value: 'call' },
  {
    icon: EnvelopeSimpleIcon,
    label: 'E-mail',
    tone: 'neutral',
    value: 'email',
  },
  { icon: RadioButtonIcon, label: 'Outro', tone: 'neutral', value: 'other' },
]

export const withoutIcons = (
  options: readonly SelectPropertyOption[],
): SelectPropertyOption[] =>
  options.map(({ label, value }) => ({ label, value }))

export const groupActivities = (
  options: readonly SelectPropertyOption[],
): SelectPropertyGroup[] => {
  const pick = (...values: string[]) =>
    options.filter((option) => values.includes(option.value))

  return [
    { label: 'Presencial', options: pick('meeting') },
    { label: 'Remoto', options: pick('call', 'email') },
    { label: 'Outros', options: pick('other') },
  ]
}

export const meetingTemplateGroups: SelectPropertyGroup[] = [
  {
    label: 'Reuniões',
    options: [
      { icon: UsersIcon, label: 'Primeira reunião', value: 'meeting_first' },
      { icon: UsersIcon, label: 'Reunião de retorno', value: 'meeting_return' },
    ],
  },
  {
    label: 'Audiências',
    options: [
      { icon: GavelIcon, label: 'Audiência de conciliação', value: 'hearing' },
      { icon: BriefcaseIcon, label: 'Despacho com juiz', value: 'dispatch' },
    ],
  },
]

export const frequencyOptions: SelectPropertyOption[] = [
  { label: 'Diariamente', value: 'daily' },
  { label: 'Semanalmente', value: 'weekly' },
  { label: 'Mensalmente', value: 'monthly' },
]
