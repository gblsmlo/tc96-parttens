import { createContext, useContext } from 'react'

export const ChatsPanelTitleContext = createContext<string | undefined>(
  undefined,
)

export const useChatsPanelTitleId = (): string | undefined =>
  useContext(ChatsPanelTitleContext)
