import type {
  Settings6Invitation,
  Settings6Member,
  Settings6Role,
  Settings6Seats,
} from '@tc96/ui/blocks/application/settings/settings-6'

export interface Settings6Team {
  invitations: Settings6Invitation[]
  members: Settings6Member[]
}

export const team: Settings6Team = {
  invitations: [
    { email: 'diego@acme.com', id: 'i1', role: 'viewer', sent: '12 nov' },
  ],
  members: [
    {
      email: 'ana@acme.com',
      id: 'm1',
      initials: 'AR',
      name: 'Ana Ribeiro',
      role: 'owner',
    },
    {
      email: 'bruno@acme.com',
      id: 'm2',
      initials: 'BC',
      name: 'Bruno Costa',
      role: 'editor',
    },
    {
      email: 'carla@acme.com',
      id: 'm3',
      initials: 'CM',
      name: 'Carla Mendes',
      role: 'viewer',
    },
  ],
}

export const roles: Settings6Role[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Leitor', value: 'viewer' },
]

export const seats: Settings6Seats = { limit: 10, plan: 'Pro' }
