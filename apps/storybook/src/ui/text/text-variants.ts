export const textAlignNames = [
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
] as const

export type TextAlignName = (typeof textAlignNames)[number]

export const textFamilyNames = ['sans', 'heading', 'mono'] as const

export type TextFamilyName = (typeof textFamilyNames)[number]

export const textForegroundNames = [
  'base',
  'muted',
  'destructive',
  'inherit',
] as const

export type TextForegroundName = (typeof textForegroundNames)[number]

export const textLeadingNames = [
  'none',
  'tight',
  'snug',
  'normal',
  'relaxed',
  'loose',
] as const

export type TextLeadingName = (typeof textLeadingNames)[number]

export const textTrackingNames = [
  'tighter',
  'tight',
  'normal',
  'wide',
  'wider',
  'widest',
] as const

export type TextTrackingName = (typeof textTrackingNames)[number]

export const textWeightNames = [
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
] as const

export type TextWeightName = (typeof textWeightNames)[number]

export const textElementNames = ['span', 'paragraph', 'heading'] as const

export type TextElementName = (typeof textElementNames)[number]
