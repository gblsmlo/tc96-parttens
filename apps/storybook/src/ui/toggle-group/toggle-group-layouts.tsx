import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from '@tc96/ui/toggle-group'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import {
  BoldIcon,
  CalendarDaysIcon,
  ItalicIcon,
  KanbanIcon,
  ListIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react'
import { Fragment, useState } from 'react'
import type { ToggleGroupControls } from './toggle-group-controls.ts'
import { alignments, disabledAlignment } from './toggle-group-variants.ts'

interface ComposedToggleGroupProps extends ToggleGroupControls {
  defaultValue?: string[]
  loopFocus?: boolean
  multiple?: boolean
  onValueChange?: (value: string[]) => void
}

export const ComposedToggleGroup = ({
  defaultValue = ['left'],
  disabled,
  disabledItem,
  icons,
  label,
  loopFocus,
  multiple,
  onValueChange,
  orientation,
  separators,
  size,
  text,
  variant,
}: Readonly<ComposedToggleGroupProps>) => {
  const showText = text || !icons
  return (
    <ToggleGroup
      aria-label={label || undefined}
      defaultValue={defaultValue}
      disabled={disabled}
      loopFocus={loopFocus}
      multiple={multiple}
      onValueChange={onValueChange}
      orientation={orientation}
      size={size}
      variant={variant}
    >
      {alignments.map(({ icon: Icon, label: itemLabel, value }, index) => (
        <Fragment key={value}>
          {separators && index > 0 ? (
            <ToggleGroupSeparator
              orientation={
                orientation === 'vertical' ? 'horizontal' : 'vertical'
              }
            />
          ) : null}
          <ToggleGroupItem
            aria-label={showText ? undefined : itemLabel}
            disabled={disabledItem && value === disabledAlignment}
            value={value}
          >
            {icons ? <Icon aria-hidden="true" /> : null}
            {showText ? itemLabel : null}
          </ToggleGroupItem>
        </Fragment>
      ))}
    </ToggleGroup>
  )
}

export const viewModes = [
  { icon: ListIcon, label: 'List', value: 'list' },
  { icon: KanbanIcon, label: 'Board', value: 'board' },
  { icon: CalendarDaysIcon, label: 'Calendar', value: 'calendar' },
] as const

export type ViewMode = (typeof viewModes)[number]['value']

const isViewMode = (value: string | undefined): value is ViewMode =>
  viewModes.some((mode) => mode.value === value)

export const ViewSwitcher = () => {
  const [view, setView] = useState<ViewMode>('board')
  return (
    <ToggleGroup
      aria-label="View"
      onValueChange={(next) => {
        const [selected] = next
        if (!isViewMode(selected)) return
        setView(selected)
      }}
      value={[view]}
      variant="outline"
    >
      {viewModes.map(({ icon: Icon, label, value }, index) => (
        <Fragment key={value}>
          {index > 0 ? <ToggleGroupSeparator /> : null}
          <ToggleGroupItem value={value}>
            <Icon aria-hidden="true" />
            {label}
          </ToggleGroupItem>
        </Fragment>
      ))}
    </ToggleGroup>
  )
}

export const formattingMarks = [
  { icon: BoldIcon, label: 'Bold', shortcut: 'Ctrl+B', value: 'bold' },
  { icon: ItalicIcon, label: 'Italic', shortcut: 'Ctrl+I', value: 'italic' },
  {
    icon: UnderlineIcon,
    label: 'Underline',
    shortcut: 'Ctrl+U',
    value: 'underline',
  },
  {
    icon: StrikethroughIcon,
    label: 'Strikethrough',
    shortcut: 'Ctrl+Shift+X',
    value: 'strikethrough',
  },
] as const

export const FormattingToolbar = ({
  onValueChange,
}: Readonly<{ onValueChange?: (value: string[]) => void }>) => (
  <ToggleGroup
    aria-label="Text formatting"
    defaultValue={['bold']}
    multiple
    onValueChange={onValueChange}
    size="sm"
  >
    {formattingMarks.map(({ icon: Icon, label, shortcut, value }) => (
      <Tooltip key={value}>
        <TooltipTrigger
          render={<ToggleGroupItem aria-label={label} value={value} />}
        >
          <Icon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipPopup>
          {label} <span className="text-muted-foreground">{shortcut}</span>
        </TooltipPopup>
      </Tooltip>
    ))}
  </ToggleGroup>
)
