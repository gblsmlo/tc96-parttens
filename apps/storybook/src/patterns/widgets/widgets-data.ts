export const periodOptions = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

export type RevenuePeriod = (typeof periodOptions)[number]['value']

export const periodMultiplier: Record<RevenuePeriod, number> = {
  month: 1,
  quarter: 3,
}

export interface Order {
  customer: string
  id: string
  total: number
}

export const orders: readonly Order[] = [
  { customer: 'Ana Martins', id: '4821', total: 128.4 },
  { customer: 'Gabriel Melo', id: '4820', total: 342.9 },
  { customer: 'Marina Souza', id: '4819', total: 59.5 },
  { customer: 'Rafael Lima', id: '4818', total: 210 },
  { customer: 'Beatriz Alves', id: '4817', total: 87.25 },
  { customer: 'Caio Ramos', id: '4816', total: 460.8 },
  { customer: 'Helena Prado', id: '4815', total: 73.1 },
  { customer: 'Tiago Nunes', id: '4814', total: 199.99 },
]
