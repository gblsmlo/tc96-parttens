import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExpandableList } from '@tc96/parttens'
import { expect, userEvent, within } from 'storybook/test'

const items = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`)

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Shared/Expandable List',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CollapsesAndScrollsOnceExpanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = () =>
      canvasElement.querySelector('[data-slot="expandable-list"]')
    await expect(root()).toHaveAttribute('data-expanded', 'false')
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ver todas (+5)' }),
    )
    await expect(root()).toHaveAttribute('data-expanded', 'true')
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(8)
    await expect(
      canvasElement.querySelector('[data-slot="expandable-list-scroll"]'),
    ).not.toBeNull()
    await userEvent.click(canvas.getByRole('button', { name: 'Ver menos' }))
    await expect(canvasElement.querySelectorAll('li')).toHaveLength(3)
  },
  render: () => (
    <div className="w-80">
      <ExpandableList
        expandLabel={(hidden) => `Ver todas (+${hidden})`}
        items={items}
        visibleCount={3}
      >
        {(shown) => (
          <ul>
            {shown.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </ExpandableList>
    </div>
  ),
}
