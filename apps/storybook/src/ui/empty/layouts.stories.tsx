import type { Meta, StoryObj } from '@storybook/react-vite'
import { emptyControlArgs } from './empty-controls.ts'
import { EmptyCanvas } from './empty-frame.tsx'
import {
  ActionRowEmpty,
  ComposedEmpty,
  InputInContentEmpty,
  LinkInDescriptionEmpty,
} from './empty-layouts.tsx'

const meta = {
  decorators: [EmptyCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Empty/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutMedia: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} media={false} />,
}

export const WithoutActions: Story = {
  render: () => <ComposedEmpty {...emptyControlArgs} actions={false} />,
}

export const TitleOnly: Story = {
  render: () => (
    <ComposedEmpty
      {...emptyControlArgs}
      actions={false}
      description=""
      media={false}
    />
  ),
}

export const ActionRow: Story = {
  render: () => <ActionRowEmpty />,
}

export const LinkInDescription: Story = {
  render: () => <LinkInDescriptionEmpty />,
}

export const InputInContent: Story = {
  render: () => <InputInContentEmpty />,
}
