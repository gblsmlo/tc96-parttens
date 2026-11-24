import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BulkImport1,
  type BulkImport1Step,
  type RecordsStatusRow,
} from '@tc96/blocks/records/bulk-import-1'
import {
  PersonProperty,
  RecordGroup,
  RecordGroupRow,
  type RecordStatus,
  SelectProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Switch } from '@tc96/ui/switch'
import { useEffect, useState } from 'react'
import { expect, fn, screen, within } from 'storybook/test'
import {
  lawsuitOwners,
  lawsuitPhaseOptions,
} from '../../../patterns/records/dialog/lawsuit-record'

const meta = {
  tags: ['!autodocs'],
  title: 'Blocks/Records/BulkImport1/Usages',
} satisfies Meta

export default meta

const lawsuits = [
  {
    className: 'Procedimento Comum Cível',
    date: '18/11/2026',
    id: '9990011-96.2025.8.26.9999',
  },
  {
    className: 'Juizado Especial Cível',
    date: '14/11/2026',
    id: '9990012-81.2025.8.26.9999',
  },
  {
    className: 'Procedimento Comum Cível',
    date: '18/11/2026',
    id: '9990001-52.2025.8.26.9999',
    registered: true,
  },
  {
    className: 'Cumprimento de Sentença',
    date: '03/11/2026',
    id: '9990013-66.2025.8.26.9999',
  },
]

interface OabLawsuitsArgs {
  onImport: (ids: readonly string[]) => void
  onOpen: (id: string) => void
}

export const OabLawsuits: StoryObj<OabLawsuitsArgs> = {
  args: { onImport: fn(), onOpen: fn() },
  parameters: {
    docs: {
      description: {
        story:
          "The lawsuits a lawyer's OAB number finds in DJEN, on the [Default](?path=/story/blocks-records-bulkimport1-layouts--default) layout: the search shows skeleton rows first, a lawsuit already in the office cannot be marked, and the link step sets Responsável, Fase and the court monitoring once for every lawsuit before the import runs row by row.",
      },
    },
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Importar pela OAB' }),
    )
    await expect(
      await dialog.findByRole('checkbox', {
        name: 'Selecionar 9990011-96.2025.8.26.9999',
      }),
    ).toBeVisible()
  },
  render: function OabLawsuits({ onImport, onOpen }) {
    const [open, setOpen] = useState(true)
    const [step, setStep] = useState<BulkImport1Step>('select')
    const [searching, setSearching] = useState(true)
    const [selected, setSelected] = useState<readonly string[]>([])
    const [ownerId, setOwnerId] = useState<string | null>('admin')
    const [phase, setPhase] = useState<string | null>('initial')
    const [monitor, setMonitor] = useState(true)
    const [settled, setSettled] = useState(-1)

    useEffect(() => {
      if (!searching) return
      const timer = setTimeout(() => {
        setSearching(false)
        setSelected(
          lawsuits.filter((row) => !row.registered).map((row) => row.id),
        )
      }, 900)
      return () => clearTimeout(timer)
    }, [searching])

    useEffect(() => {
      if (settled < 0 || settled >= selected.length) return
      const timer = setTimeout(() => setSettled((count) => count + 1), 700)
      return () => clearTimeout(timer)
    }, [selected.length, settled])

    const importing = settled >= 0 && settled < selected.length
    const statusOf = (index: number, id: string): RecordStatus => {
      if (index > settled) return 'pending'
      if (index === settled) return 'running'
      return id.startsWith('9990013') ? 'failed' : 'done'
    }
    const progress: RecordsStatusRow[] =
      settled < 0
        ? []
        : selected.map((id, index) => {
            const status = statusOf(index, id)
            return {
              action:
                status === 'done' ? (
                  <Button
                    onClick={() => onOpen(id)}
                    size="sm"
                    variant="outline"
                  >
                    Abrir
                  </Button>
                ) : undefined,
              announcement:
                status === 'failed'
                  ? `${id}: DJEN não respondeu`
                  : `${id} importado`,
              detail: {
                done: 'importado',
                failed: 'DJEN não respondeu',
                pending: 'na fila',
                running: 'importando',
                skipped: 'já no escritório',
              }[status],
              id,
              status,
              title: <span className="tabular-nums">{id}</span>,
            }
          })

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Importar pela OAB
        </Button>
        <BulkImport1
          columns={['Número', 'Classe', 'Última publicação']}
          importing={importing}
          labels={{
            ancestor: 'Processos',
            import: (count) =>
              count === 1
                ? 'Importar 1 processo'
                : `Importar ${count} processos`,
            importingHint:
              'Pode fechar. A lista de processos mostra o andamento.',
            noneSelected: 'Marque ao menos um processo.',
            progress: 'Andamento da importação',
            title: 'Importar pela OAB',
          }}
          onImport={() => {
            onImport(selected)
            setSettled(0)
            return true
          }}
          onOpenChange={setOpen}
          onSearchAgain={() => setSearching(true)}
          onSelectedChange={setSelected}
          onStepChange={setStep}
          open={open}
          progress={progress}
          query="OAB 900001/SP · Admin Acme"
          rows={lawsuits.map((row) => ({
            cells: [
              <span className="tabular-nums" key="id">
                {row.id}
              </span>,
              row.className,
              row.date,
            ],
            disabledReason: row.registered ? 'Já no escritório' : undefined,
            id: row.id,
            label: row.id,
          }))}
          searchedAt="Resultado de 23/11 09:40 · só processos com publicação no DJEN"
          searching={searching}
          selected={selected}
          step={step}
        >
          <RecordGroup collapsible={false} title="Vale para todos os processos">
            <RecordGroupRow label="Responsável">
              <PersonProperty
                ariaLabel="Responsável"
                onValueChange={setOwnerId}
                options={lawsuitOwners}
                value={ownerId}
              />
            </RecordGroupRow>
            <RecordGroupRow label="Fase">
              <SelectProperty
                ariaLabel="Fase"
                onValueChange={setPhase}
                options={lawsuitPhaseOptions}
                value={phase}
              />
            </RecordGroupRow>
            <RecordGroupRow label="Monitoramento">
              <Switch
                aria-label="Monitoramento no tribunal"
                checked={monitor}
                onCheckedChange={setMonitor}
              />
            </RecordGroupRow>
          </RecordGroup>
        </BulkImport1>
      </>
    )
  },
}
