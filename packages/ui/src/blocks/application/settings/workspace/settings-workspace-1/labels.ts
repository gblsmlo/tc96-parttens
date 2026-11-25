import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsWorkspace1Labels } from './types'

export const defaultSettingsWorkspace1Labels: SettingsWorkspace1Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar o workspace',
  loading: 'Carregando workspace',
  dangerTitle: 'Zona de perigo',
  deleteDescription:
    'Exclui todos os registros e remove o acesso de todos os membros',
  deleteTitle: 'Excluir workspace',
  deleteWorkspace: 'Excluir workspace',
  logoDescription: 'Exibido na barra lateral e nos e-mails de convite',
  logoTitle: 'Logo',
  nameLabel: 'Nome do workspace',
  timeZoneDescription: 'Usado em prazos, relatórios e e-mails agendados',
  timeZoneLabel: 'Fuso horário',
  uploadLogo: 'Enviar logo',
  urlDescription: 'Alterar quebra os links compartilhados antes',
  urlLabel: 'URL do workspace',
  urlPrefix: 'app.example.com/',
  workspaceDescription: (name) =>
    `Detalhes que todos os membros de ${name} veem.`,
  workspaceTitle: 'Workspace',
}
