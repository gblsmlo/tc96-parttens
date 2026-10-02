'use client'

import { Text, type TextProps } from './text'

export type TitleProps = TextProps

export function Title({
  family = 'heading',
  size = 'md',
  weight = 'semibold',
  ...props
}: TitleProps) {
  return (
    <Text
      {...props}
      data-slot="title"
      family={family}
      size={size}
      weight={weight}
    />
  )
}
