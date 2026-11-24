import type { RecordStatus, SelectPropertyOption } from '@tc96/parttens'

export type LawsuitLookup = 'fast' | 'slow' | 'failing' | 'duplicate'

export type LawsuitStep = 'origin' | 'details' | 'case'

export type LawsuitSourceId = 'djen' | 'datajud' | 'court'

export type LawsuitField = 'action' | 'subject' | 'court' | 'venue' | 'division'

export interface LawsuitSource {
  elapsed: number
  id: LawsuitSourceId
  status: RecordStatus
}

export interface LawsuitParty {
  name: string
  pole: string
}

export interface LawsuitValues {
  action: string | null
  clientId: string | null
  court: string | null
  division: string | null
  instance: string
  monitor: boolean
  number: string
  ownerId: string | null
  phase: string
  subject: string | null
  title: string
  venue: string | null
}

export const LAWSUIT_NUMBER_DIGITS = 20

export const lawsuitDigits = (value: string) => value.replace(/\D/g, '').length

export const existingLawsuit = {
  number: '9990010-14.2025.8.26.9999',
  owner: 'Admin Acme',
  title: 'Ação de cobrança contra Comercial Aurora Ltda',
}

export const sampleLawsuitNumber = '9990011-96.2025.8.26.9999'

export const lawsuitSourceNames: Record<LawsuitSourceId, string> = {
  court: 'Tribunal',
  datajud: 'DataJud',
  djen: 'DJEN',
}

export const lawsuitSourceOf: Record<LawsuitField, LawsuitSourceId> = {
  action: 'datajud',
  court: 'djen',
  division: 'djen',
  subject: 'datajud',
  venue: 'court',
}

export const lawsuitFieldLabels: Record<
  LawsuitField,
  { fallback: string; label: string }
> = {
  action: { fallback: 'Adicionar ação', label: 'Ação' },
  court: { fallback: 'Adicionar tribunal', label: 'Tribunal' },
  division: { fallback: 'Adicionar vara', label: 'Vara' },
  subject: { fallback: 'Adicionar objeto', label: 'Objeto' },
  venue: { fallback: 'Adicionar foro', label: 'Foro' },
}

export const lawsuitSourceResults: Record<
  LawsuitSourceId,
  Partial<Record<LawsuitField, string>>
> = {
  court: {},
  datajud: {
    action: 'Procedimento Comum Cível',
    subject: 'Contratos bancários',
  },
  djen: { court: 'TJSP', division: '1ª Vara Cível' },
}

export const lawsuitParties: readonly LawsuitParty[] = [
  { name: 'Ada Lovelace', pole: 'Polo ativo' },
  { name: 'Comercial Aurora Ltda', pole: 'Polo passivo' },
]

export const lawsuitClients = [
  { fallback: 'AL', label: 'Ada Lovelace', value: 'ada' },
  { fallback: 'GH', label: 'Grace Hopper', value: 'grace' },
  { fallback: 'KJ', label: 'Katherine Johnson', value: 'katherine' },
]

export const lawsuitOwners = [
  { fallback: 'AA', label: 'Admin Acme', value: 'admin' },
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
]

export const lawsuitPhaseOptions = [
  { label: 'Despacho inicial', value: 'initial' },
  { label: 'Instrução', value: 'discovery' },
  { label: 'Sentença', value: 'judgment' },
  { label: 'Recurso', value: 'appeal' },
] as const satisfies readonly SelectPropertyOption[]

export const lawsuitInstanceOptions = [
  { label: '1º grau', value: 'first' },
  { label: '2º grau', value: 'second' },
  { label: 'Tribunais superiores', value: 'superior' },
] as const satisfies readonly SelectPropertyOption[]

export const lawsuitPartyRoleOptions = [
  { label: 'Cliente', value: 'client' },
  { label: 'Parte contrária', value: 'opposing' },
  { label: 'Testemunha', value: 'witness' },
  { label: 'Correspondente', value: 'correspondent' },
  { label: 'Indicação', value: 'referral' },
] as const satisfies readonly SelectPropertyOption[]

export const lawsuitContractOptions = [
  { label: 'Contrato de honorários 2025/014', value: 'fee-2025-014' },
  { label: 'Contrato de êxito 2025/021', value: 'success-2025-021' },
] as const satisfies readonly SelectPropertyOption[]

export const initialLawsuitValues: LawsuitValues = {
  action: null,
  clientId: null,
  court: null,
  division: null,
  instance: 'first',
  monitor: true,
  number: '',
  ownerId: 'admin',
  phase: 'initial',
  subject: null,
  title: '',
  venue: null,
}
