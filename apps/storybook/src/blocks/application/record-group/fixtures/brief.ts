import type {
  RecordGroup4CatalogLabels,
  RecordGroup4LabelsOverride,
} from '@tc96/ui/blocks/application/record-group/record-group-4'
import type {
  RecordGroup5CatalogLabels,
  RecordGroup5LabelsOverride,
} from '@tc96/ui/blocks/application/record-group/record-group-5'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export interface BriefValues {
  expectedTarget: string | null
  primaryObjective: string | null
  secondaryObjective: string | null
}

export interface BriefVersion {
  number: number
  savedAt: string
  status: 'draft' | 'published'
  values: BriefValues
}

export const today = '09/10/2026'

export const briefCatalogLabels = {
  objective: {
    'new-appointments': 'Gerar novas consultas',
    'practice-area': 'Divulgar área de atuação',
    referrals: 'Fortalecer indicação',
  },
  status: { draft: 'Rascunho', published: 'Publicada' },
  target: {
    'booked-appointment': 'Consulta agendada',
    'whatsapp-conversation': 'Conversa no WhatsApp',
  },
} satisfies RecordGroup4CatalogLabels & RecordGroup5CatalogLabels

const briefFieldLabels = {
  empty: {
    expectedTarget: 'Sem alvo esperado',
    primaryObjective: 'Sem objetivo 1',
    secondaryObjective: 'Sem objetivo 2',
  },
  fields: {
    expectedTarget: 'Alvo esperado',
    primaryObjective: 'Objetivo 1',
    secondaryObjective: 'Objetivo 2',
  },
}

export const briefingLabels: RecordGroup4LabelsOverride = {
  ...briefFieldLabels,
  close: 'Fechar',
  draftSaved: (savedAt) => `Rascunho salvo em ${savedAt}`,
  publish: 'Publicar versão',
  published: (number, savedAt) => `Versão ${number} publicada em ${savedAt}`,
  saveDraft: 'Salvar rascunho',
  select: ptBRPropertyLabels.select,
  title: 'Briefing',
  unsaved: 'Alterações não salvas',
}

export const versionsLabels: RecordGroup5LabelsOverride = {
  ...briefFieldLabels,
  close: 'Fechar',
  draftSaved: (savedAt) => `Rascunho salvo em ${savedAt}`,
  fieldOfVersion: (field, number) => `${field} da versão ${number}`,
  publishedOn: (savedAt) => `Publicada em ${savedAt}`,
  select: ptBRPropertyLabels.select,
  title: 'Versões',
  version: (number) => `Versão ${number}`,
}

export const initialVersions: readonly BriefVersion[] = [
  {
    number: 2,
    savedAt: '08/10/2026',
    status: 'draft',
    values: {
      expectedTarget: 'whatsapp-conversation',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
  {
    number: 1,
    savedAt: '26/09/2026',
    status: 'published',
    values: {
      expectedTarget: 'booked-appointment',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
]
