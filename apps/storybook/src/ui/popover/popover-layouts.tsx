import { InfoIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Popover,
  PopoverClose,
  PopoverCreateHandle,
  PopoverDescription,
  PopoverPopup,
  type PopoverPrimitive,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { useRef, useState } from 'react'
import { type PopoverControls, popoverControlArgs } from './popover-controls.ts'

export type PopoverOpenChange = (
  open: boolean,
  eventDetails: PopoverPrimitive.Root.ChangeEventDetails,
) => void

interface ComposedPopoverProps extends PopoverControls {
  defaultOpen?: boolean
  modal?: boolean | 'trap-focus'
  onOpenChange?: PopoverOpenChange
}

export const ComposedPopover = ({
  align,
  alignOffset,
  closeButton,
  defaultOpen = true,
  description,
  modal,
  onOpenChange,
  side,
  sideOffset,
  title,
  tooltipStyle,
  trigger,
}: Readonly<ComposedPopoverProps>) => (
  <Popover defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange}>
    <PopoverTrigger render={<Button variant="outline" />}>
      {trigger}
    </PopoverTrigger>
    <PopoverPopup
      align={align}
      alignOffset={alignOffset}
      aria-label={title ? undefined : trigger}
      className="max-w-80"
      side={side}
      sideOffset={sideOffset}
      tooltipStyle={tooltipStyle}
    >
      <div className="flex items-start gap-2">
        <div className="flex flex-1 flex-col gap-1">
          {title ? <PopoverTitle>{title}</PopoverTitle> : null}
          {description ? (
            <PopoverDescription>{description}</PopoverDescription>
          ) : null}
        </div>
        {closeButton ? (
          <PopoverClose
            aria-label="Close"
            render={<Button size="icon-xs" variant="ghost" />}
          >
            <XIcon aria-hidden="true" />
          </PopoverClose>
        ) : null}
      </div>
    </PopoverPopup>
  </Popover>
)

const detachedPanels = {
  first: {
    description: 'Content of the first trigger, in the shared popup.',
    title: 'First panel',
  },
  second: {
    description:
      'Content of the second trigger. The popup moves to it and resizes to fit.',
    title: 'Second panel',
  },
} as const

type DetachedPanel = keyof typeof detachedPanels

interface DetachedTriggersPopoverProps {
  defaultOpen?: boolean
}

export const DetachedTriggersPopover = ({
  defaultOpen = true,
}: Readonly<DetachedTriggersPopoverProps>) => {
  const [handle] = useState(() => PopoverCreateHandle<DetachedPanel>())

  return (
    <div className="flex gap-2">
      <PopoverTrigger
        handle={handle}
        id="popover-first-trigger"
        payload="first"
        render={<Button variant="outline" />}
      >
        First trigger
      </PopoverTrigger>
      <PopoverTrigger
        handle={handle}
        id="popover-second-trigger"
        payload="second"
        render={<Button variant="outline" />}
      >
        Second trigger
      </PopoverTrigger>
      <Popover
        defaultOpen={defaultOpen}
        defaultTriggerId={defaultOpen ? 'popover-first-trigger' : undefined}
        handle={handle}
      >
        {({ payload }) => {
          const panel = detachedPanels[payload ?? 'first']
          return (
            <PopoverPopup className="max-w-80">
              <div className="flex flex-col gap-1">
                <PopoverTitle>{panel.title}</PopoverTitle>
                <PopoverDescription>{panel.description}</PopoverDescription>
              </div>
            </PopoverPopup>
          )
        }}
      </Popover>
    </div>
  )
}

interface AnchoredPopoverProps {
  defaultOpen?: boolean
}

export const AnchoredPopover = ({
  defaultOpen = true,
}: Readonly<AnchoredPopoverProps>) => {
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex w-80 max-w-full items-center gap-2">
      <div
        className="flex h-9 flex-1 items-center rounded-lg border border-dashed px-3 text-muted-foreground text-sm"
        data-testid="popover-anchor"
        ref={anchorRef}
      >
        Anchor
      </div>
      <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger render={<Button variant="outline" />}>
          {popoverControlArgs.trigger}
        </PopoverTrigger>
        <PopoverPopup align="start" anchor={anchorRef} className="max-w-80">
          <div className="flex flex-col gap-1">
            <PopoverTitle>{popoverControlArgs.title}</PopoverTitle>
            <PopoverDescription>
              {popoverControlArgs.description}
            </PopoverDescription>
          </div>
        </PopoverPopup>
      </Popover>
    </div>
  )
}

interface PasswordHintPopoverProps {
  defaultOpen?: boolean
  onOpenChange?: PopoverOpenChange
}

export const PasswordHintPopover = ({
  defaultOpen = true,
  onOpenChange,
}: Readonly<PasswordHintPopoverProps>) => (
  <div className="flex w-72 max-w-full items-end gap-2">
    <Field className="flex-1">
      <FieldLabel>Password</FieldLabel>
      <Input autoComplete="new-password" name="password" type="password" />
    </Field>
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger
        aria-label="Password requirements"
        openOnHover
        render={<Button size="icon" variant="ghost" />}
      >
        <InfoIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup aria-label="Password requirements" side="top" tooltipStyle>
        At least 8 characters, with one number and one symbol.
      </PopoverPopup>
    </Popover>
  </div>
)
