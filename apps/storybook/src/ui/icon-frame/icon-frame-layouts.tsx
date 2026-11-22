import { IconFrame, type IconFrameProps } from '@tc96/ui/icon-frame'
import { BitcoinIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { IconFrameControls } from './icon-frame-controls.ts'
import type { IconFrameElementName } from './icon-frame-variants.ts'

const elementRenders: Record<IconFrameElementName, IconFrameProps['render']> = {
  div: <div />,
  span: undefined,
}

export const ComposedIconFrame = ({
  children = <BitcoinIcon />,
  color,
  element,
  shape,
  size,
  variant,
}: Readonly<IconFrameControls & { children?: ReactNode }>) => (
  <IconFrame
    color={color || undefined}
    render={elementRenders[element]}
    shape={shape}
    size={size}
    variant={variant}
  >
    {children}
  </IconFrame>
)
