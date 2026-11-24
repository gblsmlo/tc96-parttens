import type { ReactElement } from 'react'
import { useId } from 'react'
import { ResponsiveContainer } from 'recharts'

export interface ChartFrameProps {
  children: ReactElement
  height?: number
  label: string
  summary: string
}

export function ChartFrame({
  children,
  height = 220,
  label,
  summary,
}: Readonly<ChartFrameProps>) {
  const summaryId = useId()

  return (
    <div className="min-w-0">
      <div
        aria-describedby={summaryId}
        aria-label={label}
        className="min-w-0"
        data-slot="dashboard-chart"
        role="img"
        style={{ height }}
      >
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height, width: 480 }}
          width="100%"
        >
          {children}
        </ResponsiveContainer>
      </div>
      <p className="sr-only" id={summaryId}>
        {summary}
      </p>
    </div>
  )
}
