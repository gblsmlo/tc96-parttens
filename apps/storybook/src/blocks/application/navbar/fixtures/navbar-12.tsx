import {
  BuildingsIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  PlugsConnectedIcon,
  ShieldCheckIcon,
  SunHorizonIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type {
  Navbar12Cta,
  Navbar12Item,
} from '@tc96/ui/blocks/application/navbar/navbar-12'

export const name = 'Aurora'

export const logo = (
  <SunHorizonIcon
    aria-hidden="true"
    className="size-6 text-primary"
    weight="fill"
  />
)

export const items: Navbar12Item[] = [
  {
    groups: [
      {
        id: 'platform',
        label: 'Plataforma',
        links: [
          {
            description: 'Acompanhe resultados em tempo real.',
            href: '/produto/analises',
            icon: <ChartLineUpIcon aria-hidden="true" />,
            id: 'analytics',
            label: 'Análises',
          },
          {
            description: 'Conecte as ferramentas que você já usa.',
            href: '/produto/integracoes',
            icon: <PlugsConnectedIcon aria-hidden="true" />,
            id: 'integrations',
            label: 'Integrações',
          },
        ],
      },
      {
        id: 'trust',
        label: 'Confiança',
        links: [
          {
            description: 'Controle quem acessa cada informação.',
            href: '/produto/seguranca',
            icon: <ShieldCheckIcon aria-hidden="true" />,
            id: 'security',
            label: 'Segurança',
          },
          {
            description: 'Converse com clientes sem sair da tela.',
            href: '/produto/atendimento',
            icon: <ChatsCircleIcon aria-hidden="true" />,
            id: 'support',
            label: 'Atendimento',
          },
        ],
      },
    ],
    id: 'product',
    label: 'Produto',
  },
  {
    groups: [
      {
        id: 'about',
        label: 'Sobre nós',
        links: [
          {
            description: 'Conheça a história e os valores do time.',
            href: '/empresa/sobre',
            icon: <BuildingsIcon aria-hidden="true" />,
            id: 'about',
            label: 'Quem somos',
          },
          {
            description: 'Veja as vagas abertas.',
            href: '/empresa/carreiras',
            icon: <UsersThreeIcon aria-hidden="true" />,
            id: 'careers',
            label: 'Carreiras',
          },
        ],
      },
    ],
    id: 'company',
    label: 'Empresa',
  },
  { href: '/precos', id: 'pricing', label: 'Preços' },
]

export const cta: Navbar12Cta = { href: '/cadastro', label: 'Começar agora' }
