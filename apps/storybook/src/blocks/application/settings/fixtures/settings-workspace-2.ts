import type {
  SettingsWorkspace2Invitation,
  SettingsWorkspace2Member,
  SettingsWorkspace2Role,
  SettingsWorkspace2Seats,
} from '@tc96/ui/blocks/application/settings/workspace/settings-workspace-2'

export interface SettingsWorkspace2Team {
  invitations: SettingsWorkspace2Invitation[]
  members: SettingsWorkspace2Member[]
}

export const team: SettingsWorkspace2Team = {
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

export const roles: SettingsWorkspace2Role[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Leitor', value: 'viewer' },
]

export const seats: SettingsWorkspace2Seats = { limit: 10, plan: 'Pro' }
