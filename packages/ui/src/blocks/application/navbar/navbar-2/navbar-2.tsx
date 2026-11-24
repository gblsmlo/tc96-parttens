'use client'

import { CaretUpDownIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import { defaultNavbar2Labels } from './labels'
import type { Navbar2Environment, Navbar2Option, Navbar2Props } from './types'

interface SegmentSwitcherProps {
  groupLabel: string
  onChange: (id: string) => void
  options: Navbar2Option[]
  triggerLabel: string
  value: string
}

function SegmentSwitcher({
  groupLabel,
  onChange,
  options,
  triggerLabel,
  value,
}: Readonly<SegmentSwitcherProps>): ReactElement {
  const current = options.find((option) => option.id === value)
  const environment = current as Navbar2Environment | undefined

  return (
    <Menu>
      <MenuTrigger
        render={<Button aria-label={triggerLabel} size="sm" variant="ghost" />}
      >
        {environment?.tone ? (
          <Badge variant={environment.tone}>{environment.name}</Badge>
        ) : (
          current?.name
        )}
        <CaretUpDownIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="start" className="min-w-48">
        <MenuGroup>
          <MenuGroupLabel>{groupLabel}</MenuGroupLabel>
          <MenuRadioGroup
            onValueChange={(next) => onChange(String(next))}
            value={value}
          >
            {options.map((option) => (
              <MenuRadioItem closeOnClick key={option.id} value={option.id}>
                {option.name}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  )
}

export function Navbar2({
  className,
  environmentId,
  environments,
  labels,
  onEnvironmentChange,
  onOrgChange,
  onProjectChange,
  organizationId,
  organizations,
  projectId,
  projects,
}: Readonly<Navbar2Props>): ReactElement {
  const texts = { ...defaultNavbar2Labels, ...labels }
  const name = (options: Navbar2Option[], id: string) =>
    options.find((option) => option.id === id)?.name ?? ''

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center border-b bg-background px-4',
        className,
      )}
    >
      <Breadcrumb aria-label={texts.breadcrumb}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <SegmentSwitcher
              groupLabel={texts.organization}
              onChange={onOrgChange}
              options={organizations}
              triggerLabel={texts.organizationTrigger(
                name(organizations, organizationId),
              )}
              value={organizationId}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <SegmentSwitcher
              groupLabel={texts.project}
              onChange={onProjectChange}
              options={projects}
              triggerLabel={texts.projectTrigger(name(projects, projectId))}
              value={projectId}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <SegmentSwitcher
              groupLabel={texts.environment}
              onChange={onEnvironmentChange}
              options={environments}
              triggerLabel={texts.environmentTrigger(
                name(environments, environmentId),
              )}
              value={environmentId}
            />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
