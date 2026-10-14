import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { TaskPreview } from '../fixtures/task-preview'

const meta = {
  args: { onOpenPage: fn() },
  component: TaskPreview,
  parameters: {
    docs: {
      description: {
        component:
          'RecordPreview as the quick view of a task: three `RecordGroup` sections (Propriedades, Agenda and Registro) of `RecordGroupRow` fields, each with a `properties` value. Propriedades and Agenda are edited in place; Registro is read-only, with a copy action on the ID. The header carries the title and the Ampliar action.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Usages/Tasks',
} satisfies Meta<typeof TaskPreview>

export default meta

type Story = StoryObj<typeof meta>

const findDialog = () =>
  screen.findByRole('dialog', { name: 'Protocolar recurso no TRT' })

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opens on the task. Status moves to Concluída, the Urgente tag is removed, and Ampliar reports the click; the Registro values stay read-only.',
      },
    },
  },
  play: async ({ args }) => {
    const popup = await findDialog()
    const dialog = within(popup)

    for (const row of popup.querySelectorAll(
      '[data-slot="record-group-row"]',
    )) {
      await expect(row.getBoundingClientRect().height).toBe(32)
      await expect(getComputedStyle(row).paddingLeft).toBe('0px')
    }
    await expect(
      popup.querySelector('[data-slot="record-preview-body"]'),
    ).toBeVisible()
    await expect(
      popup.querySelector('[data-slot="record-group-row-label"] svg'),
    ).toBeNull()
    const iconRows = [...popup.querySelectorAll('[data-slot="property-icon"]')]
      .filter((icon) => getComputedStyle(icon).display !== 'none')
      .map(
        (icon) =>
          icon
            .closest('[data-slot="record-group-row"]')
            ?.querySelector('[data-slot="record-group-row-label"]')
            ?.textContent,
      )
    await expect(iconRows).toEqual(['Status', 'Prioridade'])

    for (const name of ['Propriedades', 'Agenda', 'Registro']) {
      await expect(dialog.getByRole('region', { name })).toBeVisible()
    }

    await userEvent.click(dialog.getByRole('combobox', { name: /^Status/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Concluída' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Status/ }),
      ).toHaveTextContent('Concluída'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

    await userEvent.click(
      dialog.getByRole('button', { name: 'Remover tag Urgente' }),
    )
    await waitFor(() =>
      expect(
        dialog.queryByRole('button', { name: 'Remover tag Urgente' }),
      ).toBeNull(),
    )

    await expect(
      dialog.getByRole('button', { name: 'Data: 14 de out · 01:30 – 01:45' }),
    ).toBeVisible()
    await expect(dialog.getByText('seed_tasks_task_01')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Copiar ID' }),
    ).toBeVisible()
    await expect(dialog.getByText('27/09/2026, 06:00')).toBeVisible()
    await expect(dialog.getByText('13/10/2026, 23:34')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /^Prazo: 19 de set/ }),
    ).toHaveTextContent('19 de set')

    await userEvent.click(dialog.getByRole('button', { name: 'Ampliar' }))
    await expect(args.onOpenPage).toHaveBeenCalledTimes(1)
  },
}
