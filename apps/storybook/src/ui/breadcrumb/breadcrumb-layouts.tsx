import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Fragment } from 'react'
import type { BreadcrumbControls } from './breadcrumb-controls.ts'
import {
  type BreadcrumbElementName,
  type BreadcrumbLevel,
  type BreadcrumbSeparatorName,
  breadcrumbHiddenLevels,
  breadcrumbParentLevel,
  breadcrumbRootLevel,
} from './breadcrumb-variants.ts'

interface ComposedBreadcrumbProps extends BreadcrumbControls {
  bareEllipsis?: boolean
  onNavigate?: (href: string) => void
}

const Separator = ({
  separator,
}: Readonly<{ separator: BreadcrumbSeparatorName }>) => (
  <BreadcrumbSeparator>
    {separator === 'slash' ? '/' : undefined}
  </BreadcrumbSeparator>
)

const LevelLink = ({
  element,
  level,
  onNavigate,
}: Readonly<{
  element: BreadcrumbElementName
  level: BreadcrumbLevel
  onNavigate?: (href: string) => void
}>) =>
  element === 'button' ? (
    <BreadcrumbLink
      onClick={() => onNavigate?.(level.href)}
      render={(props) => <button {...props} type="button" />}
    >
      {level.label}
    </BreadcrumbLink>
  ) : (
    <BreadcrumbLink href={level.href}>{level.label}</BreadcrumbLink>
  )

export const CollapsedLevelsMenu = ({
  element,
  levels,
  onNavigate,
}: Readonly<{
  element: BreadcrumbElementName
  levels: readonly BreadcrumbLevel[]
  onNavigate?: (href: string) => void
}>) => (
  <Menu>
    <MenuTrigger
      aria-label={`Show ${levels.length} more levels`}
      render={<Button size="icon-xs" variant="ghost" />}
    >
      <BreadcrumbEllipsis />
    </MenuTrigger>
    <MenuPopup align="start">
      {levels.map((level) =>
        element === 'button' ? (
          <MenuItem key={level.href} onClick={() => onNavigate?.(level.href)}>
            {level.label}
          </MenuItem>
        ) : (
          <MenuLinkItem href={level.href} key={level.href}>
            {level.label}
          </MenuLinkItem>
        ),
      )}
    </MenuPopup>
  </Menu>
)

export const ComposedBreadcrumb = ({
  bareEllipsis,
  element,
  ellipsis,
  onNavigate,
  page,
  separator,
}: Readonly<ComposedBreadcrumbProps>) => {
  const middle =
    !ellipsis && !bareEllipsis
      ? breadcrumbHiddenLevels.map((level) => (
          <Fragment key={level.href}>
            <BreadcrumbItem>
              <LevelLink
                element={element}
                level={level}
                onNavigate={onNavigate}
              />
            </BreadcrumbItem>
            <Separator separator={separator} />
          </Fragment>
        ))
      : [
          <BreadcrumbItem key="collapsed">
            {bareEllipsis ? (
              <BreadcrumbEllipsis />
            ) : (
              <CollapsedLevelsMenu
                element={element}
                levels={breadcrumbHiddenLevels}
                onNavigate={onNavigate}
              />
            )}
          </BreadcrumbItem>,
          <Separator key="collapsed-separator" separator={separator} />,
        ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <LevelLink
            element={element}
            level={breadcrumbRootLevel}
            onNavigate={onNavigate}
          />
        </BreadcrumbItem>
        <Separator separator={separator} />
        {middle}
        <BreadcrumbItem>
          <LevelLink
            element={element}
            level={breadcrumbParentLevel}
            onNavigate={onNavigate}
          />
        </BreadcrumbItem>
        {page ? (
          <>
            <Separator separator={separator} />
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
