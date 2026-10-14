import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateRecordWithFormDemo } from '../create-record-with-form-demo'

const meta = {
  args: { onCreate: fn(), onOpenSingle: fn() },
  component: CreateRecordWithFormDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as explicit entry: the same fields and payload as Inline Properties, as labeled fields that scroll in the panel. Use it for long bodies or required fields that need a visible label.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Simple Form',
} satisfies Meta<typeof CreateRecordWithFormDemo>

export default meta

type Story = StoryObj<typeof meta>

export const SimpleForm: Story = {
  render: (args) => <CreateRecordWithFormDemo {...args} />,
}

export const SimpleFormInteraction: Story = {
  ...SimpleForm,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const create = within(dialog).getByRole('button', {
      name: /Create Project/,
    })
    const title = within(dialog).getByRole('textbox', { name: 'Title' })

    expect(create).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.type(title, 'Aurora')
    expect(create).toBeEnabled()

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Status' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Priority' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'High' }))
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: 'Priority' }),
      ).toHaveTextContent('High'),
    )

    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: '',
        lead: null,
        priority: 'high',
        repos: [],
        startDate: null,
        status: 'in-progress',
        targetDate: null,
        title: 'Aurora',
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }))
    const reopened = await screen.findByRole('dialog', {
      name: 'New project',
    })
    await userEvent.click(
      within(reopened).getByRole('switch', { name: 'Create more' }),
    )
    const next = within(reopened).getByRole('textbox', { name: 'Title' })
    await userEvent.type(next, 'Borealis')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() => expect(args.onCreate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(next).toHaveValue(''))
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
    expect(
      within(reopened).getByRole('combobox', { name: 'Status' }),
    ).toHaveTextContent('Planned')
  },
  tags: ['!dev', '!autodocs'],
}
