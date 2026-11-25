import { ShapesIcon } from '@phosphor-icons/react'
import { TextProperty, type TextPropertyProps } from '@tc96/ui/patterns'
import { useState } from 'react'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import type { TextControls } from './text-controls.ts'

type StatefulTextProps = Omit<TextPropertyProps, 'value'> & {
  initialValue: string | null
}

export const StatefulText = ({
  initialValue,
  onCommit,
  ...props
}: Readonly<StatefulTextProps>) => {
  const [value, setValue] = useState(initialValue)

  return (
    <TextProperty
      {...props}
      onCommit={(next) => {
        onCommit?.(next)
        setValue(next)
      }}
      value={value}
      labels={{ ...ptBRPropertyLabels.text, ...props.labels }}
    />
  )
}

export interface ComposedTextProps extends TextControls {
  onCommit?: (value: string | null) => void
}

export const ComposedText = ({
  editing,
  icon,
  labelsAdd,
  labelsCopy,
  labelsFallback,
  labelsInputPlaceholder,
  value,
  ...props
}: Readonly<ComposedTextProps>) => {
  const shared = {
    ...props,
    icon: icon ? ShapesIcon : undefined,
    labels: {
      add: labelsAdd || undefined,
      copy: labelsCopy || undefined,
      fallback: labelsFallback || undefined,
      inputPlaceholder: labelsInputPlaceholder || undefined,
    },
  }

  return editing === 'none' ? (
    <TextProperty {...shared} onCommit={undefined} value={value || null} />
  ) : (
    <StatefulText
      {...shared}
      editing={editing}
      initialValue={value || null}
      key={`${editing}-${value}`}
    />
  )
}
