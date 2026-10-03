import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text, textSizes } from '@tc96/elements/text'
import { expect, within } from 'storybook/test'

const weights = [
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
] as const

const foregrounds = ['base', 'muted', 'destructive', 'inherit'] as const

const meta = {
  title: 'Elements/Text',
  component: Text,
  args: {
    children: 'Reusable interface text',
    family: 'sans',
    foreground: 'base',
    size: 'base',
    truncate: false,
    weight: 'normal',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify', 'start', 'end'],
    },
    family: {
      control: 'select',
      options: ['sans', 'heading', 'mono'],
    },
    foreground: {
      control: 'select',
      options: foregrounds,
    },
    leading: {
      control: 'select',
      options: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
    },
    size: {
      control: 'select',
      options: textSizes,
    },
    tracking: {
      control: 'select',
      options: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
    },
    weight: {
      control: 'select',
      options: weights,
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
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

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {weights.map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} interface text
        </Text>
      ))}
    </div>
  ),
}

export const Foregrounds: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {foregrounds.map((foreground) => (
        <Text foreground={foreground} key={foreground}>
          {foreground} foreground
        </Text>
      ))}
    </div>
  ),
}

export const Families: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text family="sans">Sans interface text</Text>
      <Text family="heading" weight="semibold">
        Heading interface text
      </Text>
      <Text family="mono">Mono technical text</Text>
    </div>
  ),
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
