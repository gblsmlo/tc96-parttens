import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneCanvas } from './phone-canvas.tsx'
import { phoneControlArgs } from './phone-controls.ts'
import { ComposedPhone } from './phone-layouts.tsx'

const meta = {
  decorators: [PhoneCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutAddTrigger: Story = {
  render: () => <ComposedPhone {...phoneControlArgs} addTrigger={false} />,
}
