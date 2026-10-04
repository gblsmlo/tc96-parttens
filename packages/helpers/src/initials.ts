/**
 * Builds the initials shown in an avatar fallback: the first letter of the
 * first words of a label, upper-cased.
 *
 * @param label - A person or entity name; surrounding and repeated whitespace is ignored.
 * @param size - How many words contribute a letter. Defaults to two.
 * @returns The initials, or an empty string for a blank label.
 */
export function getInitials(label: string, size = 2): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, size)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/**
 * Picks the text of an avatar fallback: the explicit fallback a person carries,
 * or the initials of its label when there is none.
 *
 * @param person - Anything with a `label` and an optional `fallback`.
 * @param size - How many words contribute a letter when the label is used. Defaults to two.
 * @returns The fallback as given (only `undefined` falls through, so an empty
 * string is kept), otherwise the initials of the label.
 */
export function resolveInitials(
  person: { label: string; fallback?: string },
  size = 2,
): string {
  return person.fallback ?? getInitials(person.label, size)
}
