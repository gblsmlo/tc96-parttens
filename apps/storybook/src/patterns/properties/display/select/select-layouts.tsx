import { SelectProperty, type SelectPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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
  grouped,
  icons,
  labelsEmptyOption,
  labelsFallback,
  value,
  ...props
}: Readonly<SelectControls>) => {
  const options = icons ? activityOptions : withoutIcons(activityOptions)
  const labels = {
    ...ptBRPropertyLabels.select,
    emptyOption: labelsEmptyOption,
    fallback: labelsFallback,
  }

  return grouped ? (
    <StatefulSelect
      {...props}
      groups={groupActivities(options)}
      initialValue={initialValueOf(value)}
      key={value}
      labels={labels}
    />
  ) : (
    <StatefulSelect
      {...props}
      initialValue={initialValueOf(value)}
      key={value}
      labels={labels}
      options={options}
    />
  )
}
