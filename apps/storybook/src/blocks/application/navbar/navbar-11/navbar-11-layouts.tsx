import { PaletteIcon } from '@phosphor-icons/react'
import { Navbar11 } from '@tc96/ui/blocks/application/navbar/navbar-11'
import { IconFrame } from '@tc96/ui/icon-frame'
import { MenuItem } from '@tc96/ui/menu'
import { fn } from 'storybook/test'
import {
  brandName,
  sections,
  sources,
  user,
  userActions,
  version,
} from '../fixtures/navbar-11.ts'
import type { Navbar11Controls } from './navbar-11-controls.ts'

export const navbar11Handlers = {
  onSectionChange: fn(),
  onSourceChange: fn(),
  onUserAction: fn(),
}

export const brandMark = (
  <IconFrame shape="rounded" size="sm">
    <PaletteIcon aria-hidden="true" />
  </IconFrame>
)

export const renderUserMenu = (onAction: (id: string) => void) =>
  userActions.map((action) => (
    <MenuItem
      key={action.id}
      onClick={() => onAction(action.id)}
      variant={action.destructive ? 'destructive' : undefined}
    >
      {action.label}
    </MenuItem>
  ))

export const ComposedNavbar11 = ({
  section,
  showMenu,
  showSections,
  showSources,
  showUser,
  showVersion,
  source,
}: Readonly<Navbar11Controls>) => (
  <Navbar11
    logo={brandMark}
    menu={showMenu ? renderUserMenu(navbar11Handlers.onUserAction) : undefined}
    name={brandName}
    onSectionChange={
      showSections ? navbar11Handlers.onSectionChange : undefined
    }
    onSourceChange={showSources ? navbar11Handlers.onSourceChange : undefined}
    section={section}
    sections={showSections ? sections : []}
    source={source}
    sources={showSources ? sources : []}
    user={showUser ? user : undefined}
    version={showVersion ? version : undefined}
  />
)
