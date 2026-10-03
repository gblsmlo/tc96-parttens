import { CardAction, CardHeader, CardTitle } from '@tc96/ui/card'
import type { ReactElement, ReactNode } from 'react'

export function WidgetHeader({
  action,
  title,
  titleId,
}: Readonly<{
  action?: ReactNode
  title: ReactNode
  titleId: string
}>): ReactElement {
  return (
    <CardHeader className="grid-rows-1 items-center p-5">
      <CardTitle className="font-medium text-base" id={titleId}>
        {title}
      </CardTitle>
      {action ? (
        <CardAction className="row-span-1 self-center">{action}</CardAction>
      ) : null}
    </CardHeader>
  )
}
