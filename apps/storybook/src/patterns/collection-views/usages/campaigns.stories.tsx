import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { CampaignsUsage, campaignViewModes } from '../fixtures/campaigns-usage'

const meta = {
  argTypes: {
    defaultView: {
      control: 'inline-radio',
      options: campaignViewModes.map((mode) => mode.value),
    },
  },
  component: CampaignsUsage,
  parameters: {
    docs: {
      description: {
        component: [
          'The Meta Ads campaigns of a marketing team as a record screen over one collection: name, objective, status, learning phase, budget, amount spent, results, cost per result, reach, impressions, CTR, placements, schedule, ad set and ad counts and the Meta Pixel.',
          'The `ViewSettingsMenu` switches between **Tabela** (DataTable), **Planilha** (DataGrid) and **Lista**, groups by status or objective, and filters by status and objective. Status is a property that writes back to the collection; the result label follows the objective, and an active campaign under 50 results shows its learning progress. Rows selected in the Table or the Spreadsheet open an `ActionBar` to pause, activate or delete them.',
        ].join('\n\n'),
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Usages/Campaigns',
} satisfies Meta<typeof CampaignsUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialCampaigns: [] },
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
      await expect(
        canvas.getByText('Black Friday · Catálogo completo'),
      ).toBeInTheDocument()
    }
  },
}

export const LearningPreset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Em aprendizado keeps only the active campaigns under 50 results, each showing its progress toward leaving the learning phase.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Todas as campanhas' }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Em aprendizado' }),
    )

    await waitFor(() =>
      expect(canvas.queryByText('Black Friday · Catálogo completo')).toBeNull(),
    )
    await expect(
      rowOf(canvasElement, 'Remarketing · Carrinho abandonado').getByText(
        'Aprendizado 31/50',
      ),
    ).toBeInTheDocument()
    await expect(
      rowOf(canvasElement, 'Lista VIP · Lançamento de verão').getByText(
        'Aprendizado 38/50',
      ),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Contagem 2' }),
    ).toBeInTheDocument()
  },
}

export const PauseSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Two active campaigns selected in the Table open the `ActionBar`; Pausar moves both to Pausada.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const names = ['Blog · Guia de presentes', 'Atendimento via WhatsApp']

    for (const name of names) {
      await userEvent.click(
        canvas.getByRole('checkbox', { name: `Selecionar ${name}` }),
      )
    }

    await userEvent.click(await canvas.findByRole('button', { name: 'Pausar' }))

    for (const name of names) {
      await waitFor(() =>
        expect(
          rowOf(canvasElement, name).getByRole('combobox', {
            name: 'Status: Pausada',
          }),
        ).toBeTruthy(),
      )
    }
    await expect(canvas.queryByRole('button', { name: 'Pausar' })).toBeNull()
  },
}

export const ObjectiveFilter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filtering by Vendas keeps the three sales campaigns, whose results read as Compras.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Objetivo' }),
    )
    await userEvent.click(
      await body.findByRole('menuitemcheckbox', { name: 'Vendas' }),
    )
    await userEvent.keyboard('[Escape]')

    await waitFor(() =>
      expect(canvas.queryByText('Blog · Guia de presentes')).toBeNull(),
    )
    await expect(
      canvas.getByRole('button', { name: 'Contagem 3' }),
    ).toBeInTheDocument()
    await expect(
      rowOf(canvasElement, 'Black Friday · Catálogo completo').getByText(
        'Compras',
      ),
    ).toBeInTheDocument()
  },
}
