import { createContext, useContext } from 'react'

export type RecordStatusAnnounce = (message: string) => void

export const RecordStatusListContext =
  createContext<RecordStatusAnnounce | null>(null)

export function useRecordStatusAnnounce(): RecordStatusAnnounce {
  const announce = useContext(RecordStatusListContext)
  if (!announce)
    throw new Error('RecordStatusItem must be rendered inside RecordStatusList')
  return announce
}
