import { Button } from '@tc96/ui/button'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@tc96/ui/progress'
import { useState } from 'react'
import type { ProgressControls } from './progress-controls.ts'

export const ComposedProgress = ({
  indeterminate,
  label,
  max,
  showLabel,
  showValue,
  value,
}: Readonly<ProgressControls>) => {
  const current = indeterminate ? null : value
  if (!showLabel && !showValue)
    return <Progress aria-label={label} max={max} value={current} />
  return (
    <Progress
      aria-label={showLabel ? undefined : label}
      max={max}
      value={current}
    >
      <div className="flex items-center gap-2">
        {showLabel ? <ProgressLabel>{label}</ProgressLabel> : null}
        {showValue ? <ProgressValue className="ms-auto" /> : null}
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}

export const ValueBesideProgress = () => (
  <Progress value={40}>
    <ProgressLabel>Label text</ProgressLabel>
    <div className="flex items-center gap-3">
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
      <ProgressValue />
    </div>
  </Progress>
)

export const UploadProgress = () => (
  <Progress
    getAriaValueText={(_formatted, value) => `${value} of 512 MB uploaded`}
    max={512}
    value={502}
  >
    <div className="flex items-center gap-2">
      <ProgressLabel>Uploading quarterly-report.pdf</ProgressLabel>
      <ProgressValue className="ms-auto">
        {(_formatted, value) => `${value} / 512 MB`}
      </ProgressValue>
    </div>
    <ProgressTrack>
      <ProgressIndicator />
    </ProgressTrack>
  </Progress>
)

export const AdvancingProgress = () => {
  const [value, setValue] = useState(25)
  const advance = () => {
    const next = Math.min(value + 25, 100)
    setValue(next)
  }
  return (
    <div className="flex flex-col items-start gap-4">
      <Progress className="w-full" value={value}>
        <div className="flex items-center gap-2">
          <ProgressLabel>Profile setup</ProgressLabel>
          <ProgressValue className="ms-auto" />
        </div>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Button onClick={advance} size="sm" variant="outline">
        Next step
      </Button>
    </div>
  )
}
