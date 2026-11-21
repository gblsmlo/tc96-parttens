import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BesideLabelSpinner,
  InPlaceOfContentSpinner,
  InputAddonSpinner,
} from './spinner-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Spinner/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BesideLabel: Story = {
  render: () => <BesideLabelSpinner />,
}

export const InInputAddon: Story = {
  render: () => <InputAddonSpinner />,
}

export const InPlaceOfContent: Story = {
  render: () => <InPlaceOfContentSpinner />,
}
