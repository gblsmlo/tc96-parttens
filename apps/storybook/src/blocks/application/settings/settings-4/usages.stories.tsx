import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings4 } from '@tc96/blocks/application/settings/settings-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings4Handlers } from '../../../../mocks/settings-4.ts'
import type { Settings4Data } from '../fixtures/settings-4.ts'
import { settings4ControlArgs } from './settings-4-controls.ts'
import { ComposedSettings4 } from './settings-4-layouts.tsx'

const AppearanceSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings4Data>('/settings/appearance'),
    queryKey: ['settings', 'appearance'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings4
        {...settings4ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings4
      colorTheme={data.colorTheme}
      mode={data.mode}
      modeOptions={data.modeOptions}
      onColorThemeChange={fn()}
      onModeChange={fn()}
      themeGroups={data.themeGroups}
    />
  )
}

const meta = {
  component: AppearanceSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings4/Usages',
} satisfies Meta<typeof AppearanceSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Aparência')).toBeVisible()
    await expect(
      await canvas.findByRole('combobox', { name: 'Tema' }),
    ).toHaveTextContent('Default')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar a aparência'),
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
    msw.use(settings4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando aparência',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
