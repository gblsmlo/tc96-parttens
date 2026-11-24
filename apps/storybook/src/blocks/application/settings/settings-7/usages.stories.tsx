import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings7,
  type Settings7Tag,
} from '@tc96/blocks/application/settings/settings-7'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settingsHandlers } from '../../../../mocks/settings.ts'

const WorkspaceTags = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings7Tag[]>('/settings/tags'),
    queryKey: ['settings', 'tags'],
  })

  if (isPending) return <Spinner aria-label="Carregando tags" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as tags</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Settings7 onCreate={fn()} onTagAction={fn()} tags={data} />
}

const meta = {
  component: WorkspaceTags,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings7/Usages',
} satisfies Meta<typeof WorkspaceTags>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tags)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Cliente ativo')).toBeVisible()
    await expect(canvas.getByText('Subtag de Cliente ativo')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma tag ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsError)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as tags',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando tags'),
    ).toBeVisible()
  },
}
