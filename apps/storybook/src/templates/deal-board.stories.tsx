import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PipelineUsage } from '../patterns/collection-views/fixtures/pipeline-usage'

const meta = {
  component: PipelineUsage,
  parameters: {
    docs: {
      description: {
        component:
          'A deal board page: the `Patterns/CollectionViews/Usages/Pipeline` screen with its header, toolbar and `KanbanView` grouped by stage.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Deal Board',
} satisfies Meta<typeof PipelineUsage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Pipeline de vendas' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: /^Lead/ }),
    ).toBeInTheDocument()
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialDeals: [] },
}
