import type { SelectPropertyOption } from '@tc96/parttens'

export type ImportSource = 'datajud' | 'court' | 'djen'

export type ImportStatus = 'loading' | 'success' | 'error'

export type ProcessPole = 'active' | 'passive'

export type PartyRole = 'client' | 'opponent' | 'third'

export interface ProcessLawyer {
  name: string
  oab: string
}

export interface RawParty {
  lawyers: readonly ProcessLawyer[]
  name: string
  pole: ProcessPole
  role: PartyRole
}

export interface ProcessParty {
  id: string
  name: string
  pole: ProcessPole
  role: PartyRole
  suspectedLawyer: boolean
}

export interface PoleLawyer extends ProcessLawyer {
  pole: ProcessPole
}

export interface ProcessFields {
  action: string | null
  className: string | null
  contractId: string | null
  court: string | null
  division: string | null
  forum: string | null
  instance: string | null
  ownerId: string | null
  phase: string | null
  subject: string | null
}

export type ProcessField = keyof ProcessFields

export interface ImportedData {
  fields: Partial<ProcessFields>
  lawyers: PoleLawyer[]
  parties: ProcessParty[]
}

export const importSources = ['datajud', 'court', 'djen'] as const

export const importSourceLabels: Record<ImportSource, string> = {
  court: 'Tribunal',
  datajud: 'DataJud',
  djen: 'DJEN',
}

export const importSourceGroups: Record<ImportSource, string> = {
  court: 'Órgão',
  datajud: 'Identificação',
  djen: 'Partes',
}

export const sourceFields: Record<ImportSource, readonly ProcessField[]> = {
  court: ['court', 'forum', 'division', 'instance'],
  datajud: ['className', 'action', 'subject'],
  djen: [],
}

export const processNumber = '0281410-27.2024.8.06.0001'

const clientLawyers = [
  { name: 'JULIANA PRADO NUNES', oab: '31773/CE' },
  { name: 'LÍVIA SANTOS ARAÚJO', oab: '38230/CE' },
  { name: 'RAFAEL MOTA BRAGA', oab: '16477/CE' },
] as const satisfies readonly ProcessLawyer[]

export const rawImport = {
  court: {
    court: 'TJCE',
    division: '1º GABINETE DA 1ª CÂMARA DE DIREITO PRIVADO',
    forum: null,
    instance: 'second',
  },
  datajud: {
    action: 'INDENIZAÇÃO POR DANO MORAL',
    className: 'APELAçãO CíVEL',
    subject: 'RESPONSABILIDADE CIVIL',
  },
  djen: [
    {
      lawyers: clientLawyers,
      name: 'MARIA HELENA DUARTE CAMPOS',
      pole: 'active',
      role: 'client',
    },
    {
      lawyers: [],
      name: 'RAFAEL MOTA BRAGA',
      pole: 'passive',
      role: 'opponent',
    },
    {
      lawyers: clientLawyers,
      name: 'LÍVIA SANTOS ARAÚJO',
      pole: 'active',
      role: 'client',
    },
    {
      lawyers: clientLawyers,
      name: 'JULIANA PRADO NUNES',
      pole: 'active',
      role: 'client',
    },
    {
      lawyers: [{ name: 'PEDRO ALVES TEIXEIRA', oab: '20450/CE' }],
      name: 'BANCO AURORA S.A.',
      pole: 'passive',
      role: 'opponent',
    },
  ],
} as const satisfies {
  court: Partial<ProcessFields>
  datajud: Partial<ProcessFields>
  djen: readonly RawParty[]
}

export const instanceOptions = [
  { label: '1º grau', value: 'first' },
  { label: '2º grau', value: 'second' },
  { label: 'Tribunal superior', value: 'superior' },
] as const satisfies readonly SelectPropertyOption[]

