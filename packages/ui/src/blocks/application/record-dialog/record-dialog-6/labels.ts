import type { RecordDialog6Labels } from './types'

export const defaultRecordDialog6Labels: RecordDialog6Labels = {
  cancel: 'Cancelar',
  description: 'Preencha cada seção antes de criar o processo.',
  fields: {
    action: { fallback: 'Adicionar ação', label: 'Ação' },
    contract: { fallback: 'Vincular contrato', label: 'Contrato' },
    division: { fallback: 'Adicionar vara', label: 'Vara' },
    instance: { fallback: 'Escolher instância', label: 'Instância' },
    monitor: { fallback: '', label: 'Monitorar' },
    number: { fallback: 'Adicionar número', label: 'Número' },
    owner: { fallback: 'Escolher responsável', label: 'Responsável' },
    partyContact: { fallback: 'Escolher contato', label: 'Contato' },
    partyName: { fallback: 'Adicionar nome', label: 'Nome' },
    partyRole: { fallback: 'Escolher papel', label: 'Papel' },
    phase: { fallback: 'Escolher fase', label: 'Fase' },
    subject: { fallback: 'Adicionar objeto', label: 'Objeto' },
    venue: { fallback: 'Adicionar foro', label: 'Foro' },
  },
  sections: {
    lawsuit: {
      description: 'Número, ação e onde o processo corre.',
      title: 'Processo',
    },
    office: {
      description: 'Quem acompanha o processo no escritório.',
      title: 'Escritório',
    },
    party: {
      description: 'Quem participa do processo e em qual papel.',
      title: 'Partes',
    },
    settings: {
      description: 'Como o processo é acompanhado no tribunal.',
      title: 'Configurações',
    },
  },
  statusDone: 'Concluída',
  statusPending: 'Pendente',
  statusProgress: 'Em andamento',
  submit: 'Criar processo',
  submitting: 'Criando',
  title: 'Processo manual',
  titleAncestor: 'Processos',
}

export function resolveRecordDialog6Labels(
  labels: Partial<RecordDialog6Labels> | undefined,
): RecordDialog6Labels {
  const base = defaultRecordDialog6Labels
  return {
    ...base,
    ...labels,
    fields: { ...base.fields, ...labels?.fields },
    sections: { ...base.sections, ...labels?.sections },
  }
}
