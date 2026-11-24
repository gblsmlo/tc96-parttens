import { SelectProperty, type SelectPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import type { SelectControls } from './select-controls.ts'
import {
  activityOptions,
  groupActivities,
  withoutIcons,
} from './select-data.ts'

type StatefulSelectProps = SelectPropertyProps extends infer Props
  ? Props extends SelectPropertyProps
    ? Omit<Props, 'onValueChange' | 'value'> & {
        initialValue: string | null
      }
    : never
  : never

export const StatefulSelect = ({
  initialValue,
  ...props
}: Readonly<StatefulSelectProps>) => {
  const [value, setValue] = useState(initialValue)

  return <SelectProperty {...props} onValueChange={setValue} value={value} />
}

const initialValueOf = (value: SelectControls['value']) =>
  value === 'none' ? null : value

export const ComposedSelect = ({
  emptyOptionLabel,
  grouped,
  icons,
  value,
  ...props
}: Readonly<SelectControls>) => {
  const options = icons ? activityOptions : withoutIcons(activityOptions)

  return grouped ? (
    <StatefulSelect
      {...props}
      emptyOptionLabel={emptyOptionLabel || undefined}
      groups={groupActivities(options)}
      initialValue={initialValueOf(value)}
      key={value}
    />
  ) : (
    <StatefulSelect
      {...props}
      emptyOptionLabel={emptyOptionLabel || undefined}
      initialValue={initialValueOf(value)}
      key={value}
      options={options}
    />
  )
}