export const phaseOptions = [
  { label: 'Despacho inicial', value: 'initial' },
  { label: 'Instrução', value: 'discovery' },
  { label: 'Sentença', value: 'ruling' },
  { label: 'Recurso', value: 'appeal' },
] as const satisfies readonly SelectPropertyOption[]

export const contractOptions = [
  { label: 'Honorários 2024/031', value: 'c-031' },
  { label: 'Êxito 2024/047', value: 'c-047' },
] as const satisfies readonly SelectPropertyOption[]

export const poleLabels: Record<ProcessPole, string> = {
  active: 'Polo ativo',
  passive: 'Polo passivo',
}

export const poleOptions = [
  { label: 'Autor', value: 'active' },
  { label: 'Réu', value: 'passive' },
] as const satisfies readonly { label: string; value: ProcessPole }[]

export const lawyerRoleLabels: Record<ProcessPole, string> = {
  active: 'Advogado do autor',
  passive: 'Advogado do réu',
}

export const isProcessPole = (value: string): value is ProcessPole =>
  poleOptions.some((option) => option.value === value)

export const fieldLabels: Record<ProcessField, string> = {
  action: 'Ação',
  className: 'Classe',
  contractId: 'Contrato',
  court: 'Tribunal',
  division: 'Vara',
  forum: 'Foro',
  instance: 'Instância',
  ownerId: 'Responsável',
  phase: 'Fase',
  subject: 'Objeto',
}

const lowercaseParticles = new Set([
  'a',
  'com',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'na',
  'no',
  'para',
  'por',
])

export function toDisplayCase(value: string) {
  return value
    .toLocaleLowerCase('pt-BR')
    .split(' ')
    .map((word, index) => {
      if (word.includes('.')) return word.toLocaleUpperCase('pt-BR')
      if (index > 0 && lowercaseParticles.has(word)) return word
      return word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1)
    })
    .join(' ')
}

export function normalizeParties(raw: readonly RawParty[]): {
  lawyers: PoleLawyer[]
  parties: ProcessParty[]
} {
  const lawyers = new Map<string, PoleLawyer>()
  for (const party of raw) {
    for (const lawyer of party.lawyers) {
      lawyers.set(`${party.pole}:${lawyer.oab}`, {
        name: toDisplayCase(lawyer.name),
        oab: lawyer.oab,
        pole: party.pole,
      })
    }
  }
  const lawyerNames = new Set(
    [...lawyers.values()].map((lawyer) => lawyer.name),
  )
  const parties = raw.map((party, index) => {
    const name = toDisplayCase(party.name)
    return {
      id: `party-${index}`,
      name,
      pole: party.pole,
      role: party.role,
      suspectedLawyer: lawyerNames.has(name),
    }
  })
  return { lawyers: [...lawyers.values()], parties }
}

export function normalizeSource(source: ImportSource): ImportedData {
  if (source === 'djen') {
    return { fields: {}, ...normalizeParties(rawImport.djen) }
  }
  const fields = Object.fromEntries(
    Object.entries(rawImport[source]).map(([key, value]) => [
      key,
      typeof value === 'string' && key !== 'instance' && key !== 'court'
        ? toDisplayCase(value)
        : value,
    ]),
  )
  return { fields, lawyers: [], parties: [] }
}

export function processTitle(
  draft: Readonly<{
    className: string | null
    parties: readonly ProcessParty[]
  }>,
) {
  const client = draft.parties.find(
    (party) => party.role === 'client' && !party.suspectedLawyer,
  )
  return [draft.className, client?.name].filter(Boolean).join(' · ')
}

export const emptyFields: ProcessFields = {
  action: null,
  className: null,
  contractId: null,
  court: null,
  division: null,
  forum: null,
  instance: null,
  ownerId: 'ana',
  phase: 'initial',
  subject: null,
}

export interface NewProcess {
  fields: ProcessFields
  lawyers: PoleLawyer[]
  number: string
  parties: ProcessParty[]
  title: string
}
