import type { Settings19Endpoint } from '@tc96/ui/blocks/application/settings/settings-19'

export const endpoints: Settings19Endpoint[] = [
  {
    enabled: true,
    events: 12,
    id: 'ep-crm',
    lastDelivery: 'há 3 minutos',
    url: 'https://api.acme.com/hooks/crm',
  },
  {
    enabled: true,
    events: 4,
    failing: true,
    id: 'ep-billing',
    lastDelivery: 'há 2 horas',
    url: 'https://billing.acme.com/webhooks',
  },
  {
    enabled: false,
    events: 1,
    id: 'ep-staging',
    lastDelivery: 'há 9 dias',
    url: 'https://staging.acme.com/hooks',
  },
]
