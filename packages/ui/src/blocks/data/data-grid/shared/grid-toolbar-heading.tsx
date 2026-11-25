import { Text } from '@tc96/ui/text'

export interface GridToolbarHeadingProps {
  description?: string
  title: string
}

export function GridToolbarHeading({
  description,
  title,
}: Readonly<GridToolbarHeadingProps>) {
  return (
    <div className="min-w-0">
      <Text
        className="truncate leading-tight"
        family="heading"
        render={<h2>{title}</h2>}
        size="base"
        weight="semibold"
      />
      {description ? (
        <Text
          className="truncate leading-tight"
          foreground="muted"
          render={<p>{description}</p>}
          size="sm"
        />
      ) : null}
    </div>
  )
}
