import { RadioGroupPrimitive, RadioPrimitive } from '@tc96/ui/radio-group'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tc96/ui/segmented-control'
import { TogglePrimitive } from '@tc96/ui/toggle'
import { ToggleGroupPrimitive } from '@tc96/ui/toggle-group'
import type { ComponentProps, ReactElement } from 'react'
import type { SegmentedControlControls } from './segmented-control-controls.ts'
import {
  disabledRange,
  type RangeValue,
  ranges,
  type SegmentedControlElementName,
} from './segmented-control-variants.ts'

export interface ValueChangeProps {
  onValueChange?: (value: unknown) => void
}

interface ItemState {
  active: boolean
  disabled: boolean
  value: RangeValue
}

const itemRender = (
  element: SegmentedControlElementName,
  { active, disabled, value }: ItemState,
): ComponentProps<typeof SegmentedControlItem>['render'] => {
  if (element === 'radio') {
    return <RadioPrimitive.Root disabled={disabled} value={value} />
  }
  if (element === 'toggle') {
    return <TogglePrimitive disabled={disabled} value={value} />
  }
  return (props) => (
    <a
      {...props}
      aria-current={active ? 'page' : undefined}
      href={`#${value}`}
    />
  )
}

const rootRender = (
  element: SegmentedControlElementName,
  selected: RangeValue | undefined,
  onValueChange: ValueChangeProps['onValueChange'],
): ReactElement => {
  if (element === 'radio') {
    return (
      <RadioGroupPrimitive
        defaultValue={selected}
        onValueChange={(value) => onValueChange?.(value)}
      />
    )
  }
  if (element === 'toggle') {
    return (
      <ToggleGroupPrimitive
        defaultValue={selected ? [selected] : []}
        onValueChange={(value) => onValueChange?.(value)}
      />
    )
  }
  return <nav />
}

export const ComposedSegmentedControl = ({
  dayLabel,
  disabledItem,
  element,
  icon,
  monthLabel,
  onValueChange,
  size,
  value,
  weekLabel,
}: Readonly<SegmentedControlControls & ValueChangeProps>) => {
  const labels: Record<RangeValue, string> = {
    day: dayLabel,
    month: monthLabel,
    week: weekLabel,
  }
  const selected = value === 'none' ? undefined : value

  return (
    <SegmentedControl
      aria-label="Range"
      key={`${element}-${value}`}
      render={rootRender(element, selected, onValueChange)}
      size={size}
    >
      {ranges.map(({ icon: Icon, label: name, value: itemValue }) => {
        const text = labels[itemValue]
        return (
          <SegmentedControlItem
            aria-label={text ? undefined : name}
            key={itemValue}
            render={itemRender(element, {
              active: itemValue === selected,
              disabled: disabledItem && itemValue === disabledRange,
              value: itemValue,
            })}
          >
            {icon || !text ? <Icon aria-hidden="true" /> : null}
            {text}
          </SegmentedControlItem>
        )
      })}
    </SegmentedControl>
  )
}
