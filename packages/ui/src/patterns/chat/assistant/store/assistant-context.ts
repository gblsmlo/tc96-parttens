import { createContext, useContext } from 'react'
import { type AssistantLabels, assistantDefaultLabels } from '../core'

export const AssistantLabelsContext = createContext<AssistantLabels>(
  assistantDefaultLabels,
)

export const useAssistantLabels = (): AssistantLabels =>
  useContext(AssistantLabelsContext)
