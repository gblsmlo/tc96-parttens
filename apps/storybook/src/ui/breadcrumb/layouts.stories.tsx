import type { Meta, StoryObj } from '@storybook/react-vite'
import { breadcrumbControlArgs } from './breadcrumb-controls.ts'
import { ComposedBreadcrumb } from './breadcrumb-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Breadcrumb/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithEllipsisMenu: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} ellipsis />,
}

export const WithBareEllipsis: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} bareEllipsis />,
}

export const WithoutCurrentPage: Story = {
  render: () => <ComposedBreadcrumb {...breadcrumbControlArgs} page="" />,
}

export const SlashSeparator: Story = {
  render: () => (
    <ComposedBreadcrumb {...breadcrumbControlArgs} separator="slash" />
  ),
}

export const AsButtons: Story = {
  render: () => (
    <ComposedBreadcrumb {...breadcrumbControlArgs} element="button" />
  ),
}
