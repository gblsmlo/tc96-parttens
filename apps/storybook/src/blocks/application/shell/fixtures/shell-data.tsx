import {
  ArrowSquareOutIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingIcon,
  CardsIcon,
  ChartBarIcon,
  CreditCardIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  KanbanIcon,
  LifebuoyIcon,
  MegaphoneIcon,
  PlugIcon,
  PlusIcon,
  PushPinSlashIcon,
  ShieldIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  StarIcon,
  TicketIcon,
  TrayIcon,
  UserIcon,
  UsersIcon,
  WaveformIcon,
} from '@phosphor-icons/react'
import type {
  ShellAction,
  ShellBreadcrumbItem,
  ShellNavGroup,
  ShellSettings,
  ShellUser,
  ShellWorkspace,
} from '@tc96/ui/blocks/application/shell/app-shell-1'
import type {
  ShellNotification,
  ShellProject,
  ShellUsage,
} from '@tc96/ui/blocks/application/shell/app-shell-3'
import type { ShellSection } from '@tc96/ui/blocks/application/shell/app-shell-4'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  SettingsRow,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns'
import { Switch } from '@tc96/ui/switch'
import type { ReactElement } from 'react'

const noop = () => {}

const pinnedActions = (title: string): ShellAction[] => [
  {
    icon: <ArrowSquareOutIcon aria-hidden="true" />,
    label: `Abrir ${title} em nova aba`,
    onSelect: noop,
  },
  {
    icon: <PushPinSlashIcon aria-hidden="true" />,
    label: 'Remover dos fixados',
    onSelect: noop,
    variant: 'destructive',
  },
]

export const shellWorkspaces: ShellWorkspace[] = [
  {
    description: 'Plano Empresa',
    id: 'risine',
    logo: <CardsIcon aria-hidden="true" />,
    name: 'Risine CRM',
  },
  {
    description: 'Plano Time',
    id: 'acme',
    logo: <WaveformIcon aria-hidden="true" />,
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
        icon: <SquaresFourIcon aria-hidden="true" />,
        title: 'Painel',
      },
      {
        badge: 12,
        href: '/inbox',
        icon: <TrayIcon aria-hidden="true" />,
        title: 'Caixa de entrada',
      },
      {
        icon: <KanbanIcon aria-hidden="true" />,
        items: [
          { href: '/pipeline', title: 'Negócios' },
          { href: '/forecast', title: 'Previsão' },
          { href: '/quota-plan', title: 'Cotas' },
        ],
        title: 'Pipeline',
      },
      {
        icon: <UsersIcon aria-hidden="true" />,
        items: [
          { href: '/contacts', title: 'Pessoas' },
          { href: '/companies', title: 'Empresas' },
        ],
        title: 'Contatos',
      },
      {
        href: '/reports',
        icon: <ChartBarIcon aria-hidden="true" />,
        title: 'Relatórios',
      },
    ],
    label: 'Plataforma',
  },
  {
    items: [
      {
        actions: pinnedActions('Renovações do trimestre'),
        href: '/views/renewals',
        icon: <StarIcon aria-hidden="true" />,
        title: 'Renovações do trimestre',
      },
      {
        actions: pinnedActions('Leads quentes'),
        href: '/views/hot-leads',
        icon: <StarIcon aria-hidden="true" />,
        title: 'Leads quentes',
      },
    ],
    label: 'Fixados',
  },
  {
    items: [
      {
        href: '/settings',
        icon: <GearIcon aria-hidden="true" />,
        title: 'Configurações',
      },
      {
        href: '/help',
        icon: <LifebuoyIcon aria-hidden="true" />,
        title: 'Ajuda',
      },
    ],
    label: 'Workspace',
  },
]

export const shellNavigationWithSubItemBadges: ShellNavGroup[] = [
  {
    items: [
      {
        href: '/',
        icon: <SquaresFourIcon aria-hidden="true" />,
        title: 'Painel',
      },
      {
        badge: 12,
        href: '/inbox',
        icon: <TrayIcon aria-hidden="true" />,
        title: 'Caixa de entrada',
      },
      {
        icon: <KanbanIcon aria-hidden="true" />,
        items: [
          { active: true, badge: 3, href: '/pipeline', title: 'Negócios' },
          { badge: 8, href: '/forecast', title: 'Previsão' },
          { href: '/quota-plan', title: 'Cotas' },
        ],
        title: 'Pipeline',
      },
      {
        href: '/reports',
        icon: <ChartBarIcon aria-hidden="true" />,
        title: 'Relatórios',
      },
    ],
    label: 'Plataforma',
  },
]

export const shellUser: ShellUser = {
  email: 'marina@risine.com.br',
  name: 'Marina Costa',
}

export const shellUserActions: ShellAction[] = [
  { icon: <UserIcon aria-hidden="true" />, label: 'Perfil', onSelect: noop },
  {
    icon: <CreditCardIcon aria-hidden="true" />,
    label: 'Faturamento',
    onSelect: noop,
  },
  {
    icon: <BellIcon aria-hidden="true" />,
    label: 'Notificações',
    onSelect: noop,
  },
]

export const shellBreadcrumbs: ShellBreadcrumbItem[] = [
  { href: '/', label: 'Risine CRM' },
  { label: 'Painel' },
]

export function ShellHeaderActions(): ReactElement {
  return (
    <Button size="sm">
      <PlusIcon aria-hidden="true" />
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
    icon: <BriefcaseIcon aria-hidden="true" />,
    id: 'sales',
    navigation: shellNavigation.slice(0, 2),
    title: 'Vendas',
  },
  {
    icon: <MegaphoneIcon aria-hidden="true" />,
    id: 'marketing',
    navigation: [
      {
        items: [
          {
            active: true,
            href: '/campaigns',
            icon: <MegaphoneIcon aria-hidden="true" />,
            title: 'Campanhas',
          },
          {
            href: '/emails',
            icon: <EnvelopeSimpleIcon aria-hidden="true" />,
            title: 'E-mails',
          },
          {
            href: '/audiences',
            icon: <UsersIcon aria-hidden="true" />,
            title: 'Públicos',
          },
        ],
        label: 'Marketing',
      },
    ],
    title: 'Marketing',
  },
  {
    icon: <LifebuoyIcon aria-hidden="true" />,
    id: 'support',
    navigation: [
      {
        items: [
          {
            badge: 4,
            href: '/tickets',
            icon: <TicketIcon aria-hidden="true" />,
            title: 'Tickets',
          },
          {
            href: '/knowledge-base',
            icon: <BookOpenIcon aria-hidden="true" />,
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
        icon: <UserIcon aria-hidden="true" />,
        title: 'Perfil',
      },
      {
        href: '/settings/preferences',
        icon: <SlidersHorizontalIcon aria-hidden="true" />,
        title: 'Preferências',
      },
      {
        href: '/settings/notifications',
        icon: <BellIcon aria-hidden="true" />,
        title: 'Notificações',
      },
      {
        href: '/settings/security',
        icon: <ShieldIcon aria-hidden="true" />,
        title: 'Segurança',
      },
    ],
    label: 'Conta',
  },
  {
    items: [
      {
        href: '/settings/workspace',
        icon: <BuildingIcon aria-hidden="true" />,
        title: 'Geral',
      },
      {
        badge: 12,
        href: '/settings/members',
        icon: <UsersIcon aria-hidden="true" />,
        title: 'Membros',
      },
      {
        href: '/settings/billing',
        icon: <CreditCardIcon aria-hidden="true" />,
        title: 'Faturamento',
      },
      {
        href: '/settings/integrations',
        icon: <PlugIcon aria-hidden="true" />,
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
