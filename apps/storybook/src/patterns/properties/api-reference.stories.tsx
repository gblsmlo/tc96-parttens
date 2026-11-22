import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  EmailProperty,
  PersonProperty,
  PropertyCollection,
  PropertySurface,
  TagsProperty,
} from '@tc96/parttens'
import { CircleDotIcon, TagIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const ignore = () => undefined

const tagOptions = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
]

const people = [
  { fallback: 'AM', label: 'Ana Martins', value: 'ana' },
  { fallback: 'GM', label: 'Gabriel Melo', value: 'gabriel' },
]

const meta = {
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <PropertyCollection
      ariaLabel="PropertyCollection"
      items={[
        {
          defaultVisible: true,
          icon: CircleDotIcon,
          id: 'first',
          label: 'First',
          render: () => <Slot name="item.render()" />,
        },
        {
          defaultVisible: true,
          icon: TagIcon,
          id: 'second',
          label: 'Second',
          render: () => <Slot name="item.render()" />,
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvasElement.querySelector('fieldset[data-slot="property-collection"]'),
    ).not.toBeNull()
    await expect(canvas.getAllByText('item.render()')).toHaveLength(2)
    await expect(
      canvas.getByRole('button', { name: 'Ajustar propriedades' }),
    ).toBeVisible()
  },
}

export const Surface: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PropertySurface>badge</PropertySurface>
      <PropertySurface muted>badge muted</PropertySurface>
      <PropertySurface variant="plain">plain</PropertySurface>
      <PropertySurface muted variant="plain">
        plain muted
      </PropertySurface>
    </div>
  ),
}

export const AddTrigger: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <EmailProperty onValueChange={ignore} value={[]} />
      <EmailProperty onValueChange={ignore} value={['ana@example.com']} />
    </div>
  ),
}

export const CalendarPopover: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <DateProperty
        ariaLabel="Prazo"
        onValueChange={ignore}
        timeZone="UTC"
        value="2026-06-19T12:00:00.000Z"
      />
      <DateProperty ariaLabel="Prazo" onValueChange={ignore} value={null} />
    </div>
  ),
}

export const MultiSelect: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <TagsProperty onValueChange={ignore} options={tagOptions} value={[]} />
      <TagsProperty
        onValueChange={ignore}
        options={tagOptions}
        value={['documents', 'return']}
      />
    </div>
  ),
}

export const SelectShell: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PersonProperty
        ariaLabel="Responsável"
        onValueChange={ignore}
        options={people}
        value="gabriel"
      />
      <PersonProperty
        ariaLabel="Responsável"
        options={people}
        readOnly
        value="ana"
      />
    </div>
  ),
}
