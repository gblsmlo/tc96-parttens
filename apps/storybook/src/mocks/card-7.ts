import { delay, HttpResponse, http } from 'msw'
import { avatarUrl } from '../blocks/application/card/fixtures/avatar.ts'
import { apiUrl } from './api.ts'

const path = '/crm/contacts/:id/summary'

export const card7Summary = {
  contact: {
    avatarUrl: avatarUrl('Rafael Costa'),
    email: 'rafael.costa@atlasinvest.com.br',
    name: 'Rafael Costa',
    status: { label: 'Em negociação', tone: 'info' as const },
  },
  deals: [
    {
      amount: 2450000,
      id: 'atlas-seed',
      label: 'Atlas Seed II',
      stage: 'proposal' as const,
    },
    {
      amount: 980000,
      id: 'atlas-bridge',
      label: 'Ponte Atlas',
      stage: 'won' as const,
    },
    {
      amount: 410000,
      id: 'atlas-advisory',
      label: 'Consultoria Atlas',
      stage: 'lead' as const,
    },
  ],
  stats: { deals: 12, openDeals: 3, wonAmount: 5600000 },
}

export const card7Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(card7Summary)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(card7Summary)
  }),
}
