const tailwindAlpha = /--alpha\((.+?)\s*\/\s*([\d.]+%)\)/g

/** A token value as the browser reads it, with Tailwind's `--alpha()` compiled away. */
export function runtimeValue(value: string): string {
  return value.replace(
    tailwindAlpha,
    (_, color: string, alpha: string) =>
      `color-mix(in oklab, ${color} ${alpha}, transparent)`,
  )
}

/** Sets one theme token as an inline custom property of the element. */
export function applyStyleToElement(
  element: HTMLElement,
  token: string,
  value: string,
) {
  element.style.setProperty(`--${token}`, runtimeValue(value))
}
