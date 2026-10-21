import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { CompaniesTemplate } from './companies-template'

const meta = {
  component: CompaniesTemplate,
  parameters: {
    docs: {
      description: {
        component:
          'A company gallery page: a `GalleryView` of accounts derived from the contacts and deals fixtures of `Patterns/CollectionViews`, each card with its open pipeline, open deal count and an `AvatarStack` of contacts.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Companies',
} satisfies Meta<typeof CompaniesTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = within(
      canvas.getByRole('article', { name: 'Padaria Estrela' }),
    )
    await expect(card.getByText('Pipeline aberto')).toBeVisible()
    await expect(
      card.getByRole('list', { name: 'Contatos de Padaria Estrela' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { companies: [] },
}
