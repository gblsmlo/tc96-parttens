import type { ShellRenderLink } from './types'

export const renderAnchor: ShellRenderLink = (href) => (
  // biome-ignore lint/a11y/useAnchorContent: the render prop merges the link text into this element
  <a href={href} />
)
