import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
} from '@tc96/ui/combobox'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { ComboboxCanvas } from './combobox-frame.tsx'

const meta = {
  component: Combobox,
  decorators: [ComboboxCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Combobox/API Reference',
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  parameters: {
    docs: { story: { iframeHeight: '360px', inline: false } },
    layout: 'padded',
  },
  render: (args) => (
    <Combobox {...args}>
      <ComboboxInput
        aria-label="ComboboxInput"
        placeholder="ComboboxInput"
        startAddon={<IconSlot />}
      />
      <ComboboxPopup>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxGroupLabel>
              <Slot name="ComboboxGroupLabel" />
            </ComboboxGroupLabel>
            <ComboboxItem value="first">
              <Slot name="ComboboxItem" />
            </ComboboxItem>
            <ComboboxItem value="second">
              <Slot name="ComboboxItem" />
            </ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxItem value="third">
            <Slot name="ComboboxItem" />
          </ComboboxItem>
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
}

export const ChipsAnatomy: Story = {
  render: () => (
    <Combobox defaultValue={['chip']} multiple>
      <ComboboxChips startAddon={<IconSlot />}>
        <ComboboxChip>ComboboxChip</ComboboxChip>
        <ComboboxChipsInput
          aria-label="ComboboxChipsInput"
          placeholder="ComboboxChipsInput"
        />
      </ComboboxChips>
      <ComboboxPopup>
        <ComboboxList>
          <ComboboxItem value="chip">
            <Slot name="ComboboxItem" />
          </ComboboxItem>
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  ),
}
