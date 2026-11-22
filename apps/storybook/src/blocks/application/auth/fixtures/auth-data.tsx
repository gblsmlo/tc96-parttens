import type { AuthProvider } from '@tc96/blocks/application/auth/login-1'
import { CodeXmlIcon, GalleryVerticalEndIcon, GlobeIcon } from 'lucide-react'

export const authLogo = (
  <div className="flex items-center gap-2 font-medium">
    <GalleryVerticalEndIcon aria-hidden className="size-5" />
    Acme
  </div>
)

export const authProviders: AuthProvider[] = [
  { icon: <GlobeIcon />, id: 'google', label: 'Google' },
  { icon: <CodeXmlIcon />, id: 'github', label: 'GitHub' },
]
