'use client'

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@tc96/ui/sidebar'
import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import type {
  ShellLabels,
  ShellNavGroup,
  ShellNavItem,
  ShellRenderLink,
} from './types'

interface ShellNavItemProps {
  item: ShellNavItem
  labels: ShellLabels
  renderLink: ShellRenderLink
}

function ShellNavLeaf({
  item,
  labels,
  renderLink,
}: Readonly<ShellNavItemProps>): ReactElement {
  const hasActions = Boolean(item.actions?.length)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        aria-current={item.active ? 'page' : undefined}
        isActive={item.active}
        render={item.href ? renderLink(item.href) : undefined}
        tooltip={item.title}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
      {hasActions ? (
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuAction
                aria-label={labels.itemActions(item.title)}
                showOnHover
              />
            }
          >
            <MoreHorizontalIcon />
          </MenuTrigger>
          <MenuPopup align="start" side="right">
            {item.actions?.map((action) => (
              <MenuItem
                key={action.label}
                onClick={action.onSelect}
                variant={action.variant}
              >
                {action.icon}
                {action.label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      ) : null}
      {!hasActions && item.badge !== undefined ? (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      ) : null}
    </SidebarMenuItem>
  )
}

function ShellNavBranch({
  item,
  renderLink,
}: Readonly<ShellNavItemProps>): ReactElement {
  const open = Boolean(item.active || item.items?.some((sub) => sub.active))

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={open}>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton isActive={item.active} tooltip={item.title} />
          }
        >
          {item.icon}
          <span>{item.title}</span>
          <ChevronRightIcon className="ms-auto transition-transform in-data-panel-open:rotate-90" />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <SidebarMenuSub>
            {item.items?.map((sub) => (
              <SidebarMenuSubItem key={sub.href}>
                <SidebarMenuSubButton
                  aria-current={sub.active ? 'page' : undefined}
                  isActive={sub.active}
                  render={renderLink(sub.href)}
                >
                  <span>{sub.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsiblePanel>
      </Collapsible>
    </SidebarMenuItem>
  )
}

interface ShellNavSectionProps {
  group: ShellNavGroup
  labels: ShellLabels
  renderLink: ShellRenderLink
}

function ShellNavSection({
  group,
  labels,
  renderLink,
}: Readonly<ShellNavSectionProps>): ReactElement {
  const labelId = useId()

  return (
    <SidebarGroup>
      <SidebarGroupLabel id={labelId}>{group.label}</SidebarGroupLabel>
      <SidebarMenu aria-labelledby={labelId}>
        {group.items.map((item) =>
          item.items?.length ? (
            <ShellNavBranch
              item={item}
              key={item.title}
              labels={labels}
              renderLink={renderLink}
            />
          ) : (
            <ShellNavLeaf
              item={item}
              key={item.title}
              labels={labels}
              renderLink={renderLink}
            />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export interface ShellNavProps {
  groups: ShellNavGroup[]
  label: string
  labels: ShellLabels
  renderLink: ShellRenderLink
}

export function ShellNav({
  groups,
  label,
  labels,
  renderLink,
}: Readonly<ShellNavProps>): ReactElement {
  return (
    <nav aria-label={label}>
      {groups.map((group) => (
        <ShellNavSection
          group={group}
          key={group.label}
          labels={labels}
          renderLink={renderLink}
        />
      ))}
    </nav>
  )
}
