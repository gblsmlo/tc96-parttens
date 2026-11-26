import type {
  RecordDialog6Person,
  RecordDialog6Values,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-6'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'

export const recordDialog6Clients: readonly RecordDialog6Person[] = [
  { fallback: 'AL', label: 'Ada Lovelace', value: 'ada' },
  { fallback: 'GH', label: 'Grace Hopper', value: 'grace' },
  { fallback: 'KJ', label: 'Katherine Johnson', value: 'katherine' },
]

export const recordDialog6Owners: readonly RecordDialog6Person[] = [
  { fallback: 'AA', label: 'Admin Acme', value: 'admin' },
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
]

export const recordDialog6PhaseOptions: readonly PropertyOption[] = [
  { label: 'Despacho inicial', value: 'initial' },
  { label: 'Instrução', value: 'discovery' },
  { label: 'Sentença', value: 'judgment' },
  { label: 'Recurso', value: 'appeal' },
]

export const recordDialog6InstanceOptions: readonly PropertyOption[] = [
  { label: '1º grau', value: 'first' },
  { label: '2º grau', value: 'second' },
  { label: 'Tribunais superiores', value: 'superior' },
]

export const recordDialog6PartyRoleOptions: readonly PropertyOption[] = [
  { label: 'Cliente', value: 'client' },
  { label: 'Parte contrária', value: 'opposing' },
  { label: 'Testemunha', value: 'witness' },
  { label: 'Correspondente', value: 'correspondent' },
  { label: 'Indicação', value: 'referral' },
]

export const recordDialog6ContractOptions: readonly PropertyOption[] = [
  { label: 'Contrato de honorários 2025/014', value: 'fee-2025-014' },
  { label: 'Contrato de êxito 2025/021', value: 'success-2025-021' },
]

export const recordDialog6InitialValues: Partial<RecordDialog6Values> = {
  instance: 'first',
  monitor: true,
  owner: 'admin',
  phase: 'initial',
}
