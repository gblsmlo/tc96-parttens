import type { ReactElement } from 'react'

export type FlowRenderLink = (href: string) => ReactElement

export const renderAnchor: FlowRenderLink = (href) => (
  // biome-ignore lint/a11y/useAnchorContent: the render prop merges the link text into this element
  <a href={href} />
)
