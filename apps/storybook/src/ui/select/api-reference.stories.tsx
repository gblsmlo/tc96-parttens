import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectButton,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { SelectCanvas } from './select-frame.tsx'

const meta = {
  component: Select,
  decorators: [SelectCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Select/API Reference',
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true, defaultValue: 'first', modal: false },
  parameters: {
    docs: { story: { iframeHeight: '380px', inline: false } },
    layout: 'padded',
  },
  render: (args) => (
    <Select {...args}>
      <SelectLabel>
        <Slot name="SelectLabel" />
      </SelectLabel>
      <SelectTrigger>
        <IconSlot />
        <SelectValue>
          <Slot name="SelectValue" />
        </SelectValue>
      </SelectTrigger>
      <SelectPopup>
        <SelectGroup>
          <SelectGroupLabel>
            <Slot name="SelectGroupLabel" />
          </SelectGroupLabel>
          <SelectItem value="first">
            <Slot name="SelectItem" />
          </SelectItem>
          <SelectItem value="second">
            <Slot name="SelectItem" />
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="third">
          <Slot name="SelectItem" />
        </SelectItem>
      </SelectPopup>
    </Select>
  ),
}

export const ButtonAnatomy: Story = {
  render: () => (
    <SelectButton>
      <Slot name="children" />
    </SelectButton>
  ),
}
