import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  LeadingIconButton,
  LinkElementButton,
  TrailingIconButton,
} from './button-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Button/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LeadingIcon: Story = {
  render: () => <LeadingIconButton />,
}

export const TrailingIcon: Story = {
  render: () => <TrailingIconButton />,
}

export const AsLink: Story = {
  render: () => <LinkElementButton />,
}
