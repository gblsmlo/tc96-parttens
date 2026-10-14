import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateEventDemo } from './create-event-demo'
import { CreateRecordDemo } from './create-record-demo'

const failProject = fn(() => {
  throw new Error('Could not create the project. Try again.')
})
const failEvent = fn(() => {
  throw new Error('Could not save the event. Try again.')
})

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          'The settle rule on the real create bodies. When the save fails the dialog stays open, the title and the properties keep their values, the message shows in the alert above the footer and focus returns to the submit button.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Failed Submit',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const InlineProperties: Story = {
  beforeEach: () => {
    failProject.mockClear()
  },
  render: () => (
    <CreateRecordDemo onCreate={failProject} onOpenSingle={() => undefined} />
  ),
}

export const InlinePropertiesInteraction: Story = {
  ...InlineProperties,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const title = within(dialog).getByRole('textbox', { name: 'Project title' })
    const status = within(dialog).getByRole('combobox', { name: /^Status/ })
    const create = within(dialog).getByRole('button', {
      name: 'Create Project',
    })

    await userEvent.type(title, 'Aurora')
    await userEvent.click(status)
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await waitFor(() => expect(status).toHaveTextContent('In progress'))

    await userEvent.click(create)
    await within(dialog).findByRole('button', { name: 'Creating' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not create the project. Try again.',
    )

    await waitFor(() => expect(create).toBeEnabled())
    expect(failProject).toHaveBeenCalledTimes(1)
    expect(title).toHaveValue('Aurora')
    expect(status).toHaveTextContent('In progress')
    expect(dialog).toBeVisible()
    expect(document.activeElement).toBe(create)
  },
  tags: ['!dev', '!autodocs'],
}

export const RowProperties: Story = {
  beforeEach: () => {
    failEvent.mockClear()
  },
  render: () => <CreateEventDemo onCreate={failEvent} />,
}

export const RowPropertiesInteraction: Story = {
  ...RowProperties,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'New event' })
    const title = within(dialog).getByRole('textbox', { name: 'Event title' })
    const calendar = within(dialog).getByRole('combobox', { name: /^Calendar/ })
    const save = within(dialog).getByRole('button', { name: 'Save' })

    await userEvent.type(title, 'Discovery call')
    await userEvent.click(calendar)
    await userEvent.click(await screen.findByRole('option', { name: 'Sales' }))
    await waitFor(() => expect(calendar).toHaveTextContent('Sales'))

    await userEvent.click(save)
    await within(dialog).findByRole('button', { name: 'Saving' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not save the event. Try again.',
    )

    await waitFor(() => expect(save).toBeEnabled())
    expect(failEvent).toHaveBeenCalledTimes(1)
    expect(title).toHaveValue('Discovery call')
    expect(calendar).toHaveTextContent('Sales')
    expect(
      within(dialog).getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 14:00 – 15:00')
    expect(dialog).toBeVisible()
    expect(document.activeElement).toBe(save)
  },
  tags: ['!dev', '!autodocs'],
}
