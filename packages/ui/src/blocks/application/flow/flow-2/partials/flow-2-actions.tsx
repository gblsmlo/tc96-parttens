'use client'

import { renderAnchor } from '@tc96/ui/render-anchor'
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import {
  FlowPageActions,
  type FlowPageActionsProps,
  FlowPageHeader,
} from '../../shared/flow-page-header'
import type { FlowBreadcrumbItem, FlowRenderLink } from '../../shared/types'
import { flow2Labels } from './flow-2-labels'

export interface Flow2ActionsProps
  extends Omit<FlowPageActionsProps, 'labels'> {
  actionsContainer?: Element | null
  breadcrumbs?: FlowBreadcrumbItem[]
  labels?: FlowPageActionsProps['labels']
  name: string
  renderLink?: FlowRenderLink
}

export function Flow2Actions({
  actionsContainer,
  breadcrumbs,
  labels = flow2Labels,
  name,
  renderLink = renderAnchor,
  ...rest
}: Readonly<Flow2ActionsProps>): ReactElement | null {
  if (actionsContainer === undefined) {
    return (
      <FlowPageHeader
        {...rest}
        labels={labels}
        breadcrumbs={breadcrumbs}
        name={name}
        renderLink={renderLink}
      />
    )
  }
  if (!actionsContainer) {
    return null
  }
  return createPortal(
    <FlowPageActions {...rest} labels={labels} />,
    actionsContainer,
  )
}
