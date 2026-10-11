import { createContext, useContext } from 'react'

export const SettingsSectionTitleIdContext = createContext<string | undefined>(
  undefined,
)

export function useSettingsSectionTitleId(): string | undefined {
  return useContext(SettingsSectionTitleIdContext)
}
