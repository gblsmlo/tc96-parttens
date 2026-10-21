import type {
  ShellAction,
  ShellBreadcrumbItem,
  ShellNavGroup,
  ShellUser,
  ShellWorkspace,
} from '@tc96/templates/application/shell/app-shell-1'
import type {
  ShellNotification,
  ShellProject,
  ShellUsage,
} from '@tc96/templates/application/shell/app-shell-3'
import type { ShellSection } from '@tc96/templates/application/shell/app-shell-4'
import { Button } from '@tc96/ui/button'
import {
  AudioWaveformIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  ChartColumnIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  GalleryVerticalEndIcon,
  InboxIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MailIcon,
  MegaphoneIcon,
  PinOffIcon,
  PlusIcon,
  SettingsIcon,
  StarIcon,
  TicketIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import type { ReactElement } from 'react'

const noop = () => {}

const pinnedActions = (title: string): ShellAction[] => [
  {
    icon: <ExternalLinkIcon />,
    label: `Abrir ${title} em nova aba`,
    onSelect: noop,
  },
  {
    icon: <PinOffIcon />,
    label: 'Remover dos fixados',
    onSelect: noop,
    variant: 'destructive',
  },
]

export const shellWorkspaces: ShellWorkspace[] = [
  {
    description: 'Plano Empresa',
    id: 'risine',
    logo: <GalleryVerticalEndIcon />,
    name: 'Risine CRM',
  },
  {
    description: 'Plano Time',
    id: 'acme',
    logo: <AudioWaveformIcon />,
    name: 'Acme Vendas',
  },
  { description: 'Plano Grátis', id: 'tc96', name: 'TC96 Labs' },
]

export const shellNavigation: ShellNavGroup[] = [
  {
    items: [
      {
        active: true,
        href: '/',
        icon: <LayoutDashboardIcon />,
        title: 'Painel',
      },
      {
        badge: 12,
        href: '/inbox',
        icon: <InboxIcon />,
        title: 'Caixa de entrada',
      },
      {
        icon: <KanbanIcon />,
        items: [
          { href: '/pipeline', title: 'Negócios' },
          { href: '/forecast', title: 'Previsão' },
          { href: '/quota-plan', title: 'Cotas' },
        ],
        title: 'Pipeline',
      },
      {
        icon: <UsersIcon />,
        items: [
          { href: '/contacts', title: 'Pessoas' },
          { href: '/companies', title: 'Empresas' },
        ],
        title: 'Contatos',
      },
      { href: '/reports', icon: <ChartColumnIcon />, title: 'Relatórios' },
    ],
    label: 'Plataforma',
  },
  {
    items: [
      {
        actions: pinnedActions('Renovações do trimestre'),
        href: '/views/renewals',
        icon: <StarIcon />,
        title: 'Renovações do trimestre',
      },
      {
        actions: pinnedActions('Leads quentes'),
        href: '/views/hot-leads',
        icon: <StarIcon />,
        title: 'Leads quentes',
      },
    ],
    label: 'Fixados',
  },
  {
    items: [
      { href: '/settings', icon: <SettingsIcon />, title: 'Configurações' },
      { href: '/help', icon: <LifeBuoyIcon />, title: 'Ajuda' },
    ],
    label: 'Workspace',
  },
]

export const shellUser: ShellUser = {
  email: 'marina@risine.com.br',
  name: 'Marina Costa',
}

export const shellUserActions: ShellAction[] = [
  { icon: <UserIcon />, label: 'Perfil', onSelect: noop },
  { icon: <CreditCardIcon />, label: 'Faturamento', onSelect: noop },
  { icon: <BellIcon />, label: 'Notificações', onSelect: noop },
]

export const shellBreadcrumbs: ShellBreadcrumbItem[] = [
  { href: '/', label: 'Risine CRM' },
  { label: 'Painel' },
]

export function ShellHeaderActions(): ReactElement {
  return (
    <Button size="sm">
      <PlusIcon />
      Novo negócio
    </Button>
  )
}

export function ShellPagePlaceholder(): ReactElement {
  return (
    <>
      <h1 className="font-semibold text-lg">Painel</h1>
      <div aria-hidden className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
      </div>
      <div aria-hidden className="min-h-64 flex-1 rounded-xl bg-muted" />
    </>
  )
}

export const shellProjects: ShellProject[] = [
  { href: '/projects/onboarding', progress: 0.72, title: 'Onboarding Acme' },
  { href: '/projects/migration', progress: 0.38, title: 'Migração de CRM' },
  { href: '/projects/q4-campaign', progress: 0.9, title: 'Campanha Q4' },
]

export const shellUsage: ShellUsage = {
  description: 'O limite renova em 1º de novembro.',
  label: 'Limite de gastos',
  max: 5000,
  value: 3200,
  valueLabel: 'R$ 3.200 de R$ 5.000',
}

export const shellNotifications: ShellNotification[] = [
  {
    description: 'Marcos Tavares moveu Renovação Acme para Negociação.',
    id: 'deal-moved',
    time: 'há 5 min',
    title: 'Negócio atualizado',
    unread: true,
  },
  {
    description: 'Ana Ribeiro mencionou você em Migração de CRM.',
    id: 'mention',
    time: 'há 1 h',
    title: 'Nova menção',
    unread: true,
  },
  {
    description: 'O relatório semanal de pipeline está pronto.',
    id: 'report',
    time: 'ontem',
    title: 'Relatório disponível',
  },
]

export const shellSections: ShellSection[] = [
  {
    icon: <BriefcaseIcon />,
    id: 'sales',
    navigation: shellNavigation.slice(0, 2),
    title: 'Vendas',
  },
  {
    icon: <MegaphoneIcon />,
    id: 'marketing',
    navigation: [
      {
        items: [
          {
            active: true,
            href: '/campaigns',
            icon: <MegaphoneIcon />,
            title: 'Campanhas',
          },
          { href: '/emails', icon: <MailIcon />, title: 'E-mails' },
          { href: '/audiences', icon: <UsersIcon />, title: 'Públicos' },
        ],
        label: 'Marketing',
      },
    ],
    title: 'Marketing',
  },
  {
    icon: <LifeBuoyIcon />,
    id: 'support',
    navigation: [
      {
        items: [
          {
            badge: 4,
            href: '/tickets',
            icon: <TicketIcon />,
            title: 'Tickets',
          },
          {
            href: '/knowledge-base',
            icon: <BookOpenIcon />,
            title: 'Base de conhecimento',
          },
        ],
        label: 'Suporte',
      },
    ],
    title: 'Suporte',
  },
]
