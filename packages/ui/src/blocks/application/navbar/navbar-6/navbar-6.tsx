import {
  DotsThreeIcon,
  FunnelSimpleIcon,
  HouseIcon,
  SortAscendingIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { Fragment, type ReactElement } from 'react'
import { defaultNavbar6Labels } from './labels'
import type { Navbar6Props } from './types'

export function Navbar6({
  breadcrumb,
  className,
  filterOptions = [],
  filters = [],
  labels: labelsProp,
  maxPeople = 3,
  menu,
  onFiltersChange,
  onInvite,
  onSortChange,
  people = [],
  renderLink = renderAnchor,
  sort,
  sortOptions = [],
}: Readonly<Navbar6Props>): ReactElement {
  const labels = { ...defaultNavbar6Labels, ...labelsProp }
  const shown = people.slice(0, Math.max(0, maxPeople))
  const hidden = people.length - shown.length
  const filterActive = filters.length > 0
  const toggleFilter = (id: string, checked: boolean) =>
    onFiltersChange?.(
      checked ? [...filters, id] : filters.filter((current) => current !== id),
    )

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-4 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-6"
    >
      <Breadcrumb aria-label={labels.breadcrumb} className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {breadcrumb.map((crumb, index) => {
            const first = index === 0
            const last = index === breadcrumb.length - 1
            return (
              <Fragment key={crumb.id}>
                <BreadcrumbItem>
                  {first ? <HouseIcon aria-hidden="true" /> : null}
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
      <div className="flex shrink-0 items-center gap-2">
        {people.length > 0 ? (
          <AvatarGroup
            aria-label={labels.people}
            className="mr-1 [--avatar-size:--spacing(7)]"
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
        {onInvite ? (
          <Button onClick={onInvite} size="sm" variant="outline">
            <UserPlusIcon aria-hidden="true" />
            {labels.invite}
          </Button>
        ) : null}
        {filterOptions.length > 0 && onFiltersChange ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.filter}
                  data-active={filterActive ? '' : undefined}
                  size="icon-sm"
                  variant={filterActive ? 'secondary' : 'ghost'}
                />
              }
            >
              <FunnelSimpleIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end" className="min-w-48">
              <MenuGroup>
                <MenuGroupLabel>{labels.filterTitle}</MenuGroupLabel>
                {filterOptions.map((option) => (
                  <MenuCheckboxItem
                    checked={filters.includes(option.id)}
                    key={option.id}
                    onCheckedChange={(checked) =>
                      toggleFilter(option.id, checked)
                    }
                  >
                    {option.label}
                  </MenuCheckboxItem>
                ))}
              </MenuGroup>
            </MenuPopup>
          </Menu>
        ) : null}
        {sortOptions.length > 0 && onSortChange ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.sort}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <SortAscendingIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end" className="min-w-48">
              <MenuGroup>
                <MenuGroupLabel>{labels.sortTitle}</MenuGroupLabel>
                <MenuRadioGroup
                  onValueChange={(next) => onSortChange(String(next))}
                  value={sort}
                >
                  {sortOptions.map((option) => (
                    <MenuRadioItem
                      closeOnClick
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </MenuGroup>
            </MenuPopup>
          </Menu>
        ) : null}
        {menu ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.menu}
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
      </div>
    </header>
  )
}
