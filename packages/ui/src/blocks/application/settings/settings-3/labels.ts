import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings3Labels } from './types'

export const defaultSettings3Labels: Settings3Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as configurações',
  loading: 'Carregando configurações',
  emailNotifications: 'Notificações por e-mail',
  emailNotificationsDescription: 'Envia um resumo da atividade do dia',
  fontSize: 'Tamanho da fonte',
  fontSizeDescription: 'Ajusta o tamanho do texto em todo o app',
  language: 'Idioma',
  languageDescription: 'O idioma dos menus e das mensagens',
  title: 'Interface e tema',
}
