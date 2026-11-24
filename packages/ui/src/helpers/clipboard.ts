/**
 * Writes text to the system clipboard through the async Clipboard API.
 *
 * @param value - The text to copy.
 * @returns The pending write, or `undefined` when the browser exposes no
 * clipboard (insecure context or unsupported environment).
 */
export function copyToClipboard(value: string): Promise<void> | undefined {
  return navigator.clipboard?.writeText(value)
}
