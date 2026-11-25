import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsWorkspace2Labels } from './types'

export const defaultSettingsWorkspace2Labels: SettingsWorkspace2Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os membros',
  loading: 'Carregando membros',
  actions: (name) => `Ações de ${name}`,
  invitationMeta: (role, sent) => `${role} · Enviado ${sent}`,
  invitationsTitle: 'Convites pendentes',
  invite: 'Convidar membros',
  memberRole: (name) => `Papel de ${name}`,
  owner: 'Proprietário',
  pending: 'Pendente',
  removeMember: 'Remover do workspace',
  resendInvitation: 'Reenviar convite',
  revokeInvitation: 'Revogar convite',
  seats: (used, limit, plan) =>
    `${used} de ${limit} vagas usadas no plano ${plan}.`,
  title: 'Membros',
}
