import type {
  RecordGroup8CatalogLabels,
  RecordGroup8LabelsOverride,
  RecordGroup8Link,
  RecordGroup8Record,
} from '@tc96/ui/blocks/application/record-group/record-group-8'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const initialStage: RecordGroup8Record = {
  interest: 'banking',
  urgency: null,
}

export const stageLink: RecordGroup8Link = {
  href: '#/agenda/consulta-inicial',
  label: 'Consulta inicial',
  meta: 'Agendada · 14/10 às 10:00',
}

export const stageCatalogLabels: RecordGroup8CatalogLabels = {
  interest: {
    banking: 'Revisional bancária',
    family: 'Família',
    labor: 'Trabalhista',
  },
  urgency: { high: 'Alta', low: 'Baixa', medium: 'Média' },
}

export const stageLabels: RecordGroup8LabelsOverride = {
  fields: { interest: 'Interesse', urgency: 'Urgência' },
  noInterest: 'Sem interesse',
  noUrgency: 'Sem urgência',
  select: ptBRPropertyLabels.select,
  title: 'Novo Lead',
}
