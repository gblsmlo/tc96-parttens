import type { SettingsSecurity1Control } from '@tc96/ui/blocks/application/settings/security/settings-security-1'

export const privacyControls: SettingsSecurity1Control[] = [
  {
    checked: true,
    description: 'Compartilhe dados anônimos de uso para melhorar o produto.',
    id: 'usage-analytics',
    title: 'Análise de uso',
  },
  {
    checked: false,
    description:
      'Permita que a equipe de suporte veja sua conta ao pedir ajuda.',
    id: 'support-access',
    title: 'Acesso do suporte',
  },
  {
    checked: true,
    description: 'Mantenha o histórico de acessos por 12 meses.',
    id: 'audit-retention',
    plan: 'pro',
    title: 'Retenção estendida de logs',
  },
  {
    checked: false,
    description: 'Oculte o conteúdo dos e-mails nos resultados de busca.',
    id: 'redact-search',
    plan: 'beta',
    title: 'Busca com dados ocultos',
  },
  {
    actionLabel: 'Exportar dados',
    description: 'Baixe uma cópia de tudo que a conta guarda sobre você.',
    id: 'export-data',
    title: 'Exportar meus dados',
  },
]
