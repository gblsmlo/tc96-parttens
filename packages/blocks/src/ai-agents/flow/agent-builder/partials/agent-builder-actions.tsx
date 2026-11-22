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
import { agentBuilderLabels } from './agent-builder-labels'

export interface AgentBuilderActionsProps
  extends Omit<FlowPageActionsProps, 'labels'> {
  actionsContainer?: Element | null
  breadcrumbs?: FlowBreadcrumbItem[]
  labels?: FlowPageActionsProps['labels']
  name: string
  renderLink?: FlowRenderLink
}

export function AgentBuilderActions({
  actionsContainer,
  breadcrumbs,
  labels = agentBuilderLabels,
  name,
  renderLink = renderAnchor,
  ...rest
}: Readonly<AgentBuilderActionsProps>): ReactElement | null {
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
