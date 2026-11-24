import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  type Icon as PhosphorIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { Button, buttonVariants } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Toggle } from '@tc96/ui/toggle'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import type { ReactNode } from 'react'
import type { ToolbarControls } from './toolbar-controls.ts'

interface ToolbarItem {
  icon: PhosphorIcon
  label: string
}

const historyItems: ToolbarItem[] = [
  { icon: ArrowUUpLeftIcon, label: 'Undo' },
  { icon: ArrowUUpRightIcon, label: 'Redo' },
]

const formattingItems: ToolbarItem[] = [
  { icon: TextBIcon, label: 'Bold' },
  { icon: TextItalicIcon, label: 'Italic' },
  { icon: TextUnderlineIcon, label: 'Underline' },
]

interface ComposedToolbarProps extends ToolbarControls {
  loopFocus?: boolean
  onAction?: () => void
}

interface ItemsProps {
  children: ReactNode
  disabled?: boolean
  grouped: boolean
  label: string
  vertical: boolean
}

const Items = ({
  children,
  disabled,
  grouped,
  label,
  vertical,
}: Readonly<ItemsProps>) =>
  grouped ? (
    <ToolbarGroup
      aria-label={label}
      className={vertical ? 'flex-col' : undefined}
      disabled={disabled || undefined}
    >
      {children}
    </ToolbarGroup>
  ) : (
    children
  )

export const ComposedToolbar = ({
  action,
  disabled,
  disabledGroup,
  groups,
  input,
  link,
  loopFocus,
  onAction,
  orientation,
  separators,
}: Readonly<ComposedToolbarProps>) => {
  const vertical = orientation === 'vertical'
  return (
    <Toolbar
      aria-label="Editor"
      className={vertical ? 'flex-col' : undefined}
      disabled={disabled || undefined}
      loopFocus={loopFocus}
      orientation={orientation}
    >
      {link ? (
        <>
          <ToolbarLink
            className={buttonVariants({ variant: 'ghost' })}
            href="#documents"
          >
            {link}
          </ToolbarLink>
          {separators ? <ToolbarSeparator /> : null}
        </>
      ) : null}
      <Items grouped={groups} label="History" vertical={vertical}>
        {historyItems.map(({ icon: Icon, label }) => (
          <ToolbarButton
            aria-label={label}
            key={label}
            render={<Button size="icon" variant="ghost" />}
          >
            <Icon aria-hidden="true" />
          </ToolbarButton>
        ))}
      </Items>
      {separators ? <ToolbarSeparator /> : null}
      <Items
        disabled={disabledGroup}
        grouped={groups}
        label="Formatting"
        vertical={vertical}
      >
        {formattingItems.map(({ icon: Icon, label }) => (
          <ToolbarButton aria-label={label} key={label} render={<Toggle />}>
            <Icon aria-hidden="true" />
          </ToolbarButton>
        ))}
      </Items>
      {input ? (
        <>
          {separators ? <ToolbarSeparator /> : null}
          <ToolbarInput
            aria-label="Search"
            placeholder="Search"
            render={<Input className="w-40" />}
          />
        </>
      ) : null}
      {action ? (
        <>
          {separators ? <ToolbarSeparator /> : null}
          <ToolbarButton onClick={onAction} render={<Button />}>
            {action}
          </ToolbarButton>
        </>
      ) : null}
    </Toolbar>
  )
}
