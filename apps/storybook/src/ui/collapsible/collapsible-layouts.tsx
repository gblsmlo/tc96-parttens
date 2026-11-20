import { Button } from '@tc96/ui/button'
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@tc96/ui/collapsible'
import { ChevronDownIcon } from 'lucide-react'
import {
  type CollapsibleControls,
  collapsibleControlArgs,
} from './collapsible-controls.ts'

interface ComposedCollapsibleProps extends CollapsibleControls {
  hiddenUntilFound?: boolean
  keepMounted?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export const collapsibleTriggerClassName =
  'group/trigger inline-flex items-center gap-2 font-medium text-sm'

export const Chevron = () => (
  <ChevronDownIcon
    aria-hidden="true"
    className="size-4 transition-transform group-data-panel-open/trigger:rotate-180"
  />
)

export const ComposedCollapsible = ({
  chevron,
  content,
  defaultOpen,
  disabled,
  hiddenUntilFound,
  keepMounted,
  onOpenChange,
  open,
  trigger,
}: Readonly<ComposedCollapsibleProps>) => (
  <Collapsible
    defaultOpen={defaultOpen}
    disabled={disabled}
    key={String(defaultOpen)}
    onOpenChange={onOpenChange}
    open={open}
  >
    <CollapsibleTrigger className={collapsibleTriggerClassName}>
      {trigger}
      {chevron ? <Chevron /> : null}
    </CollapsibleTrigger>
    <CollapsiblePanel
      hiddenUntilFound={hiddenUntilFound}
      keepMounted={keepMounted}
    >
      <p className="pt-2 text-muted-foreground text-sm">{content}</p>
    </CollapsiblePanel>
  </Collapsible>
)

export const ButtonTriggerCollapsible = () => (
  <Collapsible>
    <CollapsibleTrigger
      className="group/trigger"
      render={<Button variant="outline" />}
    >
      {collapsibleControlArgs.trigger}
      <Chevron />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <p className="pt-2 text-muted-foreground text-sm">
        {collapsibleControlArgs.content}
      </p>
    </CollapsiblePanel>
  </Collapsible>
)

export const IconTriggerCollapsible = () => (
  <Collapsible>
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium text-sm">Section title</span>
      <CollapsibleTrigger
        aria-label={collapsibleControlArgs.trigger}
        className="group/trigger"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <Chevron />
      </CollapsibleTrigger>
    </div>
    <CollapsiblePanel>
      <p className="pt-2 text-muted-foreground text-sm">
        {collapsibleControlArgs.content}
      </p>
    </CollapsiblePanel>
  </Collapsible>
)

export const NestedCollapsible = () => (
  <Collapsible defaultOpen>
    <CollapsibleTrigger className={collapsibleTriggerClassName}>
      {collapsibleControlArgs.trigger}
      <Chevron />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <div className="flex flex-col gap-2 pt-2 ps-4">
        <p className="text-muted-foreground text-sm">
          {collapsibleControlArgs.content}
        </p>
        <ComposedCollapsible
          {...collapsibleControlArgs}
          content="Describe what the inner panel reveals here."
          trigger="Show more details"
        />
      </div>
    </CollapsiblePanel>
  </Collapsible>
)
