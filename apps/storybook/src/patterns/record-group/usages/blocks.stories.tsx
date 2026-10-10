import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { usageParameters } from '../../../test-utils/usage-kit'
import {
  AccessBlock,
  BillingBlock,
  BriefingBlock,
  DetailsBlock,
  DocumentBlock,
  LinkedRecordsBlock,
  StageBlock,
  TasksBlock,
  VersionsBlock,
} from '../fixtures/blocks'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    ...usageParameters,
    docs: {
      description: {
        component:
          'Groups a record page composes to edit and add content, one story per job. Each is a single `RecordGroup`, open here; a page picks the groups its use case needs and passes `defaultOpen={false}` when its footer opens closed.',
      },
    },
  },
  title: 'Patterns/RecordGroup/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole('region', { name }))

const listboxClosed = () =>
  waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

export const Tasks: Story = {
  parameters: describe(
    'Tracks work to do: a `Checklist` in `plain` inside a `RecordGroup` in `inset`, so the rows sit in the group card at the same 36px as list rows. Check, rename, reorder, delete and add items.',
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('region', { name: 'Tarefas' })
    const tasks = within(group)

    await expect(group).toHaveAttribute('data-variant', 'inset')
    await expect(
      tasks.getByRole('region', { name: 'Lista de tarefas' }),
    ).toHaveAttribute('data-variant', 'plain')
    for (const item of group.querySelectorAll('[data-slot="checklist-item"]')) {
      await expect(item.getBoundingClientRect().height).toBe(36)
    }

    await userEvent.click(
      tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
    )
    await waitFor(() =>
      expect(
        tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
      ).toBeChecked(),
    )

    const draft = tasks.getByRole('textbox', {
      name: 'Novo item',
    }) as HTMLInputElement
    await userEvent.type(draft, 'Protocolar petição')
    draft.form?.requestSubmit()
    await expect(
      await tasks.findByRole('checkbox', { name: 'Protocolar petição' }),
    ).not.toBeChecked()
  },
  render: () => <TasksBlock />,
}

