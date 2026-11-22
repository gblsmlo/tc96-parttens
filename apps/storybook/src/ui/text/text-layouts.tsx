import { Text, type TextProps } from '@tc96/ui/text'
import type { TextControls } from './text-controls.ts'
import type { TextElementName } from './text-variants.ts'

const elementRenders: Record<TextElementName, TextProps['render']> = {
  heading: (props) => <h2 {...props} />,
  paragraph: <p />,
  span: undefined,
}

export const ComposedText = ({
  align,
  element,
  family,
  foreground,
  label,
  leading,
  size,
  tracking,
  truncate,
  weight,
}: Readonly<TextControls>) => {
  const text = (
    <Text
      align={align}
      family={family}
      foreground={foreground}
      leading={leading}
      render={elementRenders[element]}
      size={size}
      tracking={tracking}
      truncate={truncate}
      weight={weight}
    >
      {label}
    </Text>
  )
  return truncate ? <div className="w-56">{text}</div> : text
}
