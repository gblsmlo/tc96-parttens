import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Autocomplete,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteSeparator,
  AutocompleteStatus,
} from '@tc96/ui/autocomplete'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { AutocompleteCanvas } from './autocomplete-frame.tsx'

const meta = {
  component: Autocomplete,
  decorators: [AutocompleteCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Autocomplete/API Reference',
} satisfies Meta<typeof Autocomplete>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  parameters: {
    docs: { story: { iframeHeight: '380px', inline: false } },
    layout: 'padded',
  },
  render: (args) => (
    <Autocomplete {...args}>
      <AutocompleteInput
        aria-label="AutocompleteInput"
        placeholder="AutocompleteInput"
        showTrigger
        startAddon={<IconSlot />}
        triggerProps={{ 'aria-label': 'AutocompleteTrigger' }}
      />
      <AutocompletePopup>
        <AutocompleteList>
          <AutocompleteGroup>
            <AutocompleteGroupLabel>
              <Slot name="AutocompleteGroupLabel" />
            </AutocompleteGroupLabel>
            <AutocompleteItem value="first">
              <Slot name="AutocompleteItem" />
            </AutocompleteItem>
            <AutocompleteItem value="second">
              <Slot name="AutocompleteItem" />
            </AutocompleteItem>
          </AutocompleteGroup>
          <AutocompleteSeparator />
          <AutocompleteItem value="third">
            <Slot name="AutocompleteItem" />
          </AutocompleteItem>
        </AutocompleteList>
        <AutocompleteStatus>
          <Slot name="AutocompleteStatus" />
        </AutocompleteStatus>
      </AutocompletePopup>
    </Autocomplete>
  ),
}
