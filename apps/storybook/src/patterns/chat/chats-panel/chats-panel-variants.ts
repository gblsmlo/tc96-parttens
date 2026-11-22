export const chatsPanelVariantNames = ['plain', 'card', 'inset'] as const

export const chatsPanelContentNames = ['list', 'loading', 'empty'] as const

export type ChatsPanelContentName = (typeof chatsPanelContentNames)[number]

export const chatsPanelItemElementNames = ['button', 'link'] as const

export type ChatsPanelItemElementName =
  (typeof chatsPanelItemElementNames)[number]
