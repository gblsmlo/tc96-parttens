import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings1Labels } from './types'

export const defaultSettings1Labels: Settings1Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a conta',
  loading: 'Carregando conta',
  accountDescription: 'Dados de acesso e sessões da sua conta.',
  accountTitle: 'Conta',
  avatarDescription: 'PNG ou JPG, com pelo menos 256 × 256 px',
  avatarTitle: 'Avatar',
  deleteAccount: 'Excluir conta',
  deleteAccountDescription:
    'Remove sua conta e seu acesso a todos os espaços de trabalho',
  deleteAccountTitle: 'Excluir conta',
  emailDescription: 'Usado para entrar e para receber notificações',
  emailInvalid: 'Informe um e-mail válido.',
  emailLabel: 'E-mail',
  emailSave: 'Salvar',
  emailTitle: 'E-mail',
  profileDescription:
    'Como você aparece para sua equipe em todos os espaços de trabalho.',
  profileTitle: 'Perfil',
  sessionsDescription: (count) =>
    `Conectado em ${count} ${count === 1 ? 'dispositivo' : 'dispositivos'}`,
  sessionsTitle: 'Sessões',
  signOutEverywhere: 'Sair de todos os dispositivos',
  uploadAvatar: 'Enviar avatar',
}
