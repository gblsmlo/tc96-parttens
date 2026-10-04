import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonProperty, type PersonPropertyOption } from '@tc96/parttens'
import { useState } from 'react'
import {
  esperarAvatarComAresta,
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../test-utils/property-surface'
import { propertyArgTypes } from '../../../test-utils/story-arg-types'

type ExamplePerson = 'ana' | 'gabriel' | 'marina'

const options: PersonPropertyOption<ExamplePerson>[] = [
  {
    fallback: 'AM',
    label: 'Ana Martins',
    supportingLabel: 'Ops',
    value: 'ana',
  },
  {
    fallback: 'GM',
    label: 'Gabriel Melo',
    supportingLabel: 'Owner',
    value: 'gabriel',
  },
  {
    fallback: 'MS',
    label: 'Marina Souza',
    supportingLabel: 'Sales',
    value: 'marina',
  },
]

const meta = {
  argTypes: {
    ...propertyArgTypes,
    display: { control: 'inline-radio', options: ['avatar', 'full'] },
  },
  component: PersonProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Person property unit with an avatar for assignee, owner, member or any human reference. Badge is the default surface; plain integrates the same visual unit into other components.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Person',
} satisfies Meta<typeof PersonProperty>

export default meta

type Story = StoryObj<typeof PersonProperty<ExamplePerson>>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
    await esperarAvatarComAresta(canvasElement, 16)
  },
  args: {
    options,
    readOnly: true,
    value: 'gabriel',
  },
}

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
    await esperarAvatarComAresta(canvasElement, 28)
  },
  args: {
    options,
    readOnly: true,
    value: 'gabriel',
    variant: 'plain',
  },
}

export const AvatarOnly: Story = {
  play: async ({ canvasElement }) => {
    await esperarAvatarComAresta(canvasElement, 16)
  },
  args: {
    ariaLabel: 'Assignee',
    display: 'avatar',
    options,
    readOnly: true,
    value: 'gabriel',
    variant: 'plain',
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compact display for rows and cards. Keeps the person's name in the accessible label and shows only the avatar.",
      },
    },
  },
}

export const Trigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Editable use case: the person badge works as the trigger and opens a list in SelectPopup. Use AssignedProperty when the property semantics are responsible person or assignee.',
      },
    },
  },
  render: () => <PersonDropdownExample />,
}

export const Owner: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Owner use case: a person property configured by the consumer with owner-specific label, placeholder, dropdown placement, and update callback.',
      },
    },
  },
  render: () => <OwnerPropertyExample />,
}

export const Empty: Story = {
  args: {
    options,
    placeholder: 'Add members',
    readOnly: true,
    value: null,
  },
}

function PersonDropdownExample() {
  const [value, setValue] = useState<ExamplePerson | null>('gabriel')

  return (
    <div className="p-4">
      <PersonProperty
        ariaLabel="Assignee"
        options={options}
        placeholder="Add members"
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}

function OwnerPropertyExample() {
  const [value, setValue] = useState<ExamplePerson | null>('ana')

  return (
    <div className="p-4">
      <PersonProperty
        ariaLabel="Owner"
        dropdownPlacement={{ align: 'start', side: 'bottom', sideOffset: 8 }}
        options={options}
        placeholder="Add owner"
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
