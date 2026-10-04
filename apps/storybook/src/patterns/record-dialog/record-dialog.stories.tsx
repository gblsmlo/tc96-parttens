import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog, type RecordDialogSize } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { CreateRecordDemo } from './create-record-demo'
import { CreateRecordWithFormDemo } from './create-record-with-form-demo'

function ShellOnly() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open dialog
      </Button>
      <RecordDialog
        cancelLabel="Cancel"
        onOpenChange={setOpen}
        onSubmit={() => true}
        open={open}
        submitLabel="Create"
        title="New record"
        titleAncestor="Lemind"
      />
    </>
  )
}

const sizes = [
  { label: 'Small', size: 'small' },
  { label: 'Default', size: 'default' },
  { label: 'Large', size: 'large' },
] as const satisfies readonly { label: string; size: RecordDialogSize }[]

function SizesDemo() {
  const [open, setOpen] = useState<RecordDialogSize | null>(null)

  return (
    <>
      <div className="flex gap-2">
        {sizes.map(({ label, size }) => (
          <Button key={size} onClick={() => setOpen(size)} variant="outline">
            {label}
          </Button>
        ))}
      </div>
      {sizes.map(({ label, size }) => (
        <RecordDialog
          cancelLabel="Cancel"
          key={size}
          onOpenChange={(next) => setOpen(next ? size : null)}
          onSubmit={() => true}
          open={open === size}
          size={size}
          submitLabel="Create"
          title={`${label} dialog`}
          titleAncestor="Lemind"
        >
          <p className="text-muted-foreground text-sm">
            A short body to compare the {label.toLowerCase()} width.
          </p>
        </RecordDialog>
      ))}
    </>
  )
}

const meta = {
  args: { onCreate: fn(), onOpenSingle: fn() },
  component: CreateRecordDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog on one shell with three sizes. CreateRecord is the inline body for quick capture; CreateRecordWithForm is the same payload as labeled fields for explicit entry.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordDialog',
} satisfies Meta<typeof CreateRecordDemo>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Default: Story = {
  render: () => <ShellOnly />,
}

export const DefaultInteraction: Story = {
  ...Default,
  play: async () => {
    const dialog = await screen().findByRole('dialog', { name: 'New record' })

    expect(
      document.querySelector('[data-slot="dialog-title-trail"]')?.textContent,
    ).toBe('LemindNew record')
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeVisible()
    expect(document.querySelector('[data-slot="dialog-panel"]')).toBeNull()

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Create' }),
    )
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}

export const Sizes: Story = {
  render: () => <SizesDemo />,
}

const expectedMaxWidth = { default: 672, large: 896, small: 448 }

export const SizesInteraction: Story = {
  ...Sizes,
  play: async () => {
    const wide = window.matchMedia('(min-width: 640px)').matches

    for (const { label, size } of sizes) {
      await userEvent.click(screen().getByRole('button', { name: label }))
      const dialog = await screen().findByRole('dialog', {
        name: `${label} dialog`,
      })

      expect(dialog.getAttribute('data-size')).toBe(size)
      const maxWidth = getComputedStyle(dialog).maxWidth
      if (wide) {
        expect(maxWidth).toBe(`${expectedMaxWidth[size]}px`)
        expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(
          expectedMaxWidth[size] + 1,
        )
      } else {
        expect(maxWidth).toBe('none')
      }

      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Cancel' }),
      )
      await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    }
  },
  tags: ['!dev', '!autodocs'],
}

export const CreateRecord: Story = {
  render: (args) => <CreateRecordDemo {...args} />,
}

export const CreateRecordInteraction: Story = {
  ...CreateRecord,
  tags: ['!dev', '!autodocs'],
  play: async ({ args }) => {
    const dialog = await screen().findByRole('dialog', { name: 'New project' })
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
      await screen().findByRole('option', { name: 'In progress' }),
    )
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Status/ }),
      ).toHaveTextContent('In progress'),
    )

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Priority/ }),
    )
    await userEvent.click(await screen().findByRole('option', { name: 'High' }))
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Priority/ }),
      ).toHaveTextContent('High'),
    )

    await userEvent.click(within(dialog).getByRole('button', { name: 'Repos' }))
    await userEvent.click(
      await screen().findByRole('menuitemcheckbox', { name: 'lemind/web' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'web' })).toBeVisible(),
    )
    expect(screen().getByRole('dialog', { name: 'New project' })).toBeVisible()
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
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())

    await userEvent.click(screen().getByRole('button', { name: 'Open dialog' }))
    const reopened = await screen().findByRole('dialog', {
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
    expect(screen().getByRole('dialog', { name: 'New project' })).toBeVisible()
  },
}

export const CreateRecordWithForm: Story = {
  render: (args) => <CreateRecordWithFormDemo {...args} />,
}

export const CreateRecordWithFormInteraction: Story = {
  ...CreateRecordWithForm,
  play: async ({ args }) => {
    const dialog = await screen().findByRole('dialog', { name: 'New project' })
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
      await screen().findByRole('option', { name: 'In progress' }),
    )
    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Priority' }),
    )
    await userEvent.click(await screen().findByRole('option', { name: 'High' }))
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
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())

    await userEvent.click(screen().getByRole('button', { name: 'Open dialog' }))
    const reopened = await screen().findByRole('dialog', {
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
    expect(screen().getByRole('dialog', { name: 'New project' })).toBeVisible()
    expect(
      within(reopened).getByRole('combobox', { name: 'Status' }),
    ).toHaveTextContent('Planned')
  },
  tags: ['!dev', '!autodocs'],
}
