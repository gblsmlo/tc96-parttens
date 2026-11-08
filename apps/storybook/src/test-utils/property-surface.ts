import { expect } from 'storybook/test'

function superficie(canvasElement: HTMLElement): HTMLElement {
  const encontrada = canvasElement.querySelector<HTMLElement>(
    '[data-slot="property-surface"]',
  )

  if (!encontrada) {
    throw new Error(
      'A story não renderizou nenhum [data-slot="property-surface"].',
    )
  }

  return encontrada
}

export async function esperarSuperficieDeBadge(
  canvasElement: HTMLElement,
): Promise<void> {
  await expect(superficie(canvasElement)).toHaveAttribute(
    'data-variant',
    'badge',
  )
}

export async function esperarSuperficiePlana(
  canvasElement: HTMLElement,
): Promise<void> {
  await expect(superficie(canvasElement)).toHaveAttribute(
    'data-variant',
    'plain',
  )
}

/**
 * Mede a aresta computada do avatar. Em jsdom isso era `toContain('size-6')`, uma
 * string que passa mesmo se outra classe vencer o merge do Tailwind.
 */
export async function esperarAvatarComAresta(
  canvasElement: HTMLElement,
  aresta: number,
): Promise<void> {
  const avatar = canvasElement.querySelector<HTMLElement>(
    '[data-slot="avatar"]',
  )

  if (!avatar) {
    throw new Error('A story não renderizou nenhum [data-slot="avatar"].')
  }

  const medida = avatar.getBoundingClientRect()

  await expect(medida.width).toBe(aresta)
  await expect(medida.height).toBe(aresta)
}

export async function esperarIndicadorADireita(
  option: HTMLElement,
): Promise<void> {
  const indicador = option.querySelector<HTMLElement>(':scope > span')
  const rotulo = option.querySelector<HTMLElement>(':scope > div')

  if (!indicador || !rotulo) {
    throw new Error('A opção selecionada não renderizou o indicador.')
  }

  await expect(indicador.getBoundingClientRect().left).toBeGreaterThanOrEqual(
    rotulo.getBoundingClientRect().right,
  )
}
