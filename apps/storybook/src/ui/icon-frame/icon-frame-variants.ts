export const iconFrameElementNames = ['span', 'div'] as const

export type IconFrameElementName = (typeof iconFrameElementNames)[number]
