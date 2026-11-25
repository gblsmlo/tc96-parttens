import { EditableText, type EditableTextProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import type { EditableTextControls } from './editable-text-controls.ts'

export type StatefulEditableTextProps = Omit<EditableTextProps, 'onCommit'> & {
  onCommit?: EditableTextProps['onCommit']
}

export function StatefulEditableText({
  onCommit,
  value: initialValue,
  ...props
}: Readonly<StatefulEditableTextProps>) {
  const [value, setValue] = useState(initialValue)

  return (
    <EditableText
      {...props}
      onCommit={(next) => {
        onCommit?.(next)
        setValue(next)
      }}
      value={value}
    />
  )
}

export interface ComposedEditableTextProps extends EditableTextControls {
  onCommit?: EditableTextProps['onCommit']
}

export const ComposedEditableText = ({
  value,
  ...props
}: Readonly<ComposedEditableTextProps>) => (
  <StatefulEditableText {...props} key={value} value={value || null} />
)
