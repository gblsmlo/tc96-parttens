import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { peopleOptions } from './people-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    onValueChange: ignore,
    options: peopleOptions,
    value: ['person-1', 'person-2'],
    ariaLabel: 'Pessoas',
    placeholder: 'Adicionar pessoa',
    labels: ptBRPropertyLabels.people,
  },
  component: PeopleProperty,
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/People/API Reference',
} satisfies Meta<typeof PeopleProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('group', { name: 'Pessoas' })

    await expect(row).toHaveAttribute('data-slot', 'people-property')
    await expect(
      row.querySelectorAll('[data-slot="combobox-chip"]'),
    ).toHaveLength(2)
  },
}
