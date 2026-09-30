import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Text } from 'tc96/ui'

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
  title: 'UI/Text',
  component: Text,
  args: {
    children: 'Reusable interface text',
    family: 'sans',
    foreground: 'base',
    size: 'md',
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
      options: ['sm', 'md', 'lg'],
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text size="sm">Small interface text</Text>
      <Text>Medium interface text</Text>
      <Text size="lg">Large interface text</Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Small interface text')).toHaveClass('text-sm')
    await expect(canvas.getByText('Medium interface text')).toHaveClass('text-base')
    await expect(canvas.getByText('Large interface text')).toHaveClass('text-lg')
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

export const PolymorphicHeading: Story = {
  render: () => (
    <Text
      family="heading"
      render={<h2>Semantic heading</h2>}
      size="lg"
      weight="semibold"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { level: 2, name: 'Semantic heading' }),
    ).toBeVisible()
  },
}
