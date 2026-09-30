import { createContext, useContext } from 'react'

type Direction = 'ltr' | 'rtl'
type TriggerMode = 'click' | 'dblclick' | 'focus'

export interface EditableContextValue {
  rootId: string
  inputId: string
  labelId: string
  value: string
  editing: boolean
  dir?: Direction
  maxLength?: number
  placeholder?: string
  triggerMode: TriggerMode
  autosize: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean
  beginEditing: () => void
  cancelEditing: () => void
  submitValue: () => void
  setValue: (value: string) => void
  onEnterKeyDown?: (event: KeyboardEvent) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}

export const EditableContext = createContext<EditableContextValue | null>(null)

export function useEditableContext(consumerName: string): EditableContextValue {
  const context = useContext(EditableContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`Editable\``)
  }
  return context
}
