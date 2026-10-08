import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { ContactsUsage, contactViewModes } from '../fixtures/contacts-usage'

const meta = {
  argTypes: {
    defaultView: {
      control: 'inline-radio',
      options: contactViewModes.map((mode) => mode.value),
    },
  },
  component: ContactsUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'The contacts of a sales team as a record screen over one collection: name, company, role, lifecycle stage, emails, phones, tags and last contact.',
          'The `ViewSettingsMenu` switches between **Tabela** (DataTable), **Planilha** (DataGrid) and **Lista**, groups by stage, and filters by stage and tag. The selected view picker searches, duplicates, creates and deletes saved views, and Salvar preferência writes the layout and filters into the active one. Each value is a property that writes back to the same collection, rows selected in the Table or the Spreadsheet open an `ActionBar` to delete them, and Novo contato opens the `RecordDialog` of `Patterns/RecordDialog/Usages/Contacts`.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Contacts',
} satisfies Meta<typeof ContactsUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialContacts: [] },
}

const rowOf = (canvasElement: HTMLElement, name: string) => {
  const row = within(canvasElement).getByText(name).closest('tr')
  if (!row) throw new Error(`row ${name} did not mount`)
  return within(row)
}

export const SwitchViews: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Walks the three views through the `ViewSettingsMenu` tabs and checks that each one mounts over the same collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const views = [
      ['Planilha', 'data-grid'],
      ['Lista', 'list-view'],
      ['Tabela', 'table-container'],
    ] as const

    for (const [label, slot] of views) {
      await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
      await userEvent.click(
        await body.findByRole('menuitemradio', { name: label }),
      )
      await waitFor(() =>
        expect(
          canvasElement.querySelector(`[data-slot="${slot}"]`),
        ).not.toBeNull(),
      )
      await expect(canvas.getByText('Marcos Tavares')).toBeInTheDocument()
    }
  },
}

export const StageEditFollowsPreset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Marcos Tavares moves from Lead to Cliente in the Table, and the Clientes saved view picks him up from the same collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      rowOf(canvasElement, 'Marcos Tavares').getByRole('combobox', {
        name: 'Etapa: Lead',
      }),
    )
    await userEvent.click(await body.findByRole('option', { name: 'Cliente' }))
    await waitFor(() =>
      expect(
        rowOf(canvasElement, 'Marcos Tavares').getByRole('combobox', {
          name: 'Etapa: Cliente',
        }),
      ).toBeTruthy(),
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todos os contatos' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Clientes' }),
    )
    await waitFor(() => expect(canvas.queryByText('Renata Costa')).toBeNull())
    await expect(canvas.getByText('Marcos Tavares')).toBeInTheDocument()
  },
}

export const DeleteSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two rows selected in the Table open the `ActionBar`; Excluir removes both from the collection and clears the selection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const names = ['Renata Costa', 'Beatriz Lopes']

    for (const name of names) {
      await userEvent.click(
        canvas.getByRole('checkbox', { name: `Selecionar ${name}` }),
      )
    }

    await userEvent.click(
      await canvas.findByRole('button', { name: 'Excluir' }),
    )

    for (const name of names) {
      await waitFor(() => expect(canvas.queryByText(name)).toBeNull())
    }
    await expect(canvas.getByText('12 contatos')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Excluir' })).toBeNull()
  },
}

export const CreateContact: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Novo contato opens the `RecordDialog`; Criar contato adds Helena Duarte to the collection as a Lead, and the Table picks her up in the stage order.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Novo contato' }))
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo contato' }),
    )
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Nome' }),
      'Helena Duarte',
    )
    await userEvent.click(dialog.getByRole('combobox', { name: 'Cargo' }))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar cargo' }),
      'Gerente de marketing{Enter}',
    )
    await userEvent.click(dialog.getByRole('button', { name: /Criar contato/ }))

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      rowOf(canvasElement, 'Helena Duarte').getByRole('combobox', {
        name: 'Etapa: Lead',
      }),
    ).toBeTruthy()
    await expect(
      rowOf(canvasElement, 'Helena Duarte').getByText(/Gerente de marketing/),
    ).toBeInTheDocument()
    await expect(canvas.getByText('15 contatos')).toBeInTheDocument()
  },
}

export const SavePreference: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Salvar preferência stays disabled until the layout or a filter changes. Saving Planilha into Todos os contatos keeps it there: Clientes brings back its own Table, and returning to Todos os contatos reopens the Spreadsheet.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openSettings = () =>
      userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    const saveItem = () =>
      screen.findByRole('menuitem', { name: 'Salvar preferência' })

    await openSettings()
    await expect(await saveItem()).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Planilha' }),
    )

    await openSettings()
    await userEvent.click(await saveItem())
    await openSettings()
    await expect(await saveItem()).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('[Escape]')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todos os contatos' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Clientes' }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="table-container"]'),
      ).not.toBeNull(),
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Clientes' }))
    await userEvent.click(
      await screen.findByRole('button', { name: 'Todos os contatos' }),
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="data-grid"]'),
      ).not.toBeNull(),
    )
  },
}

export const ManageSavedViews: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The selected view picker of the `Patterns/Toolbar` With Selected View story: search, saved views, the options of the active view and Criar nova view. Duplicar copies the active view, Criar nova view saves the current layout and filters, and Excluir falls back to the first view.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openPicker = (label: string) =>
      userEvent.click(canvas.getByRole('button', { name: label }))

    await openPicker('Todos os contatos')
    const popover = within(await screen.findByRole('dialog'))
    await waitFor(() =>
      expect(
        popover.getByRole('searchbox', { name: 'Buscar views' }),
      ).toBeVisible(),
    )
    await userEvent.click(
      popover.getByRole('button', { name: 'Opções de Todos os contatos' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Todos os contatos (cópia)' }),
      ).toBeVisible(),
    )

    await openPicker('Todos os contatos (cópia)')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Criar nova view' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Nova visão 1' }),
      ).toBeVisible(),
    )

    await openPicker('Nova visão 1')
    await userEvent.click(
      await screen.findByRole('button', { name: 'Opções de Nova visão 1' }),
    )
    await expect(
      screen.queryByRole('menuitem', { name: 'Renomear' }),
    ).toBeNull()
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Excluir' }),
    )
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Todos os contatos' }),
      ).toBeVisible(),
    )
  },
}
