import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextCanvas } from './text-canvas.tsx'
import { textControlArgs } from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  decorators: [TextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutIcon: Story = {
  render: () => <ComposedText {...textControlArgs} icon={false} />,
}

export const WithCopy: Story = {
  render: () => <ComposedText {...textControlArgs} copyLabel="Copiar tipo" />,
}
