export const sliderOrientations = ['horizontal', 'vertical'] as const

export type SliderOrientation = (typeof sliderOrientations)[number]

export const sliderThumbAlignments = ['edge', 'center'] as const

export type SliderThumbAlignment = (typeof sliderThumbAlignments)[number]

export const singleDefaultValue = 50

export const rangeDefaultValue = [25, 75]

export const scaleMarks = ['0', '25', '50', '75', '100']
