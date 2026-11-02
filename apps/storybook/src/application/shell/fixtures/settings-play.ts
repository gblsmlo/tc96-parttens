import { expect, within } from 'storybook/test'

export async function expectSettingsLevel(
  canvasElement: HTMLElement,
): Promise<void> {
  const canvas = within(canvasElement)
  await expect(
    canvas.getByRole('link', { name: 'Voltar ao app' }),
  ).toHaveAttribute('href', '/')
  await expect(
    canvas.queryByRole('navigation', { name: 'Navegação principal' }),
  ).toBeNull()
  const navigation = canvas.getByRole('navigation', {
    name: 'Navegação de configurações',
  })
  await expect(
    within(navigation).getByRole('link', { name: 'Perfil' }),
  ).toHaveAttribute('aria-current', 'page')
}
