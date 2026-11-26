/** The Google Fonts stylesheet for the given families, regular to bold. */
export function googleFontsHref(families: string[]): string {
  const query = families
    .map(
      (family) =>
        `family=${encodeURIComponent(family).replaceAll('%20', '+')}:wght@400;500;600;700`,
    )
    .join('&')
  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

/** Whether Google Fonts serves the family; used when a preset is added. */
export async function onGoogleFonts(family: string): Promise<boolean> {
  return (await fetch(googleFontsHref([family]))).ok
}
