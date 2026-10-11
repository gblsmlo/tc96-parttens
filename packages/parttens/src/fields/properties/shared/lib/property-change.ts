export interface PropertyChangeHandlers<TValue, TContext> {
  action?: (value: TValue, context: TContext) => void
  onValueChange?: (value: TValue) => void
}

export function isEditable({
  action,
  onValueChange,
  readOnly = false,
}: Readonly<{
  action?: unknown
  onValueChange?: unknown
  readOnly?: boolean
}>): boolean {
  return !readOnly && Boolean(action ?? onValueChange)
}

export function emitChange<TValue, TContext>(
  { action, onValueChange }: Readonly<PropertyChangeHandlers<TValue, TContext>>,
  value: TValue,
  context: TContext,
): void {
  if (action) {
    action(value, context)
    return
  }
  onValueChange?.(value)
}
