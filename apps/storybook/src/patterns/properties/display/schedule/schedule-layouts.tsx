import { ptBR } from '@daypicker/react/locale'
import {
  ScheduleProperty,
  type SchedulePropertyProps,
  type ScheduleValue,
} from '@tc96/ui/patterns'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import type { ScheduleControls } from './schedule-controls.ts'
import { scheduleToday, scheduleValues } from './schedule-data.ts'

export function StatefulSchedule({
  onValueChange,
  value: initialValue,
  ...props
}: Readonly<SchedulePropertyProps>) {
  const [value, setValue] = useState<ScheduleValue>(initialValue)

  return (
    <ScheduleProperty
      {...props}
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
      value={value}
    />
  )
}

export function OpenOnMount({ children }: Readonly<{ children: ReactNode }>) {
  const frame = useRef<HTMLSpanElement>(null)
  const opened = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trigger = frame.current?.querySelector('button')
      if (opened.current || !trigger) return
      opened.current = true
      const press = { bubbles: true, button: 0, cancelable: true }
      trigger.dispatchEvent(
        new PointerEvent('pointerdown', { ...press, pointerType: 'mouse' }),
      )
      trigger.dispatchEvent(new MouseEvent('mousedown', press))
      trigger.dispatchEvent(
        new PointerEvent('pointerup', { ...press, pointerType: 'mouse' }),
      )
      trigger.dispatchEvent(new MouseEvent('mouseup', press))
      trigger.dispatchEvent(new MouseEvent('click', press))
    }, 50)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <span className="contents" ref={frame}>
      {children}
    </span>
  )
}

export function ComposedSchedule({
  calendarLocale,
  fallback,
  keepBelow,
  openOnMount,
  readOnly,
  value,
  ...props
}: Readonly<ScheduleControls>) {
  const schedule = (
    <StatefulSchedule
      {...props}
      calendarLocale={calendarLocale === 'ptBR' ? ptBR : undefined}
      dropdownPlacement={
        keepBelow ? { collisionAvoidance: { side: 'none' } } : undefined
      }
      fallback={fallback || undefined}
      readOnly={readOnly}
      today={scheduleToday}
      value={scheduleValues[value]}
    />
  )

  return (
    <span className="contents" key={`${value}-${openOnMount}`}>
      {openOnMount && !readOnly ? (
        <OpenOnMount>{schedule}</OpenOnMount>
      ) : (
        schedule
      )}
    </span>
  )
}
