import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { CreateRecordDemo } from '../create-record-demo'

const meta = {
  args: { onCreate: fn(), onOpenSingle: fn() },
  component: CreateRecordDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as quick capture with the properties inline: a borderless title and description, and every property as a chip pinned to the bottom. Use it when the fields are few and optional.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Inline Properties',
} satisfies Meta<typeof CreateRecordDemo>

export default meta

type Story = StoryObj<typeof meta>

export const InlineProperties: Story = {
  render: (args) => <CreateRecordDemo {...args} />,
}

export const InlinePropertiesInteraction: Story = {
  ...InlineProperties,
  tags: ['!dev', '!autodocs'],
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const create = within(dialog).getByRole('button', {
      name: 'Create Project',
    })

    expect(create).toBeDisabled()
    const titleInput = within(dialog).getByRole('textbox', {
      name: 'Project title',
    })
    await waitFor(() => expect(titleInput).toHaveFocus())
    await userEvent.tab()
    expect(titleInput).not.toHaveFocus()
    const box = titleInput.getBoundingClientRect()
    await userEvent.pointer({
      coords: { clientX: box.right - 4, clientY: box.top + box.height / 2 },
      keys: '[MouseLeft]',
      target: titleInput,
    })
    expect(titleInput).toHaveFocus()
    expect(within(dialog).queryByRole('button', { name: 'Cancel' })).toBeNull()

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Open as page' }),
    )
    expect(args.onOpenSingle).toHaveBeenCalledTimes(1)

    const panel = document.querySelector('[data-slot="dialog-panel"]')
    const chip = within(dialog).getByRole('combobox', { name: /^Status/ })
    expect(
      (panel?.getBoundingClientRect().bottom ?? 0) -
        chip.getBoundingClientRect().bottom,
    ).toBeLessThan(40)

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Project title' }),
      'Aurora',
    )
    expect(create).toBeEnabled()

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Status/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Status/ }),
      ).toHaveTextContent('In progress'),
    )

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Priority/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'High' }))
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Priority/ }),
      ).toHaveTextContent('High'),
    )

    await userEvent.click(within(dialog).getByRole('button', { name: 'Repos' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'lemind/web' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'web' })).toBeVisible(),
    )
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
    expect(args.onCreate).not.toHaveBeenCalled()

    await userEvent.click(create)

    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: '',
        lead: null,
        priority: 'high',
        repos: ['lemind/web'],
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
    const next = within(reopened).getByRole('textbox', {
      name: 'Project title',
    })
    await userEvent.type(next, 'Borealis')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() => expect(args.onCreate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(next).toHaveValue(''))
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
  },
}
