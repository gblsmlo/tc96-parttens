import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { resolvedStyle } from './theme-shapes.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Theme/Typography',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const families = [
  { className: 'font-sans', token: 'font-sans' },
  { className: 'font-serif', token: 'font-serif' },
  { className: 'font-mono', token: 'font-mono' },
  { className: 'font-heading', token: 'font-heading' },
] as const

export const Families: Story = {
  render: () => (
    <dl className="m-0 grid max-w-2xl grid-cols-[8rem_1fr] items-baseline gap-x-6 gap-y-4">
      {families.map(({ className, token }) => (
        <div className="contents" key={token}>
          <dt className="font-mono text-muted-foreground text-xs">--{token}</dt>
          <dd
            className={`m-0 text-foreground text-xl ${className}`}
            data-token={token}
          >
            The quick brown fox jumps over the lazy dog
          </dd>
        </div>
      ))}
    </dl>
  ),
  play: async ({ canvasElement }) => {
    for (const { token } of families) {
      const sample = canvasElement.querySelector<HTMLElement>(
        `dd[data-token="${token}"]`,
      )
      if (!sample) throw new Error(`Missing ${token}`)
      await expect(getComputedStyle(sample).fontFamily, token).toBe(
        resolvedStyle(sample, 'font-family', `var(--${token})`),
      )
    }
  },
}
