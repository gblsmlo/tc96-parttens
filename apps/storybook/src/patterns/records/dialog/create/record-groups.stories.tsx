import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { ProcessCreateDialog } from '../process-create-dialog'
import {
  type ImportSource,
  type NewProcess,
  processNumber,
} from '../process-record'

interface RecordGroupsArgs {
  failOnce: ImportSource[]
  latency: number
  onCreate: (process: NewProcess) => void
}

const meta = {
  args: {
    failOnce: [],
    latency: 1200,
    onCreate: fn((_process: NewProcess) => {}),
  },
  argTypes: {
    failOnce: {
      control: 'check',
      options: ['datajud', 'court', 'djen'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog whose body is `card` RecordGroups filled from an import, shown with a lawsuit (processo) imported from DataJud, the court and DJEN when the dialog opens. The groups keep a fixed order: Identificação (with Fase) and Órgão open, Partes closed, then Escritório. The number sits in the header trail and imported text is normalized. In Partes each party chooses Autor or Réu, and each lawyer is listed once with the side it represents. Each group loads on its own with skeleton rows in place. A failure shows one Alert below the title, worded by the sources that failed and the groups left empty, with Tentar novamente for all of them. An edited imported value shows a button that restores it, and Mover para advogados, in the actions of the closed Partes group, removes the parties DJEN also lists as lawyers. `failOnce` makes a source fail on its first attempt; `latency` sets the simulated response time in milliseconds.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Record Groups',
} satisfies Meta<RecordGroupsArgs>

export default meta

type Story = StoryObj<RecordGroupsArgs>

function DialogLauncher({
  children,
}: Readonly<{
  children: (open: boolean, setOpen: (open: boolean) => void) => ReactNode
}>) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Novo processo
      </Button>
      {children(open, setOpen)}
    </>
  )
}

const findDialog = () =>
  screen.findByRole('dialog', { name: /^Novo processo/ }, { timeout: 3000 })

const expectedParties = [
  expect.objectContaining({ name: 'Maria Helena Duarte Campos' }),
  expect.objectContaining({ name: 'Banco Aurora S.A.' }),
]

export const RecordGroups: Story = {
  render: ({ failOnce, latency, onCreate }) => (
    <DialogLauncher>
      {(open, setOpen) => (
        <ProcessCreateDialog
          number={processNumber}
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          simulation={{ failOnce, latency }}
        />
      )}
    </DialogLauncher>
  ),
}

export const FailedSource: Story = {
  ...RecordGroups,
  args: { failOnce: ['datajud'] },
  parameters: {
    docs: {
      description: {
        story:
          'DataJud fails on the first attempt: one Alert below the title says that DataJud did not respond and Identificação has no imported data, and its rows stay empty to fill by hand while the other groups finish on their own.',
      },
    },
  },
}

export const RecordGroupsInteraction: Story = {
  ...FailedSource,
  args: { failOnce: ['datajud', 'court'], latency: 60 },
  play: async ({ args }) => {
    const dialog = within(await findDialog())
    const create = dialog.getByRole('button', { name: /Criar processo/ })

    await expect(create).toBeDisabled()
    const alert = await dialog.findByRole('alert')
    await expect(alert).toHaveTextContent('DataJud não respondeu')
    await waitFor(() =>
      expect(alert).toHaveTextContent('DataJud e Tribunal não responderam'),
    )
    await expect(alert).toHaveTextContent(
      'Identificação e Órgão ficaram sem dados importados.',
    )
    await expect(
      dialog
        .getByRole('textbox', { name: 'Título' })
        .compareDocumentPosition(alert) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      alert.compareDocumentPosition(
        dialog.getByRole('region', { name: 'Identificação' }),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await waitFor(() => expect(create).toBeEnabled())

    await userEvent.click(
      within(alert).getByRole('button', { name: 'Tentar novamente' }),
    )
    await waitFor(() => expect(dialog.queryByRole('alert')).toBeNull())
    await waitFor(() =>
      expect(dialog.getByRole('textbox', { name: 'Título' })).toHaveValue(
        'Apelação Cível · Maria Helena Duarte Campos',
      ),
    )

    await userEvent.click(
      await dialog.findByRole('combobox', { name: /^Instância/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: '1º grau' }),
    )
    await userEvent.click(
      await dialog.findByRole('button', {
        name: 'Restaurar Instância importado',
      }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Instância/ }),
      ).toHaveTextContent('2º grau'),
    )

    const parties = dialog.getByRole('button', { name: 'Partes' })
    await expect(parties).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(parties)
    const banco = within(
      await dialog.findByRole('group', { name: 'Polo de Banco Aurora S.A.' }),
    )
    await userEvent.click(banco.getByRole('button', { name: 'Autor' }))
    await expect(banco.getByRole('button', { name: 'Autor' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await userEvent.click(banco.getByRole('button', { name: 'Réu' }))
    await userEvent.click(
      dialog.getByRole('button', { name: 'Remover Lívia Santos Araújo' }),
    )
    await userEvent.click(
      dialog.getByRole('button', { name: 'Mover para advogados' }),
    )
    await expect(
      dialog.queryByRole('button', { name: 'Mover para advogados' }),
    ).toBeNull()

    await userEvent.click(create)
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          fields: expect.objectContaining({
            className: 'Apelação Cível',
            court: 'TJCE',
            instance: 'second',
          }),
          number: processNumber,
          parties: expectedParties,
        }),
      ),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev'],
}
