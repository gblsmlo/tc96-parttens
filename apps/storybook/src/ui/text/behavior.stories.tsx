import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text, textSizes } from '@tc96/ui/text'
import { expect, within } from 'storybook/test'
import { textControlArgs } from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'
import {
  textFamilyNames,
  textForegroundNames,
  textWeightNames,
} from './text-variants.ts'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'UI/Text/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const foregroundClasses = {
  base: 'text-foreground',
  destructive: 'text-destructive-foreground',
  inherit: 'text-inherit',
  muted: 'text-muted-foreground',
} as const

const familyClasses = {
  heading: 'font-heading',
  mono: 'font-mono',
  sans: 'font-sans',
} as const

export const DefaultStyle: Story = {
  render: () => <ComposedText {...textControlArgs} />,
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText('Quarterly revenue report')
    await expect(text.tagName).toBe('SPAN')
    await expect(text).toHaveAttribute('data-slot', 'text')
    await expect(text).toHaveClass(
      'text-base',
      'text-foreground',
      'font-sans',
      'font-normal',
    )
  },
}

export const MutedForeground: Story = {
  render: () => <ComposedText {...textControlArgs} foreground="muted" />,
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText('Quarterly revenue report')
    await expect(text).toHaveClass('text-muted-foreground')
    await expect(text).not.toHaveClass('text-foreground')
  },
}

export const EveryForeground: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {textForegroundNames.map((foreground) => (
        <Text foreground={foreground} key={foreground}>
          {foreground} foreground
        </Text>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const foreground of textForegroundNames) {
      await expect(canvas.getByText(`${foreground} foreground`)).toHaveClass(
        foregroundClasses[foreground],
      )
    }
  },
}

export const EverySize: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {textSizes.map((size) => (
        <Text key={size} leading="none" size={size}>
          {size} interface text
        </Text>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const size of textSizes) {
      await expect(canvas.getByText(`${size} interface text`)).toHaveClass(
        `text-${size}`,
      )
    }
  },
}

export const EveryWeight: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {textWeightNames.map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} interface text
        </Text>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const weight of textWeightNames) {
      await expect(canvas.getByText(`${weight} interface text`)).toHaveClass(
        `font-${weight}`,
      )
    }
  },
}

export const EveryFamily: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {textFamilyNames.map((family) => (
        <Text family={family} key={family}>
          {family} interface text
        </Text>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const family of textFamilyNames) {
      await expect(canvas.getByText(`${family} interface text`)).toHaveClass(
        familyClasses[family],
      )
    }
  },
}

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Text
        family="heading"
        render={<h1>Page heading</h1>}
        size="3xl"
        tracking="tight"
        weight="bold"
      />
      <Text
        family="heading"
        render={<h2>Section heading</h2>}
        size="2xl"
        weight="semibold"
      />
      <Text
        family="heading"
        render={<h3>Subsection heading</h3>}
        size="lg"
        weight="semibold"
      />
      <Text render={<h4>Checklist heading</h4>} size="sm" weight="medium" />
      <Text>Checklist item</Text>
      <Text size="sm">Compact checklist item</Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Page heading' }),
    ).toHaveClass('font-heading', 'text-3xl', 'font-bold')
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Section heading' }),
    ).toHaveClass('font-heading', 'text-2xl', 'font-semibold')
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Subsection heading' }),
    ).toHaveClass('text-lg', 'font-semibold')
    await expect(
      canvas.getByRole('heading', { level: 4, name: 'Checklist heading' }),
    ).toHaveClass('font-sans', 'text-sm', 'font-medium')
    await expect(canvas.getByText('Checklist item')).toHaveClass(
      'text-base',
      'font-normal',
    )
  },
}

export const RenderReplacesElement: Story = {
  render: () => (
    <Text id="note" render={<p />}>
      A paragraph of interface text
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText(
      'A paragraph of interface text',
    )
    await expect(text.tagName).toBe('P')
    await expect(text).toHaveAttribute('data-slot', 'text')
    await expect(text).toHaveAttribute('id', 'note')
    await expect(text).toHaveClass('text-base')
  },
}

export const ClassNameWins: Story = {
  render: () => (
    <Text className="text-sm" size="xl">
      Smaller than its size
    </Text>
  ),
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText('Smaller than its size')
    await expect(text).toHaveClass('text-sm')
    await expect(text).not.toHaveClass('text-xl')
  },
}

export const Truncated: Story = {
  render: () => (
    <div className="w-48">
      <Text render={<p />} truncate>
        A long line of interface text that does not fit the column it lives in
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText(/A long line/)
    await expect(text).toHaveClass('truncate')
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)
  },
}
