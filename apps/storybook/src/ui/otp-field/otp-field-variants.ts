export const otpFieldSizeNames = ['default', 'lg'] as const

export type OTPFieldSizeName = (typeof otpFieldSizeNames)[number]

export const otpFieldLength = 6

export const slotLabel = (index: number, length: number) =>
  `Character ${index + 1} of ${length}`
