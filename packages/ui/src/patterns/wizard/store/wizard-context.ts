import { createContext, useContext } from 'react'
import type { WizardStep } from '../core'

export interface WizardContextValue {
  move: (offset: -1 | 1) => void
  next?: WizardStep
  previous?: WizardStep
}

export const WizardContext = createContext<WizardContextValue | undefined>(
  undefined,
)

export function useWizardContext(component: string): WizardContextValue {
  const context = useContext(WizardContext)
  if (!context) throw new Error(`${component} must be used inside a Wizard.`)
  return context
}
