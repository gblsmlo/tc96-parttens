import { BellIcon, PlugsIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import type { EmptyState6Tab } from '@tc96/ui/blocks/application/empty-state/empty-state-6'

export const tabs: EmptyState6Tab[] = [
  {
    actionLabel: 'Configurar notificações',
    description:
      'Escolha por onde e quando você quer ser avisado sobre prazos e comentários.',
    icon: BellIcon,
    id: 'notifications',
    label: 'Notificações',
    title: 'Nenhuma notificação configurada',
  },
  {
    actionLabel: 'Ativar verificação em duas etapas',
    description:
      'Proteja sua conta com um segundo passo de verificação ao entrar.',
    icon: ShieldCheckIcon,
    id: 'security',
    label: 'Segurança',
    title: 'Sua conta ainda não tem proteção extra',
  },
  {
    actionLabel: 'Adicionar integração',
    description:
      'Conecte suas ferramentas para sincronizar tarefas e arquivos automaticamente.',
    icon: PlugsIcon,
    id: 'integrations',
    label: 'Integrações',
    title: 'Nenhuma integração ativa',
  },
]
