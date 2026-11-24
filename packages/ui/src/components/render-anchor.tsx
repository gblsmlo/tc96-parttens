import type { ReactElement } from "react";

export type RenderLink = (href: string) => ReactElement;

export const renderAnchor: RenderLink = (href) => (
  // biome-ignore lint/a11y/useAnchorContent: the render prop merges the link text into this element
  <a href={href} />
);
