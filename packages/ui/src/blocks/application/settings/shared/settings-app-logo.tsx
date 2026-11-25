import { IconFrame } from '@tc96/ui/icon-frame'
import type { SettingsAppLogoData } from './types'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')

export function SettingsAppLogo({
  logo,
  name,
}: Readonly<{ logo?: SettingsAppLogoData; name: string }>) {
  return (
    <IconFrame shape="rounded" size="lg">
      {logo ? (
        <img
          alt=""
          className="size-6"
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(logo.svg)}`}
        />
      ) : (
        initials(name)
      )}
    </IconFrame>
  )
}
