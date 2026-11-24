import { CaretDownIcon } from '@phosphor-icons/react'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import { Group } from '@tc96/ui/group'
import { getInitials } from '@tc96/ui/helpers/initials'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { Fragment } from 'react'
import { defaultNavbar5Labels } from './labels'
import type { Navbar5Props, Navbar5Status } from './types'

const statusVariant = {
  changed: 'warning',
  draft: 'secondary',
  published: 'success',
} as const satisfies Record<Navbar5Status, string>

export function Navbar5({
  actions = [],
  breadcrumb,
  className,
  labels: labelsProp,
  maxPeople = 3,
  onPublish,
  onPublishAction,
  pending = false,
  people = [],
  renderLink = renderAnchor,
  status,
}: Readonly<Navbar5Props>) {
  const labels = {
    ...defaultNavbar5Labels,
    ...labelsProp,
    status: { ...defaultNavbar5Labels.status, ...labelsProp?.status },
  }
  const shown = people.slice(0, Math.max(0, maxPeople))
  const hidden = people.length - shown.length
  const showActions = actions.length > 0 && onPublishAction

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-4 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-5"
    >
      <Breadcrumb aria-label={labels.breadcrumb} className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumb.map((crumb, index) => {
            const last = index === breadcrumb.length - 1
            return (
              <Fragment key={crumb.id}>
                <BreadcrumbItem>
                  {last || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={renderLink(crumb.href)}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {last ? null : <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex shrink-0 items-center gap-3">
        {people.length > 0 ? (
          <AvatarGroup
            aria-label={labels.people}
            className="[--avatar-size:--spacing(7)]"
            role="group"
          >
            {shown.map((person) => (
              <Avatar
                aria-label={person.name}
                data-person={person.id}
                key={person.id}
                role="img"
                title={person.name}
              >
                {person.image ? (
                  <AvatarImage alt="" src={person.image} />
                ) : null}
                <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
              </Avatar>
            ))}
            {hidden > 0 ? (
              <AvatarGroupCount
                aria-label={labels.overflow(hidden)}
                data-slot="navbar-overflow"
                role="img"
              >
                +{hidden}
              </AvatarGroupCount>
            ) : null}
          </AvatarGroup>
        ) : null}
        <Badge data-status={status} variant={statusVariant[status]}>
          {labels.status[status]}
        </Badge>
        {onPublish ? (
          <Group>
            <Button disabled={pending} onClick={onPublish} size="sm">
              {labels.publish}
            </Button>
            {showActions ? (
              <Menu>
                <MenuTrigger
                  aria-label={labels.publishActions}
                  disabled={pending}
                  render={<Button size="icon-sm" />}
                >
                  <CaretDownIcon aria-hidden="true" />
                </MenuTrigger>
                <MenuPopup align="end">
                  {actions.map((action) => (
                    <MenuItem
                      key={action.id}
                      onClick={() => onPublishAction(action.id)}
                      variant={action.destructive ? 'destructive' : undefined}
                    >
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuPopup>
              </Menu>
            ) : null}
          </Group>
        ) : null}
      </div>
    </header>
  )
}
