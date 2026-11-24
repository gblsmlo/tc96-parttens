'use client'

import { ShareNetworkIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { Tabs, TabsList, TabsTab } from '@tc96/ui/tabs'
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
  onShare,
  onTabChange,
  renderLink = renderAnchor,
  tab,
  tabs,
}: Readonly<Navbar1Props>): ReactElement {
  const texts = { ...defaultNavbar1Labels, ...labels }

  return (
    <header
      className={cn(
        'flex w-full flex-col gap-1 border-b bg-background',
        className,
      )}
    >
      <div className="flex min-h-12 items-center gap-3 px-4 pt-2">
        <NavbarBreadcrumb
          items={breadcrumbs}
          label={texts.breadcrumb}
          renderLink={renderLink}
        />
        <div className="ms-auto flex items-center gap-3">
          {collaborators?.length ? (
            <NavbarAvatarStack
              label={texts.collaborators(collaborators.length)}
              people={collaborators}
            />
          ) : null}
          {onShare ? (
            <Button onClick={onShare} size="sm" variant="outline">
              <ShareNetworkIcon aria-hidden="true" />
              {texts.share}
            </Button>
          ) : null}
        </div>
      </div>
      <Tabs onValueChange={(value) => onTabChange(String(value))} value={tab}>
        <TabsList
          aria-label={texts.tabs}
          className="w-full justify-start overflow-x-auto px-3"
          variant="underline"
        >
          {tabs.map((item) => (
            <TabsTab key={item.id} value={item.id}>
              {item.label}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}
