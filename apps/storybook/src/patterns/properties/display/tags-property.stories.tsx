import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty, type TagsPropertyOption } from '@tc96/parttens'
import { useState } from 'react'
import { expect } from 'storybook/test'
import {
  booleanArgType,
  propertyArgTypes,
} from '../../../test-utils/story-arg-types'

type ExampleTag = string

const initialOptions: TagsPropertyOption<ExampleTag>[] = [
  { label: 'Documents', value: 'documents' },
  { label: 'Return', value: 'return' },
  { label: 'Urgent', value: 'urgent' },
]

const meta = {
  argTypes: {
    ...propertyArgTypes,
    display: { control: 'inline-radio', options: ['chips', 'count'] },
    isLoading: booleanArgType,
  },
  component: TagsProperty,
  parameters: {
    docs: {
      description: {
        component:
          'Neutral property for tag collections with plain as the default variant and secondary badges for the selected values. The add trigger uses the tag and plus icons, stays as the last element and lets the chips wrap onto new lines; the popover keeps its own width and does not follow the row.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Tags',
} satisfies Meta<typeof TagsProperty>

export default meta

type Story = StoryObj<typeof TagsProperty>

export const Trigger: Story = {
  play: async ({ canvas }) => {
    // The add tag trigger is a 24px square, the same footing as the badge scale.
    const trigger = await canvas.findByRole('button', { name: 'Adicionar tag' })
    const size = trigger.getBoundingClientRect()

    await expect(size.width).toBe(24)
    await expect(size.height).toBe(24)
  },
  parameters: {
    docs: {
      description: {
        story: 'Editable case with a catalog controlled by the consumer.',
      },
    },
  },
  render: () => <TagsPropertyExample />,
}

export const Plain: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Surface used in SummaryProperty: preserves all the interaction without introducing a second visual field inside the row.',
      },
    },
  },
  render: () => <TagsPropertyExample variant="plain" />,
}

/** In a collection row the width belongs to the other properties, so only the count shows and the same popover stays behind the trigger. */
export const Count: Story = {
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole('button', { name: 'Tags' })

    await expect(trigger.textContent).toContain('1')
    await expect(canvas.queryByText('Documents')).toBe(null)
  },
  render: () => <TagsPropertyExample display="count" />,
}

export const ReadOnly: Story = {
  args: {
    options: initialOptions,
    readOnly: true,
    value: ['documents', 'urgent'],
    variant: 'plain',
  },
}

function TagsPropertyExample({
  display,
  variant = 'plain',
}: Readonly<{ display?: 'chips' | 'count'; variant?: 'badge' | 'plain' }>) {
  const options = initialOptions
  const [value, setValue] = useState<readonly string[]>(['documents'])

  return (
    <div className="max-w-sm p-4">
      <TagsProperty
        ariaLabel="Tags"
        display={display}
        onValueChange={setValue}
        options={options}
        value={value}
        variant={variant}
      />
    </div>
  )
}
