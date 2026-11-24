import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings3 } from '@tc96/blocks/application/settings/settings-3'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings3Handlers } from '../../../../mocks/settings-3.ts'
import { type Settings3Data, settings3Data } from '../fixtures/settings-3.ts'
import { settings3ControlArgs } from './settings-3-controls.ts'
import { ComposedSettings3 } from './settings-3-layouts.tsx'

const InterfaceSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings3Data>('/settings/interface'),
    queryKey: ['settings', 'interface'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings3
        {...settings3ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings3
      onValueChange={fn()}
      options={data.options}
      values={data.values}
    />
  )
}

const meta = {
  component: InterfaceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings3/Usages',
} satisfies Meta<typeof InterfaceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Interface e tema')).toBeVisible()
    await expect(
      await canvas.findByRole('combobox', { name: 'Tamanho da fonte' }),
    ).toHaveTextContent(settings3Data.options.fontSize[1].label)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings3Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as configurações'),
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
    msw.use(settings3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando configurações',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
