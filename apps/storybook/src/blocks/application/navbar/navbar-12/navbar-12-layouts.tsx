import { Navbar12 } from '@tc96/ui/blocks/application/navbar/navbar-12'
import type { RenderLink } from '@tc96/ui/render-anchor'
import { fn } from 'storybook/test'
import { cta, items, logo, name } from '../fixtures/navbar-12.tsx'
import type { Navbar12Controls } from './navbar-12-controls.ts'

export const navbar12Handlers = {
  onNavigate: fn(),
}

export const renderRouterLink: RenderLink = (href) => (
  // biome-ignore lint/a11y/useAnchorContent: the render prop merges the link text into this element
  <a
    data-link="router"
    href={href}
    onClick={(event) => {
      event.preventDefault()
      navbar12Handlers.onNavigate(href)
    }}
  />
)

export const ComposedNavbar12 = ({
  openOnHover,
  showCta,
  showLogo,
  showPricing,
}: Readonly<Navbar12Controls>) => (
  <Navbar12
    cta={showCta ? cta : undefined}
    items={showPricing ? items : items.filter((item) => 'groups' in item)}
    logo={showLogo ? logo : undefined}
    name={name}
    openOnHover={openOnHover}
    renderLink={renderRouterLink}
  />
)
