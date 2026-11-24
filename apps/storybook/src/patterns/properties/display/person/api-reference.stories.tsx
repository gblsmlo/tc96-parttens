import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonProperty, PersonPropertyBadge } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { PersonCanvas } from './person-canvas.tsx'
import { type ExamplePerson, personOptions } from './person-data.ts'

const ignore = () => undefined

const meta = {
  args: {
    ariaLabel: 'Responsável',
    onValueChange: ignore,
    options: personOptions,
    value: 'gabriel',
  },
  component: PersonProperty<ExamplePerson>,
  decorators: [PersonCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Person/API Reference',
} satisfies Meta<typeof PersonProperty<ExamplePerson>>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', {
      name: 'Responsável: Gabriel Melo',
    })

    await expect(trigger).toHaveAttribute('data-slot', 'property-surface')
    await expect(
      trigger.querySelector('[data-slot="avatar"]'),
    ).toBeInTheDocument()
  },
}

export const BadgeAnatomy: Story = {
  render: () => (
    <PersonPropertyBadge
      ariaLabel="Responsável: Gabriel Melo"
      option={personOptions[1] ?? null}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Responsável: Gabriel Melo',
      }),
    ).toHaveAttribute('data-slot', 'property-surface')
  },
}
