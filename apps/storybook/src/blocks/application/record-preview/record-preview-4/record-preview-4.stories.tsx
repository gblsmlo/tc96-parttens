import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordPreview4Catalog,
  RecordPreview4 as RecordPreview4Block,
} from '@tc96/ui/blocks/application/record-preview/record-preview-4'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, screen, waitFor, within } from 'storybook/test'
import {
  LAWSUIT_TIME_ZONE,
  lawsuitCatalogLabels,
  lawsuitContracts,
  lawsuitCourts,
  lawsuitPeople,
  lawsuitPreviewLabels,
  lawsuitRecord,
  lawsuitTags,
} from '../fixtures/record-preview-4.ts'

const lawsuitCatalog = createRecordPreview4Catalog(lawsuitCatalogLabels)

function LawsuitPreview() {
  const [open, setOpen] = useState(true)
  const [lawsuit, setLawsuit] = useState(lawsuitRecord)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Abrir processo
      </Button>
      <RecordPreview4Block
        catalog={lawsuitCatalog}
        contracts={lawsuitContracts}
        courts={lawsuitCourts}
        labels={lawsuitPreviewLabels}
        locale="pt-BR"
        onExpand={() => undefined}
        onOpenChange={setOpen}
        onRecordChange={(changes) =>
          setLawsuit((current) => ({ ...current, ...changes }))
        }
        open={open}
        people={lawsuitPeople}
        record={lawsuit}
        tags={lawsuitTags}
        timeZone={LAWSUIT_TIME_ZONE}
      />
    </>
  )
}

const meta = {
  component: LawsuitPreview,
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Preview/RecordPreview4',
} satisfies Meta<typeof LawsuitPreview>

export default meta

type Story = StoryObj<typeof meta>

export const RecordPreview4: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The quick view of a lawsuit, after the legal record preview of lemind, with `record.description` under the title, with every property in its `plain` variant: Propriedades (Autor and Réu read-only, the CNJ number with a copy action, Fase, Contrato, Responsável, Tags), Informações do processo (Justiça, Juizado, Tribunal, Vara, Foro, Ação, Objeto, Instância and the read-only Valor) and Registros, collapsed, with plain read-only properties. Fase, Justiça, Juizado and Instância come from the catalog the block exports (`createRecordPreview4Catalog`); contracts, courts, tags and people are the app data.',
      },
    },
  },
  play: async () => {
    const popup = await screen.findByRole('dialog', {
      name: 'Ação de cobrança',
    })
    const dialog = within(popup)

    await expect(popup).toHaveAccessibleDescription(
      'Cobrança das parcelas em atraso do contrato de empreitada.',
    )

    await waitFor(() =>
      expect(
        popup.querySelector('[data-slot="record-preview-body"]'),
      ).toBeVisible(),
    )
    for (const name of ['Propriedades', 'Informações do processo']) {
      await expect(dialog.getByRole('region', { name })).toBeVisible()
    }
    await expect(dialog.getByText('0001000-21.2026.8.26.0100')).toBeVisible()
    await expect(dialog.getByText('Ada Lovelace +1')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Registros' }),
    ).toHaveAttribute('aria-expanded', 'false')
  },
}
