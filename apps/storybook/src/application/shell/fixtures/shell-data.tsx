import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens'
import type {
  ShellAction,
  ShellBreadcrumbItem,
  ShellNavGroup,
  ShellSettings,
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
import { Input } from '@tc96/ui/input'
import { Switch } from '@tc96/ui/switch'
import {
  AudioWaveformIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingIcon,
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
  PlugIcon,
  PlusIcon,
  SettingsIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
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

export const shellNavigationWithSubItemBadges: ShellNavGroup[] = [
  {
    items: [
      { href: '/', icon: <LayoutDashboardIcon />, title: 'Painel' },
      {
        badge: 12,
        href: '/inbox',
        icon: <InboxIcon />,
        title: 'Caixa de entrada',
      },
      {
        icon: <KanbanIcon />,
        items: [
          { active: true, badge: 3, href: '/pipeline', title: 'Negócios' },
          { badge: 8, href: '/forecast', title: 'Previsão' },
          { href: '/quota-plan', title: 'Cotas' },
        ],
        title: 'Pipeline',
      },
      { href: '/reports', icon: <ChartColumnIcon />, title: 'Relatórios' },
    ],
    label: 'Plataforma',
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

export const settingsNavigation: ShellNavGroup[] = [
  {
    items: [
      {
        active: true,
        href: '/settings/profile',
        icon: <UserIcon />,
        title: 'Perfil',
      },
      {
        href: '/settings/preferences',
        icon: <SlidersHorizontalIcon />,
        title: 'Preferências',
      },
      {
        href: '/settings/notifications',
        icon: <BellIcon />,
        title: 'Notificações',
      },
      { href: '/settings/security', icon: <ShieldIcon />, title: 'Segurança' },
    ],
    label: 'Conta',
  },
  {
    items: [
      { href: '/settings/workspace', icon: <BuildingIcon />, title: 'Geral' },
      {
        badge: 12,
        href: '/settings/members',
        icon: <UsersIcon />,
        title: 'Membros',
      },
      {
        href: '/settings/billing',
        icon: <CreditCardIcon />,
        title: 'Faturamento',
      },
      {
        href: '/settings/integrations',
        icon: <PlugIcon />,
        title: 'Integrações',
      },
    ],
    label: 'Workspace',
  },
]

export const shellSettings: ShellSettings = {
  backHref: '/',
  navigation: settingsNavigation,
}

export const settingsBreadcrumbs: ShellBreadcrumbItem[] = [
  { href: '/settings', label: 'Configurações' },
  { label: 'Perfil' },
]

export function ProfileSettingsPage(): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <h1 className="font-semibold text-lg">Perfil</h1>
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>Informações pessoais</SettingsSectionTitle>
            <SettingsSectionDescription>
              Como a equipe vê você no workspace.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        <SettingsRow
          endSlot={
            <Input
              aria-label="Nome"
              className="w-56"
              defaultValue="Marina Costa"
            />
          }
          title="Nome"
        />
        <SettingsRow
          description="Exibe seu e-mail no perfil público"
          endSlot={<Switch aria-label="Mostrar e-mail" defaultChecked />}
          title="Mostrar e-mail"
        />
      </SettingsSection>
    </div>
  )
}
