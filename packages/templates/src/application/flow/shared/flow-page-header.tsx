'use client'

import { FlowShortcutsPopover } from '@tc96/parttens/flow/canvas/components/flow-shortcuts-popover'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Spinner } from '@tc96/ui/spinner'
import { EllipsisIcon, PlayIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { Fragment, type ReactElement, type ReactNode } from 'react'
import type { FlowRenderLink } from './render-link'
import type { FlowBreadcrumbItem, FlowPageLabels } from './types'

export interface FlowPageHeaderProps {
  breadcrumbs?: FlowBreadcrumbItem[]
  children?: ReactNode
  labels: FlowPageLabels
  name: string
  onAddStep?: () => void
  onAskAi?: () => void
  onRun?: () => void
  renderLink: FlowRenderLink
  running?: boolean
}

export function FlowPageHeader({
  breadcrumbs = [],
  children,
  labels,
  name,
  onAddStep,
  onAskAi,
  onRun,
  renderLink,
  running = false,
}: Readonly<FlowPageHeaderProps>): ReactElement {
  return (
    <header
      className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2"
      data-slot="flow-page-header"
    >
      <Breadcrumb aria-label={labels.breadcrumb} className="min-w-0 flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((item) => (
            <Fragment key={item.label}>
              <BreadcrumbItem className="hidden md:inline-flex">
                {item.href ? (
                  <BreadcrumbLink render={renderLink(item.href)}>
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  item.label
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:inline-flex" />
            </Fragment>
          ))}
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate">{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <FlowShortcutsPopover labels={labels.shortcuts} />
        {onAskAi ? (
          <Button aria-label={labels.askAi} onClick={onAskAi} variant="outline">
            <SparklesIcon aria-hidden="true" />
            <span className="max-sm:sr-only">{labels.askAi}</span>
          </Button>
        ) : null}
        {onAddStep ? (
          <Button
            aria-label={labels.addStep}
            onClick={onAddStep}
            variant="outline"
          >
            <PlusIcon aria-hidden="true" />
            <span className="max-sm:sr-only">{labels.addStep}</span>
          </Button>
        ) : null}
        {onRun ? (
          <Button aria-label={labels.run} disabled={running} onClick={onRun}>
            {running ? (
              <Spinner aria-hidden="true" />
            ) : (
              <PlayIcon aria-hidden="true" />
            )}
            <span className="max-sm:sr-only">{labels.run}</span>
          </Button>
        ) : null}
        {children ? (
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label={labels.actions}
                  size="icon"
                  variant="outline"
                />
              }
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">{children}</MenuPopup>
          </Menu>
        ) : null}
      </div>
    </header>
  )
}