export const Access: Story = {
  parameters: describe(
    'Sets who sees the record: field rows with a label and a `properties` value in `plain`, edited in place.',
  ),
  play: async ({ canvasElement }) => {
    const access = regionOf(canvasElement, 'Acesso')

    await expect(access.getByText('Privado')).toBeVisible()
    await userEvent.click(access.getByRole('combobox', { name: /^Privado/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Sim' }))
    await waitFor(() => expect(access.getByText('Sim')).toBeVisible())
    await listboxClosed()
  },
  render: () => <AccessBlock />,
}

export const Briefing: Story = {
  parameters: describe(
    'Edits a form behind one row: the row (icon, title, status badge) opens a `RecordPreview` with the fields, the save state in its description and the commands that save a draft or publish a version in its footer.',
  ),
  play: async ({ canvasElement }) => {
    const trigger = regionOf(canvasElement, 'Briefing').getByRole('button', {
      name: 'Briefing Rascunho',
    })
    await expect(getComputedStyle(trigger).textAlign).toBe('start')

    await userEvent.click(trigger)
    const briefing = within(
      await screen.findByRole('dialog', { name: 'Briefing' }),
    )
    const status = briefing.getByTestId('brief-status')
    const saveDraft = briefing.getByRole('button', { name: 'Salvar rascunho' })
    const publish = briefing.getByRole('button', { name: 'Publicar versão' })
    await expect(status).toHaveTextContent('Rascunho salvo em 08/10/2026')
    await expect(saveDraft).toBeDisabled()

    await userEvent.click(
      briefing.getByRole('combobox', { name: /^Objetivo secundário/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Fortalecer indicação' }),
    )
    await waitFor(() => expect(saveDraft).toBeEnabled())
    await expect(status).toHaveTextContent('Alterações não salvas')
    await listboxClosed()

    await userEvent.click(saveDraft)
    await waitFor(() =>
      expect(status).toHaveTextContent('Rascunho salvo em 09/10/2026'),
    )
    await userEvent.click(publish)
    await waitFor(() =>
      expect(status).toHaveTextContent('Versão 2 publicada em 09/10/2026'),
    )
    await expect(publish).toBeDisabled()

    await userEvent.click(briefing.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(trigger).toHaveAccessibleName('Briefing Publicada')
  },
  render: () => <BriefingBlock />,
}

export const Versions: Story = {
  parameters: describe(
    'Lists the history of a record: each version is a trigger row (icon, title, status badge) that opens its fields, read-only, in a `RecordPreview`.',
  ),
  play: async ({ canvasElement }) => {
    const versions = regionOf(canvasElement, 'Versões')
    const first = versions.getByRole('button', { name: 'Versão 1 Publicada' })

    await expect(
      versions.getByRole('button', { name: 'Versão 2 Rascunho' }),
    ).toBeVisible()
    await expect(first).not.toHaveAttribute('aria-expanded')

    await userEvent.click(first)
    const preview = within(
      await screen.findByRole('dialog', { name: 'Versão 1' }),
    )
    await waitFor(() =>
      expect(preview.getByText('Publicada em 26/09/2026')).toBeVisible(),
    )
    await expect(preview.getByText('Consulta agendada')).toBeVisible()

    await userEvent.click(preview.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(first).toHaveFocus())
  },
  render: () => <VersionsBlock />,
}

export const LinkedRecords: Story = {
  parameters: describe(
    'Follows records tied to this one: each row is a link (entity icon, name, status and date) that opens the linked record.',
  ),
  play: async ({ canvasElement }) => {
    const links = regionOf(canvasElement, 'Parcelas').getAllByRole('link')

    await expect(links.map((link) => link.textContent)).toEqual([
      'Parcela 1Paga · 10/09/2026',
      'Parcela 2Prevista · 10/10/2026',
      'Parcela 3Prevista · 10/11/2026',
    ])
    await expect(links[1]).toHaveAttribute('href', '#/lancamentos/parcela-2')
  },
  render: () => <LinkedRecordsBlock />,
}

export const Document: Story = {
  parameters: describe(
    'Shows the file attached to the record: a link row with the type icon, the file name, and the type and date.',
  ),
  play: async ({ canvasElement }) => {
    await expect(
      regionOf(canvasElement, 'Documento').getByRole('link', {
        name: 'contrato-assinado.pdf PDF · 12/08/2026',
      }),
    ).toHaveAttribute('href', '#/documentos/contrato-assinado.pdf')
  },
  render: () => <DocumentBlock />,
}

export const DocumentEmpty: StoryObj<typeof DocumentBlock> = {
  args: { onAttachDocument: fn(), signed: false },
  parameters: describe(
    'Asks for the missing file: the group starts closed while empty, and opening it shows the absence and the command that attaches one.',
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Documento',
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    const documentBlock = regionOf(canvasElement, 'Documento')
    await expect(
      await documentBlock.findByText('Sem documento assinado'),
    ).toBeVisible()
    await userEvent.click(
      await documentBlock.findByRole('button', { name: 'Anexar documento' }),
    )
    await expect(args.onAttachDocument).toHaveBeenCalledTimes(1)
  },
  render: (args) => <DocumentBlock {...args} />,
}

export const Billing: Story = {
  parameters: describe(
    'Fills a form and runs its command: field rows, with the command that issues the charge in the group footer, inside the same group.',
  ),
  play: async ({ canvasElement }) => {
    const charge = regionOf(canvasElement, 'Cobrança')
    const issue = charge.getByRole('button', { name: 'Emitir cobrança' })
    await expect(charge.getByText('Não emitida')).toBeVisible()
    await expect(issue).toBeDisabled()

    await userEvent.click(charge.getByRole('combobox', { name: /^Meio/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Pix' }))
    await waitFor(() => expect(issue).toBeEnabled())
    await listboxClosed()

    await userEvent.click(issue)
    await expect(charge.getByText('Emitida em 09/10/2026')).toBeVisible()
    await expect(
      charge.getByRole('button', { name: 'Emitir segunda via' }),
    ).toBeEnabled()
  },
  render: () => <BillingBlock />,
}

export const Details: Story = {
  parameters: describe(
    'Keeps secondary data: field rows edited in place, with “Sem …” for an empty value.',
  ),
  play: async ({ canvasElement }) => {
    const details = regionOf(canvasElement, 'Mais informações')
    await expect(details.getByRole('textbox', { name: 'CPF' })).toHaveValue(
      '123.456.789-09',
    )

    const occupation = details.getByRole('textbox', { name: 'Profissão' })
    await expect(occupation).toHaveAttribute('placeholder', 'Sem profissão')
    await userEvent.type(occupation, 'Engenheira')
    await userEvent.tab()
    await expect(occupation).toHaveValue('Engenheira')
  },
  render: () => <DetailsBlock />,
}

export const Stage: Story = {
  parameters: describe(
    'Holds the work of the current stage: field rows and a link to a record the stage produced, such as the scheduled appointment.',
  ),
  play: async ({ canvasElement }) => {
    const stage = regionOf(canvasElement, 'Novo Lead')
    await expect(stage.getByText('Sem urgência')).toBeVisible()
    await expect(
      stage.getByRole('link', {
        name: 'Consulta inicial Agendada · 14/10 às 10:00',
      }),
    ).toHaveAttribute('href', '#/agenda/consulta-inicial')

    await userEvent.click(stage.getByRole('combobox', { name: /^Urgência/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Alta' }))
    await waitFor(() => expect(stage.getByText('Alta')).toBeVisible())
    await listboxClosed()
  },
  render: () => <StageBlock />,
}
