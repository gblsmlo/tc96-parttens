import { createContext, useContext } from 'react'

export interface RowReorderContextValue {
  indexByRowId: ReadonlyMap<string, number>
}

export const RowReorderContext = createContext<RowReorderContextValue | null>(
  null,
)

export function useRowReorder() {
  return useContext(RowReorderContext)
}
