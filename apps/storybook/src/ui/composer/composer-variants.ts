export const composerLayoutNames = ['stacked', 'adaptive'] as const

export type ComposerLayoutName = (typeof composerLayoutNames)[number]

export const composerInputNames = ['contenteditable', 'textarea'] as const

export type ComposerInputName = (typeof composerInputNames)[number]

export const composerSubmitOnEnterNames = [
  'always',
  'desktop',
  'never',
] as const

export type ComposerSubmitOnEnterName =
  (typeof composerSubmitOnEnterNames)[number]

export const composerTokenVariantNames = ['default', 'chip'] as const

export type ComposerTokenVariantName =
  (typeof composerTokenVariantNames)[number]
