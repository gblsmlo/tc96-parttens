import type {
  Settings18Capability,
  Settings18Role,
} from '@tc96/blocks/application/settings/settings-18'

export const roles: Settings18Role[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Leitor', value: 'viewer' },
]

export const capabilitiesByRole: Record<string, Settings18Capability[]> = {
  admin: [
    {
      checked: true,
      description: 'Convidar e remover pessoas do workspace.',
      id: 'manage-members',
      title: 'Gerenciar membros',
    },
    {
      checked: true,
      description: 'Alterar plano, cartão e notas fiscais.',
      id: 'manage-billing',
      title: 'Gerenciar cobrança',
    },
    {
      checked: true,
      description: 'Criar, editar e arquivar leads.',
      id: 'edit-leads',
      title: 'Editar leads',
    },
    {
      checked: true,
      description: 'Baixar listas e relatórios em CSV.',
      id: 'export-data',
      title: 'Exportar dados',
    },
  ],
  editor: [
    {
      checked: false,
      description: 'Convidar e remover pessoas do workspace.',
      id: 'manage-members',
      title: 'Gerenciar membros',
    },
    {
      checked: false,
      description: 'Alterar plano, cartão e notas fiscais.',
      id: 'manage-billing',
      title: 'Gerenciar cobrança',
    },
    {
      checked: true,
      description: 'Criar, editar e arquivar leads.',
      id: 'edit-leads',
      title: 'Editar leads',
    },
    {
      checked: true,
      description: 'Baixar listas e relatórios em CSV.',
      id: 'export-data',
      title: 'Exportar dados',
    },
  ],
  viewer: [
    {
      checked: false,
      description: 'Convidar e remover pessoas do workspace.',
      id: 'manage-members',
      title: 'Gerenciar membros',
    },
    {
      checked: false,
      description: 'Alterar plano, cartão e notas fiscais.',
      id: 'manage-billing',
      title: 'Gerenciar cobrança',
    },
    {
      checked: false,
      description: 'Criar, editar e arquivar leads.',
      id: 'edit-leads',
      title: 'Editar leads',
    },
    {
      checked: false,
      description: 'Baixar listas e relatórios em CSV.',
      id: 'export-data',
      title: 'Exportar dados',
    },
  ],
}

export const capabilities = capabilitiesByRole.editor as Settings18Capability[]

export type RolePermissions = {
  capabilities: Settings18Capability[]
  role: string
  roles: Settings18Role[]
}

export const rolePermissions: RolePermissions = {
  capabilities,
  role: 'editor',
  roles,
}
