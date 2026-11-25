import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty } from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { TagsCanvas } from './tags-canvas.tsx'
import { tagOptions } from './tags-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'Tags',
    onValueChange: ignore,
    options: tagOptions,
    value: ['documents', 'urgent'],
    placeholder: 'Adicionar uma tag',
    labels: ptBRPropertyLabels.tags,
  },
  component: TagsProperty,
  decorators: [TagsCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Tags/API Reference',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="tags-property"]')

    await expect(row).toHaveAttribute('data-display', 'chips')
    await expect(
      row?.querySelectorAll('[data-slot="combobox-chip"]'),
    ).toHaveLength(2)
  },
}
