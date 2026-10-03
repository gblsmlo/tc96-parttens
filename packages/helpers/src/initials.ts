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
