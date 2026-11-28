import type {
  RecordPreview4CatalogLabels,
  RecordPreview4LabelsOverride,
  RecordPreview4Person,
  RecordPreview4Record,
} from '@tc96/ui/blocks/application/record-preview/record-preview-4'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const lawsuitCatalogLabels: RecordPreview4CatalogLabels = {
  instance: {
    'first-degree': '1º grau',
    other: 'Outra',
    'second-degree': '2º grau',
    superior: 'Tribunal superior',
    supreme: 'STF',
  },
  justice: { federal: 'Federal', labor: 'Trabalho', state: 'Estadual' },
  phase: {
    appeal: 'Apelação',
    archiving: 'Arquivamento',
    'awaiting-judgment': 'Aguardando sentença',
    'conciliation-hearing': 'Audiência de conciliação',
    'funds-release': 'Levantamento de valores',
    'initial-order': 'Despacho inicial',
    'interlocutory-appeal': 'Agravo de instrumento',
    'judgment-enforcement': 'Cumprimento de sentença',
    'sanitation-order': 'Despacho saneador',
    'small-claims-appeal': 'Recurso inominado',
    summons: 'Citação',
    'trial-hearing': 'Audiência de instrução e julgamento',
  },
  smallClaims: { no: 'Não', yes: 'Sim' },
}

export const lawsuitPreviewLabels: RecordPreview4LabelsOverride = {
  close: 'Fechar detalhes',
  copyId: 'Copiar ID',
  copyNumber: 'Copiar número',
  expand: 'Abrir em tela completa',
  fields: {
    actionClass: 'Ação',
    caseNumber: 'Número',
    claimAmount: 'Valor',
    contract: 'Contrato',
    court: 'Tribunal',
    createdAt: 'Criado em',
    defendant: 'Réu',
    division: 'Vara',
    instance: 'Instância',
    justice: 'Justiça',
    phase: 'Fase',
    plaintiff: 'Autor',
    responsible: 'Responsável',
    smallClaims: 'Juizado',
    subject: 'Objeto',
    updatedAt: 'Atualizado em',
    venue: 'Foro',
  },
  groups: {
    lawsuit: 'Informações do processo',
    properties: 'Propriedades',
    record: 'Registros',
  },
  noAction: 'Sem ação',
  noAmount: 'Sem valor',
  noContract: 'Sem contrato',
  noCourt: 'Sem tribunal',
  noDivision: 'Sem vara',
  noInstance: 'Sem instância',
  noJustice: 'Sem justiça',
  noNumber: 'sem número',
  noPhase: 'Sem fase',
  noResponsible: 'Sem responsável',
  noSubject: 'Sem objeto',
  noVenue: 'Sem foro',
  notInformed: 'Não informado',
  select: ptBRPropertyLabels.select,
  tagPicker: ptBRPropertyLabels.tags,
  tagsPlaceholder: 'Adicionar uma tag',
  text: ptBRPropertyLabels.text,
}

export const lawsuitContracts: readonly PropertyOption[] = [
  { label: 'Honorários 2026/014', value: 'contract-14' },
  { label: 'Êxito 2026/021', value: 'contract-21' },
]

export const lawsuitCourts: readonly PropertyOption[] = [
  { label: 'TJSP', value: 'tjsp' },
  { label: 'TJCE', value: 'tjce' },
  { label: 'TRT-2', value: 'trt2' },
]

export const lawsuitTags: readonly PropertyOption[] = [
  { label: 'Urgente', tone: 'danger', value: 'urgent' },
  { label: 'Cliente', tone: 'info', value: 'client' },
  { label: 'Prazo', tone: 'warning', value: 'deadline' },
]

export const lawsuitPeople: readonly RecordPreview4Person[] = [
  { fallback: 'AL', label: 'Ana Lima', value: 'ana' },
  { fallback: 'BR', label: 'Bruno Reis', value: 'bruno' },
]

export const lawsuitRecord: RecordPreview4Record = {
  actionClass: 'Procedimento Comum Cível (7)',
  caseNumber: '0001000-21.2026.8.26.0100',
  claimAmountCents: 1_000_000,
  contractId: 'contract-14',
  courtDivision: '1ª Vara Cível',
  courtSlug: 'tjsp',
  courtVenue: 'São Paulo',
  createdAt: '2026-10-01T12:00:00.000Z',
  defendants: ['Acme Construções'],
  description: 'Cobrança das parcelas em atraso do contrato de empreitada.',
  id: 'lawsuit_0042',
  instance: 'first-degree',
  justice: 'state',
  phaseId: 'initial-order',
  plaintiffs: ['Ada Lovelace', 'Grace Hopper'],
  responsibleId: 'ana',
  smallClaims: false,
  subject: 'Indenização por Dano Material (7780)',
  tagIds: ['urgent', 'client'],
  title: 'Ação de cobrança',
  updatedAt: '2026-11-01T12:00:00.000Z',
}

export const LAWSUIT_TIME_ZONE = 'America/Sao_Paulo'
