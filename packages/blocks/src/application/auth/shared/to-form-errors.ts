export function toFormErrors(
  fieldErrors?: Readonly<Partial<Record<string, string>>>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [name, message] of Object.entries(fieldErrors ?? {}))
    if (message) errors[name] = message
  return errors
}
