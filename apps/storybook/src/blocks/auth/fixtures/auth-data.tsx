import { CardsIcon, CodeIcon, GlobeIcon } from '@phosphor-icons/react'
import type { AuthProvider } from '@tc96/blocks/auth/login-1'

export const authLogo = (
  <div className="flex items-center gap-2 font-medium">
    <CardsIcon aria-hidden className="size-5" />
    Acme
  </div>
)

export const authProviders: AuthProvider[] = [
  { icon: <GlobeIcon aria-hidden="true" />, id: 'google', label: 'Google' },
  { icon: <CodeIcon aria-hidden="true" />, id: 'github', label: 'GitHub' },
]
