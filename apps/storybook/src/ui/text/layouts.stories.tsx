import type { Meta, StoryObj } from '@storybook/react-vite'
import { textControlArgs } from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Text/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AsParagraph: Story = {
  render: () => <ComposedText {...textControlArgs} element="paragraph" />,
}

export const AsHeading: Story = {
  render: () => <ComposedText {...textControlArgs} element="heading" />,
}
