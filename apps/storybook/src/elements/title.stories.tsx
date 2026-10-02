import type { Meta, StoryObj } from '@storybook/react-vite'
import { Title } from '@tc96/elements/title'
import { expect, within } from 'storybook/test'

const meta = {
  title: 'Elements/Title',
  component: Title,
  args: {
    children: 'Checklist title',
    size: 'md',
    weight: 'semibold',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
  },
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Title render={<h2 />} size="lg" weight="semibold">
        Section heading
      </Title>
      <Title family="sans" render={<h3 />} size="sm" weight="medium">
        Checklist heading
      </Title>
      <Title family="sans" size="md" weight="normal">
        Checklist item
      </Title>
      <Title family="sans" size="sm" weight="normal">
        Compact checklist item
      </Title>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Section heading')).toHaveClass(
      'text-lg',
      'font-semibold',
    )
    await expect(canvas.getByText('Checklist heading')).toHaveClass(
      'text-sm',
      'font-medium',
    )
    await expect(canvas.getByText('Checklist item')).toHaveClass(
      'text-base',
      'font-normal',
    )
  },
  tags: ['storybook-test'],
}
