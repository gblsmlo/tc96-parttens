import { expect } from 'storybook/test'

/**
 * A superfície de uma property tem dois tratamentos: `badge`, preenchida, e `plain`,
 * sem preenchimento. Em jsdom isso só era verificável pela string de classe, que passa
 * mesmo quando o utilitário não resolve. Aqui a evidência é a cor de fundo computada.
 */
const SEM_PREENCHIMENTO = 'rgba(0, 0, 0, 0)'

function superficie(canvasElement: HTMLElement): HTMLElement {
  const encontrada = canvasElement.querySelector<HTMLElement>('[data-slot="property-surface"]')

  if (!encontrada) {
    throw new Error('A story não renderizou nenhum [data-slot="property-surface"].')
  }

  return encontrada
}

export async function esperarSuperficieDeBadge(canvasElement: HTMLElement): Promise<void> {
  await expect(getComputedStyle(superficie(canvasElement)).backgroundColor).not.toBe(
    SEM_PREENCHIMENTO,
  )
}

export async function esperarSuperficiePlana(canvasElement: HTMLElement): Promise<void> {
  await expect(getComputedStyle(superficie(canvasElement)).backgroundColor).toBe(SEM_PREENCHIMENTO)
}

/**
 * O avatar de uma property muda de aresta conforme a superfície: 20px dentro do badge
 * de 24px, 28px na superfície plana. Em jsdom isso era `toContain('size-5')` — uma
 * string que passa mesmo se outra classe vencer o merge do Tailwind.
 */
export async function esperarAvatarComAresta(
  canvasElement: HTMLElement,
  aresta: number,
): Promise<void> {
  const avatar = canvasElement.querySelector<HTMLElement>('[data-slot="avatar"]')

  if (!avatar) {
    throw new Error('A story não renderizou nenhum [data-slot="avatar"].')
  }

  const medida = avatar.getBoundingClientRect()

  await expect(medida.width).toBe(aresta)
  await expect(medida.height).toBe(aresta)
}
