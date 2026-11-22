import { TextProperty, type TextPropertyProps } from '@tc96/parttens'
import { ShapesIcon } from 'lucide-react'
import { useState } from 'react'
import type { TextControls } from './text-controls.ts'

type StatefulTextProps = Omit<TextPropertyProps, 'onCommit' | 'value'> & {
  initialValue: string | null
}

export const StatefulText = ({
  initialValue,
  ...props
}: Readonly<StatefulTextProps>) => {
  const [value, setValue] = useState(initialValue)

  return <TextProperty {...props} onCommit={setValue} value={value} />
}

export const ComposedText = ({
  copyLabel,
  editing,
  icon,
  inputPlaceholder,
  value,
  ...props
}: Readonly<TextControls>) => {
  const shared = {
    ...props,
    copyLabel: copyLabel || undefined,
    icon: icon ? ShapesIcon : undefined,
    inputPlaceholder: inputPlaceholder || undefined,
  }

  return editing === 'none' ? (
    <TextProperty {...shared} value={value || null} />
  ) : (
    <StatefulText
      {...shared}
      editing={editing}
      initialValue={value || null}
      key={`${editing}-${value}`}
    />
  )
}
