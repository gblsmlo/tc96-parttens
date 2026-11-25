import { ArrowRightIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import type { RenderLink } from '@tc96/ui/render-anchor'

export function DashboardPanelLink({
  href,
  label,
  renderLink,
}: Readonly<{ href?: string; label: string; renderLink: RenderLink }>) {
  if (!href) return null

  return (
    <Button render={renderLink(href)} size="sm" variant="ghost">
      {label}
      <ArrowRightIcon aria-hidden="true" />
    </Button>
  )
}
