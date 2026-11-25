import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListCanvas } from './list-canvas.tsx'
import { listControlArgs } from './list-controls.ts'
import { ComposedList, HeaderList, SingleLineList } from './list-layouts.tsx'

const meta = {
  decorators: [ListCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/ListView/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnlyRows: Story = {
  render: () => (
    <ComposedList
      {...listControlArgs}
      action={false}
      description={false}
      field={false}
      leading={false}
    />
  ),
}

export const WithoutLeading: Story = {
  render: () => <ComposedList {...listControlArgs} leading={false} />,
}

export const WithoutTrailing: Story = {
  render: () => (
    <ComposedList {...listControlArgs} action={false} field={false} />
  ),
}

export const WithoutTitleTrigger: Story = {
  render: () => <ComposedList {...listControlArgs} trigger={false} />,
}

export const WithAddAction: Story = {
  render: () => <ComposedList {...listControlArgs} addAction />,
}

export const SingleLineRows: Story = {
  render: () => <SingleLineList />,
}

export const WithHeader: Story = {
  render: () => <HeaderList />,
}

export const Flat: Story = {
  render: () => <ComposedList {...listControlArgs} grouped={false} />,
}

export const CheckboxBeforeIcon: Story = {
  render: () => <ComposedList {...listControlArgs} selection="checkbox" />,
}

export const CheckboxOverIcon: Story = {
  render: () => <ComposedList {...listControlArgs} selection="icon" />,
}
