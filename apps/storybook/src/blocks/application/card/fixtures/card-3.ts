import type { Card3Profile } from '@tc96/blocks/application/card/card-3'

export const profile: Card3Profile = {
  availability: { label: 'Disponível', tone: 'success' },
  id: 'marina',
  name: 'Marina Costa',
  role: 'Designer de produto',
  stats: [
    { id: 'projects', label: 'Projetos', value: 24 },
    { id: 'followers', label: 'Seguidores', value: 1280 },
    { id: 'following', label: 'Seguindo', value: 312 },
  ],
}
