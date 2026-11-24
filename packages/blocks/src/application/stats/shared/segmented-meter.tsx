import { Meter } from '@tc96/ui/meter'
import { cn } from '@tc96/utils'

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
  const bars = Array.from({ length: segments }, (_, bar) => bar)

  return (
    <Meter
      aria-labelledby={labelledBy}
      className={cn('flex-row gap-1', className)}
      data-filled={filled}
      data-slot="segmented-meter"
      getAriaValueText={() => valueText}
      max={safeMax}
      min={0}
      value={Math.min(Math.max(value, 0), safeMax)}
    >
      {bars.map((bar) => (
        <span
          aria-hidden="true"
          className={cn(
            'h-4 min-w-0 flex-1 rounded-xs',
            bar < filled ? 'bg-primary' : 'bg-input',
          )}
          data-filled={bar < filled}
          key={bar}
        />
      ))}
    </Meter>
  )
}
