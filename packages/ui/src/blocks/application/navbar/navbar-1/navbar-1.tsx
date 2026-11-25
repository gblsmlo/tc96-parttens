'use client'

import { DotsThreeIcon, ShareNetworkIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { NavbarAvatarStack } from '../shared/navbar-avatar-stack'
import { NavbarBreadcrumb } from '../shared/navbar-breadcrumb'
import { defaultNavbar1Labels } from './labels'
import type { Navbar1Props } from './types'

export function Navbar1({
  breadcrumbs,
  className,
  collaborators,
  labels,
  menu,
  onShare,
  renderLink = renderAnchor,
  status,
}: Readonly<Navbar1Props>): ReactElement {
  const texts = { ...defaultNavbar1Labels, ...labels }

  return (
    <header className={cn('w-full border-b bg-background', className)}>
      <div className="flex min-h-12 items-center gap-3 px-4 py-2">
        <NavbarBreadcrumb
          items={breadcrumbs}
          label={texts.breadcrumb}
          renderLink={renderLink}
        />
        <div className="ms-auto flex items-center gap-3">
          {status ? (
            <div
              className="flex items-center gap-2"
              data-slot="navbar-1-status"
            >
              {status}
            </div>
          ) : null}
          {collaborators?.length ? (
            <NavbarAvatarStack
              label={texts.collaborators(collaborators.length)}
              people={collaborators}
            />
          ) : null}
          {menu ? (
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    aria-label={texts.menu}
                    size="icon-sm"
                    variant="ghost"
                  />
                }
              >
                <DotsThreeIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuPopup align="end" className="min-w-48">
                {menu}
              </MenuPopup>
            </Menu>
          ) : null}
          {onShare ? (
            <Button onClick={onShare} size="sm">
              <ShareNetworkIcon aria-hidden="true" />
              {texts.share}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
