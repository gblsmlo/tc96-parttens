import type {
  RecordGroup3CatalogLabels,
  RecordGroup3LabelsOverride,
  RecordGroup3Record,
} from '@tc96/ui/blocks/application/record-group/record-group-3'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const contactDetails: RecordGroup3Record = {
  birthDate: '1988-03-14T12:00:00.000Z',
  cpf: '123.456.789-09',
  occupation: null,
  source: 'referral',
}

export const detailsCatalogLabels: RecordGroup3CatalogLabels = {
  source: { google: 'Google', instagram: 'Instagram', referral: 'Indicação' },
}

export const detailsLabels: RecordGroup3LabelsOverride = {
  date: ptBRPropertyLabels.date,
  fields: {
    birthDate: 'Nascimento',
    cpf: 'CPF',
    occupation: 'Profissão',
    source: 'Origem',
  },
  copyCpf: 'Copiar CPF',
  noOccupation: 'Sem profissão',
  text: ptBRPropertyLabels.text,
  title: 'Mais informações',
}
