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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedAutocomplete {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Autocomplete/Playground',
} satisfies Meta<AutocompleteControls>

export default meta

type Story = StoryObj<AutocompleteControls>

export const Playground: Story = {}
