import { CardsIcon } from '@phosphor-icons/react'
import type { AuthProvider } from '@tc96/blocks/application/auth/login-1'
import type { IconModule } from '@thesvg/icons'
import github from '@thesvg/icons/github'
import google from '@thesvg/icons/google'

const toDataUri = (svg: string) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`

const BrandMark = ({ icon }: Readonly<{ icon: IconModule }>) => (
  <img
    alt=""
    className="size-4 shrink-0"
    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon.svg)}`}
  />
)

const MonoBrandMark = ({ icon }: Readonly<{ icon: IconModule }>) => (
  <span
    aria-hidden="true"
    className="size-4 shrink-0 bg-current"
    style={{
      mask: `${toDataUri(icon.variants.mono ?? icon.svg)} center / contain no-repeat`,
    }}
  />
)

export const authLogo = (
  <div className="flex items-center gap-2 font-medium">
    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <CardsIcon aria-hidden className="size-5" />
    </span>
    Acme
  </div>
)

export const authProviders: AuthProvider[] = [
  { icon: <BrandMark icon={google} />, id: 'google', label: 'Google' },
  { icon: <MonoBrandMark icon={github} />, id: 'github', label: 'GitHub' },
]
