'use client'

import {
  CaretUpDownIcon,
  GitBranchIcon,
  PlayIcon,
  RocketLaunchIcon,
  ShareNetworkIcon,
  TagIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { NavbarBreadcrumb } from '../shared/navbar-breadcrumb'
import { defaultNavbar9Labels } from './labels'
import type { Navbar9Branch, Navbar9BranchKind, Navbar9Props } from './types'

const kindOrder = [
  'branch',
  'tag',
  'deploy',
] as const satisfies Navbar9BranchKind[]

const kindIcon = {
  branch: GitBranchIcon,
  deploy: RocketLaunchIcon,
  tag: TagIcon,
} as const satisfies Record<Navbar9BranchKind, unknown>

export function Navbar9({
  branch,
  branches = [],
  className,
  labels: labelsProp,
  logo,
  name,
  onBranchChange,
  onRun,
  onShare,
  path,
  renderLink = renderAnchor,
  running = false,
}: Readonly<Navbar9Props>): ReactElement {
  const labels = {
    ...defaultNavbar9Labels,
    ...labelsProp,
    kinds: { ...defaultNavbar9Labels.kinds, ...labelsProp?.kinds },
  }
  const groups = kindOrder
    .map((kind) => ({
      items: branches.filter((item) => (item.kind ?? 'branch') === kind),
      kind,
    }))
    .filter((group) => group.items.length > 0)
  const current = branches.find((item: Navbar9Branch) => item.id === branch)
  const currentLabel = current?.label ?? branch ?? ''
  const showPicker = groups.length > 0 && onBranchChange

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-4 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-9"
    >
      <div className="flex shrink-0 items-center gap-2">
        {logo}
        <span className="font-semibold text-sm">{name}</span>
      </div>
      <div className="min-w-0 flex-1">
        <NavbarBreadcrumb
          items={path}
          label={labels.path}
          renderLink={renderLink}
        />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onShare ? (
          <Button onClick={onShare} size="sm" variant="ghost">
            <ShareNetworkIcon aria-hidden="true" />
            {labels.share}
          </Button>
        ) : null}
        {onRun ? (
          <Button
            disabled={running}
            onClick={onRun}
            size="sm"
            variant="outline"
          >
            <PlayIcon aria-hidden="true" />
            {running ? labels.running : labels.run}
          </Button>
        ) : null}
        {showPicker ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.branchTrigger(currentLabel)}
                  size="sm"
                  variant="outline"
                />
              }
            >
              <GitBranchIcon aria-hidden="true" />
              {currentLabel}
              <CaretUpDownIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end" className="min-w-56">
              <MenuRadioGroup
                onValueChange={(next) => onBranchChange(String(next))}
                value={branch}
              >
                {groups.map((group, index) => {
                  const Icon = kindIcon[group.kind]
                  return (
                    <MenuGroup key={group.kind}>
                      {index > 0 ? <MenuSeparator /> : null}
                      <MenuGroupLabel>
                        {labels.kinds[group.kind]}
                      </MenuGroupLabel>
                      {group.items.map((item) => (
                        <MenuRadioItem
                          closeOnClick
                          key={item.id}
                          value={item.id}
                        >
                          <Icon aria-hidden="true" />
                          <span className="truncate">{item.label}</span>
                          {item.default ? (
                            <Badge variant="secondary">
                              {labels.defaultBadge}
                            </Badge>
                          ) : null}
                        </MenuRadioItem>
                      ))}
                    </MenuGroup>
                  )
                })}
              </MenuRadioGroup>
            </MenuPopup>
          </Menu>
        ) : null}
      </div>
    </header>
  )
}
