import type { FlowDirection } from '@tc96/parttens'

export const canvasDirectionNames = [
  'horizontal',
  'vertical',
] as const satisfies readonly FlowDirection[]

export const canvasRunNames = [
  'last-run',
  'success',
  'running',
  'not-run',
] as const

export type CanvasRunName = (typeof canvasRunNames)[number]
