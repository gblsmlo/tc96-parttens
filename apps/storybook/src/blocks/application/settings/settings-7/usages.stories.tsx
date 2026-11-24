import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings7,
  type Settings7Tag,
} from '@tc96/blocks/application/settings/settings-7'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settingsHandlers } from '../../../../mocks/settings.ts'
import { settings7ControlArgs } from './settings-7-controls.ts'
import { ComposedSettings7 } from './settings-7-layouts.tsx'

const WorkspaceTags = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings7Tag[]>('/settings/tags'),
    queryKey: ['settings', 'tags'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings7
        {...settings7ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
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
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as tags'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.tagsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando tags')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
