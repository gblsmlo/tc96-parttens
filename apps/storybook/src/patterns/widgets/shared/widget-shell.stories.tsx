import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetShell } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Shared/Widget Shell',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TransparentBorderAndCardShadow: Story = {
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('section[data-slot="card"]')
    await expect(shell).toHaveClass('p-2')
    await expect(
      within(canvasElement).getByRole('region', { name: 'Moldura' }),
    ).toBeVisible()
  },
  render: () => (
    <WidgetShell aria-label="Moldura" className="p-2">
      conteúdo
    </WidgetShell>
  ),
}
