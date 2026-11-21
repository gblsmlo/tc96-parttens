import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Label } from '@tc96/ui/label'
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@tc96/ui/meter'
import { useId, useState } from 'react'
import { type MeterControls, meterControlArgs } from './meter-controls.ts'

export const ComposedMeter = ({
  label,
  max,
  min,
  showLabel,
  showValue,
  value,
}: Readonly<MeterControls>) => {
  if (!showLabel && !showValue)
    return <Meter aria-label={label} max={max} min={min} value={value} />
  return (
    <Meter
      aria-label={showLabel ? undefined : label}
      max={max}
      min={min}
      value={value}
    >
      <div className="flex items-center gap-2">
        {showLabel ? <MeterLabel>{label}</MeterLabel> : null}
        {showValue ? <MeterValue className="ms-auto" /> : null}
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  )
}

export const ValueBesideMeter = () => (
  <Meter value={60}>
    <MeterLabel>Label text</MeterLabel>
    <div className="flex items-center gap-3">
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
      <MeterValue />
    </div>
  </Meter>
)

export const StorageMeter = ({ used }: Readonly<{ used: number }>) => (
  <Meter
    getAriaValueText={(_formatted, value) => `${value} of 10 GB used`}
    max={10}
    value={used}
  >
    <div className="flex items-center gap-2">
      <MeterLabel>Storage</MeterLabel>
      <MeterValue className="ms-auto">
        {(_formatted, value) => `${value} / 10 GB`}
      </MeterValue>
    </div>
    <MeterTrack>
      <MeterIndicator />
    </MeterTrack>
  </Meter>
)

export const AdjustableMeter = () => {
  const [value, setValue] = useState(0)
  return (
    <div className="flex flex-col items-start gap-4">
      <ComposedMeter {...meterControlArgs} value={value} />
      <Button
        onClick={() => setValue((current) => Math.min(current + 25, 100))}
        size="sm"
        variant="outline"
      >
        Add 25
      </Button>
    </div>
  )
}

const strengthRules = [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]

const strengthNames = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

export const PasswordStrengthMeter = () => {
  const id = useId()
  const [password, setPassword] = useState('')
  const score = strengthRules.filter((rule) => rule.test(password)).length
  const strength = strengthNames[score] ?? 'Too weak'
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>New password</Label>
        <Input
          aria-describedby={`${id}-hint`}
          autoComplete="new-password"
          id={id}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </div>
      <Meter getAriaValueText={() => strength} max={4} value={score}>
        <div className="flex items-center gap-2">
          <MeterLabel>Password strength</MeterLabel>
          <MeterValue className="ms-auto">{() => strength}</MeterValue>
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <p className="text-muted-foreground text-sm" id={`${id}-hint`}>
        Use 8 or more characters with an uppercase letter, a number and a
        symbol.
      </p>
    </div>
  )
}
