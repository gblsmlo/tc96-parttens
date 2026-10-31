import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { PipelineUsage } from '../patterns/collection/fixtures/pipeline-usage'
import { appShellDocs, withAppShell } from './fixtures/app-shell'

const meta = {
  component: PipelineUsage,
  decorators: [
    withAppShell({
      breadcrumbs: [{ label: 'Pipeline de vendas' }],
      href: '/pipeline',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A deal board page: the `Patterns/Collection/Usages/Pipeline` screen with its header, toolbar and `KanbanView` grouped by stage. It renders inside `Application/Shell/AppShell1`, the layout it mounts in; the Code panel shows only the page, which goes in the `children` of the shell.',
      },
      story: appShellDocs,
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
