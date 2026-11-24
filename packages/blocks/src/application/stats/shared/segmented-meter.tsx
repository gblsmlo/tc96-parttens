import { Gauge } from '@tc96/ui/gauge'

export interface SegmentedMeterProps {
  className?: string
  labelledBy: string
  max: number
  segments?: number
  value: number
  valueText: string
}

export function filledSegments(value: number, max: number, segments: number) {
  if (max <= 0 || segments <= 0) return 0
  const ratio = Math.min(Math.max(value / max, 0), 1)
  return Math.round(ratio * segments)
}

export function SegmentedMeter({
  className,
  labelledBy,
  max,
  segments = 10,
  value,
  valueText,
}: Readonly<SegmentedMeterProps>) {
  const safeMax = Math.max(max, 1)
  const filled = filledSegments(value, max, segments)

  return (
    <Gauge
      aria-labelledby={labelledBy}
      className={className}
      data-filled={filled}
      data-slot="segmented-meter"
      getAriaValueText={() => valueText}
      max={safeMax}
      segments={segments}
      size="lg"
      value={Math.min(Math.max(value, 0), safeMax)}
      variant="segmented"
    />
  )
}
