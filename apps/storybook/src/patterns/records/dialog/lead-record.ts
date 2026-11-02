import type { SelectPropertyOption } from '@tc96/parttens'

export type LeadStage = 'new' | 'contacted' | 'qualified'

export type LeadSource = 'referral' | 'website' | 'ads' | 'event' | 'outbound'

export type LeadNextAction =
  | 'call'
  | 'email'
  | 'meeting'
  | 'proposal'
  | 'follow-up'

export interface NewLead {
  description: string
  nextAction: LeadNextAction | null
  ownerId: string | null
  source: LeadSource | null
  stage: LeadStage
  title: string
}

export const leadStageOptions = [
  { label: 'Novo', value: 'new' },
  { label: 'Contatado', value: 'contacted' },
  { label: 'Qualificado', value: 'qualified' },
] as const satisfies readonly (SelectPropertyOption & { value: LeadStage })[]

export const leadSourceOptions = [
  { label: 'Indicação', value: 'referral' },
  { label: 'Site', value: 'website' },
  { label: 'Anúncio', value: 'ads' },
  { label: 'Evento', value: 'event' },
  { label: 'Prospecção ativa', value: 'outbound' },
] as const satisfies readonly (SelectPropertyOption & { value: LeadSource })[]

export const leadNextActionOptions = [
  { label: 'Ligar', value: 'call' },
  { label: 'Enviar e-mail', value: 'email' },
  { label: 'Agendar reunião', value: 'meeting' },
  { label: 'Enviar proposta', value: 'proposal' },
  { label: 'Fazer follow-up', value: 'follow-up' },
] as const satisfies readonly (SelectPropertyOption & {
  value: LeadNextAction
})[]

export const isLeadStage = (value: string): value is LeadStage =>
  leadStageOptions.some((option) => option.value === value)

export const isLeadSource = (value: string): value is LeadSource =>
  leadSourceOptions.some((option) => option.value === value)

export const isLeadNextAction = (value: string): value is LeadNextAction =>
  leadNextActionOptions.some((option) => option.value === value)
