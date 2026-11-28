import type {
  RecordGroup7CatalogLabels,
  RecordGroup7LabelsOverride,
  RecordGroup7Record,
} from '@tc96/ui/blocks/application/record-group/record-group-7'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const billingTimeZone = 'UTC'

export const billingIssuedAt = '2026-10-09T12:00:00.000Z'

export const initialBilling: RecordGroup7Record = {
  dueAt: '2026-10-10T12:00:00.000Z',
  issuedAt: null,
  method: null,
}

export const billingCatalogLabels: RecordGroup7CatalogLabels = {
  method: { boleto: 'Boleto', card: 'Cartão', pix: 'Pix' },
}

export const billingLabels: RecordGroup7LabelsOverride = {
  date: ptBRPropertyLabels.date,
  fields: { dueAt: 'Vencimento', issuedAt: 'Emissão', method: 'Meio' },
  issue: 'Emitir cobrança',
  issuedOn: (date) => `Emitida em ${date}`,
  noMethod: 'Sem meio',
  notIssued: 'Não emitida',
  reissue: 'Emitir segunda via',
  select: ptBRPropertyLabels.select,
  title: 'Cobrança',
}
