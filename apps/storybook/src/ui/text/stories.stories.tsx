import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TextControls,
  textControlArgs,
  textControlArgTypes,
} from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  args: textControlArgs,
  argTypes: textControlArgTypes,
  parameters: {
    controls: {
      exclude: [
        'family',
        'foreground',
        'size',
        'tracking',
        'truncate',
        'weight',
      ],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedText {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Text/Stories',
} satisfies Meta<TextControls>

export default meta

type Story = StoryObj<TextControls>

export const Default: Story = {}

export const Heading: Story = {
  args: { family: 'heading' },
}

export const Mono: Story = {
  args: { family: 'mono' },
}

export const Muted: Story = {
  args: { foreground: 'muted' },
}

export const Destructive: Story = {
  args: { foreground: 'destructive' },
}

export const Inherit: Story = {
  args: { foreground: 'inherit' },
}

export const SizeXs: Story = {
  args: { size: 'xs' },
  name: 'Size xs',
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const SizeXl: Story = {
  args: { size: 'xl' },
  name: 'Size xl',
}

export const Size2xl: Story = {
  args: { size: '2xl' },
  name: 'Size 2xl',
}

export const Size4xl: Story = {
  args: { size: '4xl' },
  name: 'Size 4xl',
}

export const Size8xl: Story = {
  args: { size: '8xl' },
  name: 'Size 8xl',
}

export const Light: Story = {
  args: { weight: 'light' },
}

export const Medium: Story = {
  args: { weight: 'medium' },
}

export const Semibold: Story = {
  args: { weight: 'semibold' },
}

export const Bold: Story = {
  args: { weight: 'bold' },
}

export const Black: Story = {
  args: { weight: 'black' },
}

export const TightTracking: Story = {
  args: { tracking: 'tight' },
  name: 'Tight tracking',
}

export const WideTracking: Story = {
  args: { tracking: 'wide' },
  name: 'Wide tracking',
}

export const Truncated: Story = {
  args: {
    element: 'paragraph',
    label: 'Quarterly revenue report for the finance team of the Americas',
    truncate: true,
  },
}
