import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { LeadDialog } from '../lead-dialog'
import type { NewLead } from '../lead-record'

interface LeadsArgs {
  onCreate: (lead: NewLead) => void
}

const meta = {
  args: { onCreate: fn((_lead: NewLead) => {}) },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as the create step of a lead, built like Row Properties: a borderless title and description, then labeled rows (`RecordGroupRow`) for Etapa, Origem, Responsável and Próxima ação. Etapa starts at Novo, Origem, Responsável and Próxima ação start empty, and Próxima ação lists the next step (Ligar, Enviar e-mail, Agendar reunião, Enviar proposta, Fazer follow-up). Criar lead stays disabled until the title has text.',
      },
    },
  },
  render: function Leads({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo lead
        </Button>
        <LeadDialog onCreate={onCreate} onOpenChange={setOpen} open={open} />
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Usages/Leads',
} satisfies Meta<LeadsArgs>

export default meta

type Story = StoryObj<LeadsArgs>

const findDialog = () => screen.findByRole('dialog', { name: 'Novo lead' })

export const Default: Story = {}

export const CreateLead: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Criar lead enables with the title, the description comes from the form, Etapa moves to Qualificado, Origem to Indicação, Responsável to Bruno Lima and Próxima ação to Ligar, and the payload closes the dialog.',
      },
    },
  },
  play: async ({ args }) => {
    const dialog = within(await findDialog())
    const create = dialog.getByRole('button', { name: /Criar lead/ })
    const title = dialog.getByRole('textbox', { name: 'Título' })

    await expect(create).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.type(title, 'Clínica Vida Plena')
    await waitFor(() => expect(create).toBeEnabled())
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Descrição' }),
      'Indicada pela Renata Costa.',
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

    await userEvent.click(dialog.getByRole('combobox', { name: /^Origem/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Indicação' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Origem/ }),
      ).toHaveTextContent('Indicação'),
    )

    await userEvent.click(
      dialog.getByRole('combobox', { name: /^Responsável/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Bruno Lima' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Responsável/ }),
      ).toHaveTextContent('Bruno Lima'),
    )

    await userEvent.click(
      dialog.getByRole('combobox', { name: /^Próxima ação/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Ligar' }))
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Próxima ação/ }),
      ).toHaveTextContent('Ligar'),
    )
    await expect(args.onCreate).not.toHaveBeenCalled()

    await userEvent.click(create)
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: 'Indicada pela Renata Costa.',
        nextAction: 'call',
        ownerId: 'bruno',
        source: 'referral',
        stage: 'qualified',
        title: 'Clínica Vida Plena',
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
          'With Criar mais on, Mod+Enter submits and keeps the dialog open: the title, description and rows return to Novo, no origin, no owner and no next action, ready for the next lead.',
      },
    },
  },
  play: async ({ args }) => {
    const dialog = within(await findDialog())
    const title = dialog.getByRole('textbox', { name: 'Título' })

    await userEvent.click(dialog.getByRole('switch', { name: 'Criar mais' }))
    await userEvent.type(title, 'Padaria Estrela')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')

    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: '',
        nextAction: null,
        ownerId: null,
        source: null,
        stage: 'new',
        title: 'Padaria Estrela',
      }),
    )
    await waitFor(() => expect(title).toHaveValue(''))
    await expect(
      dialog.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Novo')
    await expect(await findDialog()).toBeVisible()
  },
}
