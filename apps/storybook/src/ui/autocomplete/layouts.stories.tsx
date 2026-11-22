import type { Meta, StoryObj } from '@storybook/react-vite'
import { autocompleteControlArgs } from './autocomplete-controls.ts'
import { AutocompleteCanvas } from './autocomplete-frame.tsx'
import {
  ComposedAutocomplete,
  FieldAutocomplete,
  GroupedAutocomplete,
  LimitedAutocomplete,
} from './autocomplete-layouts.tsx'

const meta = {
  decorators: [AutocompleteCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Autocomplete/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithStartAddon: Story = {
  render: () => (
    <ComposedAutocomplete {...autocompleteControlArgs} startAddon />
  ),
}

export const WithTrigger: Story = {
  render: () => (
    <ComposedAutocomplete {...autocompleteControlArgs} showTrigger />
  ),
}

export const WithClear: Story = {
  render: () => (
    <ComposedAutocomplete
      {...autocompleteControlArgs}
      defaultValue="Mango"
      showClear
    />
  ),
}

export const WithGroups: Story = {
  render: () => <GroupedAutocomplete />,
}

export const WithStatus: Story = {
  render: () => <LimitedAutocomplete defaultOpen />,
}

export const InField: Story = {
  render: () => <FieldAutocomplete />,
}
