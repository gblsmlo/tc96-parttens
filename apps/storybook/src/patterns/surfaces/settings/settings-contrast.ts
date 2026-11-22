type Rgba = { a: number; b: number; g: number; r: number }

const rgbaOf = (color: string): Rgba => {
  const context = document.createElement('canvas').getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0, a = 255] = context.getImageData(0, 0, 1, 1).data
  return { a: a / 255, b, g, r }
}

const over = (top: Rgba, bottom: Rgba): Rgba => ({
  a: 1,
  b: top.b * top.a + bottom.b * (1 - top.a),
  g: top.g * top.a + bottom.g * (1 - top.a),
  r: top.r * top.a + bottom.r * (1 - top.a),
})

const luminance = ({ b, g, r }: Rgba) => {
  const channel = (value: number) => {
    const unit = value / 255
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrastOf = (first: Rgba, second: Rgba) => {
  const [light, dark] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  ) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

const backgroundOf = (element: Element) =>
  rgbaOf(getComputedStyle(element).backgroundColor)

export const switchContrasts = (toggle: HTMLElement, card: HTMLElement) => {
  const surface = backgroundOf(card)
  const track = over(backgroundOf(toggle), surface)
  const thumb = backgroundOf(
    toggle.querySelector('[data-slot="switch-thumb"]') as Element,
  )
  return {
    thumbOverTrack: contrastOf(thumb, track),
    trackOverCard: contrastOf(track, surface),
  }
}
