import { Children, Fragment, isValidElement, type ReactNode } from 'react'

export function DescriptionSegments({
  segments,
}: Readonly<{ segments: readonly ReactNode[] }>) {
  return Children.toArray(segments).map((node, position) => (
    <Fragment
      key={isValidElement(node) ? node.key : `${position}:${String(node)}`}
    >
      {position > 0 ? (
        <span aria-hidden="true" className="px-1">
          ·
        </span>
      ) : null}
      {node}
    </Fragment>
  ))
}
