import type {
  Navbar11Section,
  Navbar11Source,
  Navbar11User,
} from '@tc96/ui/blocks/application/navbar/navbar-11'

export const sections: Navbar11Section[] = [
  { id: 'patterns', label: 'Padrões' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'icons', label: 'Ícones' },
  { id: 'motion', label: 'Movimento' },
]

export const sources: Navbar11Source[] = [
  { id: 'shadcn', label: 'Tokens do shadcn/ui' },
  { id: 'figma', label: 'Variáveis do Figma' },
  { id: 'repository', label: 'Repositório do tema' },
]

export const user: Navbar11User = {
  email: 'gabriel@acme.com.br',
  name: 'Gabriel Melo',
}

export const userActions = [
  { id: 'profile', label: 'Meu perfil' },
  { id: 'settings', label: 'Configurações' },
  { destructive: true, id: 'sign-out', label: 'Sair' },
]

export const brandName = 'Sistema de Design'

export const version = 'v2.4.0'
