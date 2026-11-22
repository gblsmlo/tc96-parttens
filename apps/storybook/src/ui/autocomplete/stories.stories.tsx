import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AutocompleteControls,
  autocompleteControlArgs,
  autocompleteControlArgTypes,
} from './autocomplete-controls.ts'
import { AutocompleteCanvas } from './autocomplete-frame.tsx'
import { ComposedAutocomplete } from './autocomplete-layouts.tsx'

const meta = {
  args: autocompleteControlArgs,
  argTypes: autocompleteControlArgTypes,
  decorators: [AutocompleteCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'invalid', 'open', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedAutocomplete {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Autocomplete/Stories',
} satisfies Meta<AutocompleteControls>

export default meta

type Story = StoryObj<AutocompleteControls>

export const Default: Story = {}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Open: Story = {
  args: { open: true },
}
