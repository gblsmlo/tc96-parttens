import type { Meta, StoryObj } from '@storybook/react-vite'
import { SeparatorCanvas } from './separator-frame.tsx'
import { SectionAboveRow } from './separator-layouts.tsx'

const meta = {
  decorators: [SeparatorCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Separator/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SectionAboveRowItems: Story = {
  render: () => <SectionAboveRow />,
}
