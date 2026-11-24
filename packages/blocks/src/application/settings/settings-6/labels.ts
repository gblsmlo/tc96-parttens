import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings6Labels } from './types'

export const defaultSettings6Labels: Settings6Labels = {
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
