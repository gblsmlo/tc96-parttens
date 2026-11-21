import { Button } from '@tc96/ui/button'
import { Kbd } from '@tc96/ui/kbd'
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipPopup,
  type TooltipPrimitive,
  TooltipProvider,
  TooltipTrigger,
} from '@tc96/ui/tooltip'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  InfoIcon,
} from 'lucide-react'
import { useState } from 'react'
import type { TooltipControls } from './tooltip-controls.ts'

export type TooltipOpenChange = (
  open: boolean,
  eventDetails: TooltipPrimitive.Root.ChangeEventDetails,
) => void

interface ComposedTooltipProps extends TooltipControls {
  closeDelay?: number
  delay?: number
  disabled?: boolean
  onClick?: () => void
  onOpenChange?: TooltipOpenChange
}

export const ComposedTooltip = ({
  align,
  closeDelay,
  delay,
  disabled,
  iconOnly,
  onClick,
  onOpenChange,
  open,
  shortcut,
  side,
  sideOffset,
  text,
  trigger,
}: Readonly<ComposedTooltipProps>) => (
  <Tooltip
    defaultOpen={open}
    disabled={disabled}
    key={String(open)}
    onOpenChange={onOpenChange}
  >
    <TooltipTrigger
      closeDelay={closeDelay}
      delay={delay}
      render={
        <Button
          aria-label={iconOnly ? trigger : undefined}
          onClick={onClick}
          size={iconOnly ? 'icon' : 'default'}
          variant="outline"
        />
      }
    >
      {iconOnly ? <InfoIcon aria-hidden="true" /> : trigger}
    </TooltipTrigger>
    <TooltipPopup align={align} side={side} sideOffset={sideOffset}>
      {shortcut ? (
        <span className="flex items-center gap-2">
          {text}
          <Kbd>⌘K</Kbd>
        </span>
      ) : (
        text
      )}
    </TooltipPopup>
  </Tooltip>
)

const groupedActions = [
  { icon: AlignLeftIcon, label: 'First action' },
  { icon: AlignCenterIcon, label: 'Second action' },
  { icon: AlignRightIcon, label: 'Third action' },
] as const

interface GroupedTooltipsProps {
  defaultOpen?: boolean
  delay?: number
}

export const GroupedTooltips = ({
  defaultOpen = true,
  delay,
}: Readonly<GroupedTooltipsProps>) => (
  <TooltipProvider delay={delay}>
    <div className="flex gap-2">
      {groupedActions.map(({ icon: Icon, label }, index) => (
        <Tooltip defaultOpen={defaultOpen && index === 0} key={label}>
          <TooltipTrigger
            render={<Button aria-label={label} size="icon" variant="outline" />}
          >
            <Icon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipPopup>{label}</TooltipPopup>
        </Tooltip>
      ))}
    </div>
  </TooltipProvider>
)

const sharedTriggers = [
  {
    hint: 'The hint of the first trigger',
    id: 'shared-tooltip-first',
    label: 'First',
  },
  {
    hint: 'The hint of the second trigger',
    id: 'shared-tooltip-second',
    label: 'Second',
  },
  {
    hint: 'The hint of the third trigger',
    id: 'shared-tooltip-third',
    label: 'Third',
  },
] as const

interface SharedTooltipProps {
  defaultOpen?: boolean
  delay?: number
}

export const SharedTooltip = ({
  defaultOpen = true,
  delay,
}: Readonly<SharedTooltipProps>) => {
  const [handle] = useState(() => TooltipCreateHandle<string>())

  return (
    <div className="flex gap-2">
      {sharedTriggers.map(({ hint, id, label }) => (
        <TooltipTrigger
          delay={delay}
          handle={handle}
          id={id}
          key={id}
          payload={hint}
          render={<Button variant="outline" />}
        >
          {label}
        </TooltipTrigger>
      ))}
      <Tooltip
        defaultOpen={defaultOpen}
        defaultTriggerId={defaultOpen ? sharedTriggers[0].id : undefined}
        handle={handle}
      >
        {({ payload }) => <TooltipPopup>{payload}</TooltipPopup>}
      </Tooltip>
    </div>
  )
}
