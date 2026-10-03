import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconFrame,
  iconFrameShapes,
  iconFrameSizes,
  iconFrameVariantNames,
} from '@tc96/elements/icon-frame'
import { BitcoinIcon, GemIcon, ShoppingCartIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Elements/IconFrame',
  component: IconFrame,
  args: {
    color: '#f7931a',
    shape: 'circle',
    size: 'default',
    variant: 'color',
  },
  argTypes: {
    color: { control: 'color' },
    shape: { control: 'select', options: iconFrameShapes },
    size: { control: 'select', options: iconFrameSizes },
    variant: { control: 'select', options: iconFrameVariantNames },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Moldura decorativa para o ícone de um ativo, categoria ou canal, em círculo ou com cantos `lg`. A variante `color` tinge o fundo com 6% da cor e pinta o ícone; `plain` só pinta o ícone. Sem `color`, usa `muted` e `foreground` do tema.',
      },
    },
  },
  render: (args) => (
    <IconFrame {...args}>
      <BitcoinIcon />
    </IconFrame>
  ),
} satisfies Meta<typeof IconFrame>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4" data-testid="sizes">
      {iconFrameSizes.map((size) => (
        <IconFrame key={size} {...args} size={size}>
          <GemIcon />
        </IconFrame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const circles = within(canvasElement)
      .getByTestId('sizes')
      .querySelectorAll('[data-slot="icon-frame"]')
    await expect(circles).toHaveLength(3)
    await expect(circles[0]).toHaveAttribute('data-size', 'default')
    await expect(circles[2]).toHaveAttribute('data-size', 'xl')
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {iconFrameVariantNames.map((variant) => (
        <IconFrame key={variant} {...args} variant={variant}>
          <ShoppingCartIcon />
        </IconFrame>
      ))}
      <IconFrame size={args.size}>
        <ShoppingCartIcon />
      </IconFrame>
    </div>
  ),
}

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4" data-testid="shapes">
      {iconFrameShapes.map((shape) => (
        <IconFrame key={shape} {...args} shape={shape}>
          <GemIcon />
        </IconFrame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frames = within(canvasElement)
      .getByTestId('shapes')
      .querySelectorAll('[data-slot="icon-frame"]')
    await expect(frames[0]).toHaveAttribute('data-shape', 'circle')
    await expect(frames[1]).toHaveAttribute('data-shape', 'rounded')
  },
}
