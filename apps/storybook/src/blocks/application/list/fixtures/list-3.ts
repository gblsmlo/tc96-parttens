import type {
  List3Period,
  List3Transaction,
} from '@tc96/ui/blocks/application/list/list-3'

export const transactionsByPeriod: Record<List3Period, List3Transaction[]> = {
  month: [
    {
      amount: 12500,
      date: '2026-11-20',
      description: 'Pagamento do cliente Atlas',
      id: 'atlas',
    },
    {
      amount: -4200,
      date: '2026-11-17',
      description: 'Aluguel do escritório',
      id: 'rent',
    },
    {
      amount: -249.9,
      date: '2026-11-12',
      description: 'Assinatura de software',
      id: 'software',
    },
    {
      amount: 6800,
      date: '2026-11-05',
      description: 'Pagamento do cliente Boreal',
      id: 'boreal',
    },
    {
      amount: -1350.4,
      date: '2026-11-03',
      description: 'Fornecedor de hospedagem',
      id: 'hosting',
    },
  ],
  week: [
    {
      amount: 12500,
      date: '2026-11-20',
      description: 'Pagamento do cliente Atlas',
      id: 'atlas',
    },
    {
      amount: -249.9,
      date: '2026-11-19',
      description: 'Assinatura de software',
      id: 'software',
    },
    {
      amount: 180,
      date: '2026-11-18',
      description: 'Reembolso de despesa',
      id: 'refund',
    },
    {
      amount: -4200,
      date: '2026-11-17',
      description: 'Aluguel do escritório',
      id: 'rent',
    },
  ],
  year: [
    {
      amount: 98000,
      date: '2026-09-30',
      description: 'Contrato anual Atlas',
      id: 'atlas-year',
    },
    {
      amount: -51200,
      date: '2026-08-15',
      description: 'Folha de pagamento',
      id: 'payroll',
    },
    {
      amount: 22400,
      date: '2026-06-10',
      description: 'Contrato anual Boreal',
      id: 'boreal-year',
    },
    {
      amount: -8900,
      date: '2026-03-02',
      description: 'Equipamentos de escritório',
      id: 'equipment',
    },
  ],
}

export const transactions = transactionsByPeriod.month
