import type {
  SettingsRolePermission1Capability,
  SettingsRolePermission1Role,
} from '@tc96/ui/blocks/application/settings/role-permission/settings-role-permission-1'

export const roles: SettingsRolePermission1Role[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Leitor', value: 'viewer' },
]

export const capabilitiesByRole: Record<
  string,
  SettingsRolePermission1Capability[]
> = {
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

export const capabilities =
  capabilitiesByRole.editor as SettingsRolePermission1Capability[]

export type RolePermissions = {
  capabilities: SettingsRolePermission1Capability[]
  role: string
  roles: SettingsRolePermission1Role[]
}

export const rolePermissions: RolePermissions = {
  capabilities,
  role: 'editor',
  roles,
}
