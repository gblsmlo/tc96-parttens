import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { initialContacts } from '../../../collection/fixtures/contacts'
import { CreateContactDialog, type NewContact } from '../create-contact-dialog'

const companies = initialContacts.map((contact) => contact.company)
const roles = initialContacts.map((contact) => contact.role)

interface ContactsArgs {
  onCreate: (contact: NewContact) => void
}

const meta = {
  args: { onCreate: fn((_contact: NewContact) => {}) },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as the create step of the Contacts collection, built like Inline Properties: the name as a borderless title, a short description below it, and every other field as a property chip. Telefone, E-mail, Tipo (CPF or CNPJ) and Documento are always shown. The ... chip opens a menu whose switches show or hide Etapa, Tags, Empresa and Cargo; Etapa starts at Sem etapa and has no Lead. Empresa and Cargo share one combobox chip: search, the existing roles or companies of the collection, and a footer that creates the typed name and selects it. The Contacts usage of `Patterns/Collection` opens the same dialog from Novo contato.',
      },
    },
  },
  render: function Contacts({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo contato
        </Button>
        <CreateContactDialog
          companies={companies}
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          roles={roles}
        />
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Usages/Contacts',
} satisfies Meta<ContactsArgs>

export default meta

type Story = StoryObj<ContactsArgs>

const showProperties = async (
  dialog: ReturnType<typeof within>,
  labels: readonly string[],
) => {
  await userEvent.click(
    dialog.getByRole('button', { name: 'Mais propriedades' }),
  )
  for (const label of labels) {
    const item = await screen.findByRole('menuitemcheckbox', { name: label })
    await userEvent.click(item)
    await waitFor(() => expect(item).toHaveAttribute('aria-checked', 'true'))
  }
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const findDialog = () => screen.findByRole('dialog', { name: 'Novo contato' })

export const Default: Story = {}

export const CreateContact: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Criar contato stays disabled until the name has text, and the description comes from the form. Gerente de compras comes from the existing roles; Agência Norte is not in the list, so the Empresa footer creates and selects it. Tipo is CPF with its Documento, Etapa, Empresa, Cargo and Tags are switched on from the ... menu, and email and tags come from their chips, and the payload closes the dialog.',
      },
    },
  },
  play: async ({ args }) => {
    const dialog = within(await findDialog())
    const create = dialog.getByRole('button', { name: /Criar contato/ })
    const name = dialog.getByRole('textbox', { name: 'Nome' })

    await expect(create).toBeDisabled()
    await waitFor(() => expect(name).toHaveFocus())
    await userEvent.type(name, 'Helena Duarte')
    await expect(create).toBeEnabled()
    const description = dialog.getByRole('textbox', { name: 'Descrição' })
    await userEvent.type(description, 'Conheceu o time no evento de outubro.')
    await expect(description.getBoundingClientRect().height).toBeCloseTo(64, 0)

    await userEvent.click(dialog.getByRole('combobox', { name: /^Tipo/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'CPF' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await userEvent.click(dialog.getByRole('button', { name: 'Documento' }))
    const documentInput = dialog.getByRole('textbox', { name: 'Documento' })
    await waitFor(() => expect(documentInput).toHaveFocus())
    await userEvent.type(documentInput, '123.456.789-09{Enter}')
    await expect(dialog.queryByRole('combobox', { name: 'Cargo' })).toBeNull()
    await showProperties(dialog, ['Etapa', 'Tags', 'Empresa', 'Cargo'])

    await userEvent.click(dialog.getByRole('combobox', { name: 'Cargo' }))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar cargo' }),
      'gerente',
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Gerente de compras' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: 'Cargo: Gerente de compras' }),
      ).toBeVisible(),
    )

    await userEvent.click(dialog.getByRole('combobox', { name: 'Empresa' }))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar empresa' }),
      'Agência Norte',
    )
    await expect(
      await screen.findByText('Nenhuma empresa encontrada.'),
    ).toBeVisible()
    await userEvent.click(
      screen.getByRole('button', { name: 'Criar empresa "Agência Norte"' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: 'Empresa: Agência Norte' }),
      ).toBeVisible(),
    )

    await userEvent.click(dialog.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Qualificado' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Etapa/ }),
      ).toHaveTextContent('Qualificado'),
    )

    await userEvent.click(dialog.getByRole('button', { name: 'E-mails' }))
    await userEvent.type(
      await screen.findByRole('textbox', { name: 'Principal' }),
      'helena@agencianorte.example{Enter}',
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('button', {
          name: 'E-mails: helena@agencianorte.example',
        }),
      ).toBeVisible(),
    )

    await userEvent.click(dialog.getByRole('button', { name: /^Tags:/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'VIP' }))
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        dialog.getByRole('button', { name: 'Tags: 1 Tag' }),
      ).toHaveTextContent('1 Tag'),
    )
    await expect(await findDialog()).toBeVisible()
    await expect(args.onCreate).not.toHaveBeenCalled()

    await userEvent.click(create)
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        company: 'Agência Norte',
        description: 'Conheceu o time no evento de outubro.',
        document: '123.456.789-09',
        documentType: 'cpf',
        emails: ['helena@agencianorte.example'],
        name: 'Helena Duarte',
        phones: [],
        role: 'Gerente de compras',
        stage: 'qualified',
        tags: ['vip'],
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const CreateMore: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Enter in the Cargo search creates a role that is not in the list, and searching an existing company selects it instead of offering a duplicate. With Criar mais on, each submit keeps the dialog open and clears the name, the description and every chip for the next contact, saved here as Sem etapa.',
      },
    },
  },
  play: async ({ args }) => {
    const dialog = within(await findDialog())
    const name = dialog.getByRole('textbox', { name: 'Nome' })

    await userEvent.click(dialog.getByRole('switch', { name: 'Criar mais' }))
    await showProperties(dialog, ['Etapa', 'Empresa', 'Cargo'])
    await userEvent.type(name, 'Helena Duarte')
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Descrição' }),
      'Indicada pelo Ricardo Melo.',
    )
    await userEvent.click(dialog.getByRole('combobox', { name: 'Cargo' }))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar cargo' }),
      'Gerente de marketing{Enter}',
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: 'Cargo: Gerente de marketing' }),
      ).toBeVisible(),
    )

    await userEvent.click(dialog.getByRole('combobox', { name: 'Empresa' }))
    await userEvent.type(
      await screen.findByRole('combobox', { name: 'Buscar empresa' }),
      'banco aurora',
    )
    await expect(
      screen.getByRole('button', { name: 'Criar nova empresa' }),
    ).toBeDisabled()
    await userEvent.click(
      await screen.findByRole('option', { name: 'Banco Aurora' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: 'Empresa: Banco Aurora' }),
      ).toBeVisible(),
    )

    await userEvent.click(dialog.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Cliente' }),
    )
    await userEvent.click(name)
    await userEvent.keyboard('{Control>}{Enter}{/Control}')

    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          company: 'Banco Aurora',
          description: 'Indicada pelo Ricardo Melo.',
          role: 'Gerente de marketing',
          stage: 'customer',
        }),
      ),
    )
    await waitFor(() => expect(name).toHaveValue(''))
    await expect(
      dialog.getByRole('textbox', { name: 'Descrição' }),
    ).toHaveValue('')
    await expect(dialog.getByRole('combobox', { name: 'Cargo' })).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: 'Empresa' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Sem etapa')

    await userEvent.type(name, 'Otávio Ramos')
    await userEvent.click(dialog.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Sem etapa' }),
    )
    await userEvent.click(name)
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenLastCalledWith({
        company: '',
        description: '',
        emails: [],
        name: 'Otávio Ramos',
        phones: [],
        role: '',
        stage: 'none',
        tags: [],
      }),
    )
    await expect(await findDialog()).toBeVisible()
  },
}
