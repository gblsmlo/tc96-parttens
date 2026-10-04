import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty, type SelectPropertyOption } from '@tc96/parttens'
import { CircleDotIcon, MailIcon, PhoneIcon, UsersIcon } from 'lucide-react'
import { useState } from 'react'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

// The catalog belongs to the consumer: here it mimics any domain enumeration.
const catalog: SelectPropertyOption[] = [
  { icon: UsersIcon, label: 'Meeting', tone: 'info', value: 'meeting' },
  { icon: PhoneIcon, label: 'Call', tone: 'success', value: 'call' },
  { icon: MailIcon, label: 'Email', tone: 'neutral', value: 'email' },
  { icon: CircleDotIcon, label: 'Other', tone: 'neutral', value: 'other' },
]

const meta = {
  argTypes: {
    ...propertyArgTypes,
    value: {
      control: 'select',
      options: catalog.map((option) => option.value),
    },
  },
  args: { ariaLabel: 'Type', options: catalog },
  component: SelectProperty,
  parameters: {
    docs: {
      description: {
        component:
          'A closed-catalog property defined by the consumer. `Status` and `Priority` ship their own vocabulary because it belongs to them; here the options come from outside, so the pattern serves any domain enumeration without carrying it (Decision 030). Icon and tone are optional per option, and `ariaLabel` is required: without a domain of its own there is no label to derive.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Select',
} satisfies Meta<typeof SelectProperty>

export default meta

type Story = StoryObj<typeof SelectProperty>

export const Default: Story = {
  args: { readOnly: true, value: 'meeting' },
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const Plain: Story = {
  args: { readOnly: true, value: 'meeting', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
}

export const Dropdown: Story = {
  render: (args) => <SelectDropdownExample {...args} />,
}

export const NoIcon: Story = {
  args: {
    options: catalog.map(({ label, value }) => ({ label, value })),
    readOnly: true,
    value: 'call',
  },
}

export const NoValue: Story = {
  args: { placeholder: 'Type', readOnly: true, value: null },
}

export const ClearValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A `null` that comes from the consumer is absence: an outline trigger with the `placeholder`. When the user picks the empty option, absence becomes a choice and the surface renders filled with the option label. That state lives in the component, so a reload that returns `null` shows absence again.',
      },
    },
  },
  render: (args) => (
    <SelectDropdownExample
      {...args}
      emptyOptionLabel="No type"
      placeholder="Type"
    />
  ),
}

export const OutsideCatalog: Story = {
  args: { fallback: 'Not provided', readOnly: true, value: 'unknown' },
}

export const Grouped: Story = {
  args: {
    ariaLabel: 'Template',
    emptyOptionLabel: 'No template',
    groups: [
      {
        label: 'Meetings',
        options: [
          { icon: UsersIcon, label: 'First meeting', value: 'meeting_first' },
          {
            icon: UsersIcon,
            label: 'Follow-up meeting',
            value: 'meeting_return',
          },
        ],
      },
      {
        label: 'Remote contact',
        options: [
          { icon: PhoneIcon, label: 'Call', value: 'call' },
          { icon: MailIcon, label: 'Email', value: 'email' },
        ],
      },
    ],
    options: undefined,
    placeholder: 'No template',
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `groups` the catalog arrives split into named sections, for lists that need to say where the options come from. `options` and `groups` are exclusive: the catalog is flat or split, never both. The empty option sits outside the sections because it belongs to none.',
      },
    },
  },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'other', onValueChange: () => undefined },
}

function SelectDropdownExample(
  args: React.ComponentProps<typeof SelectProperty>,
) {
  const [value, setValue] = useState<string | null>('meeting')

  return <SelectProperty {...args} onValueChange={setValue} value={value} />
}
