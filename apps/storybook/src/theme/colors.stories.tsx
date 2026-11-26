import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ColorGroup, colorGroupNames, colorGroups } from '@tc96/themes'
import { expect } from 'storybook/test'
import { resolvedStyle, Swatch } from './theme-shapes.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Theme/Colors',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const groupTitles: Record<ColorGroup, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  base: 'Base',
  card: 'Card',
  popover: 'Popover',
  muted: 'Muted',
  destructive: 'Destructive',
  'border-input': 'Border & Input',
  chart: 'Chart',
  sidebar: 'Sidebar',
  status: 'Status',
}

const colorOnly = (token: string) => token !== 'switch-track'

export const Groups: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-8">
      {colorGroupNames.map((group) => (
        <section aria-labelledby={`group-${group}`} key={group}>
          <h2
            className="mb-3 font-heading font-semibold text-foreground text-sm"
            id={`group-${group}`}
          >
            {groupTitles[group]}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {colorGroups[group].filter(colorOnly).map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const swatches = [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="theme-swatch"]',
      ),
    ]
    await expect(swatches.length).toBeGreaterThan(40)
    for (const swatch of swatches) {
      const token = swatch.dataset.token ?? ''
      const color = resolvedStyle(swatch, 'color', `var(--${token})`)
      await expect(color, token).not.toBe('')
      await expect(getComputedStyle(swatch).backgroundColor, token).toBe(color)
    }
  },
}
