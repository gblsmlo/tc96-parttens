import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings8 } from '@tc96/blocks/application/settings/settings-8'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type Settings8Controls,
  settings8ControlArgs,
} from './settings-8-controls.ts'
import { ComposedSettings8 } from './settings-8-layouts.tsx'

const meta = {
  args: { ...settings8ControlArgs, onEnabledChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings8/Behavior',
} satisfies Meta<
  Settings8Controls & { onEnabledChange: (enabled: boolean) => void }
>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchCallsOnEnabledChange: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Ativar SLAs',
    })
    await userEvent.click(toggle)
    await expect(args.onEnabledChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(toggle).not.toBeChecked()
  },
}

export const EnabledIsChecked: Story = {
  args: { enabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', { name: 'Ativar SLAs' }),
    ).toBeChecked()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings8
      labels={{
        description: 'Aplique prazos às issues',
        enable: 'Ligar SLAs',
        title: 'Prazos',
      }}
      onEnabledChange={args.onEnabledChange}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Prazos')).toBeVisible()
    await expect(canvas.getByText('Aplique prazos às issues')).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Ligar SLAs' }),
    ).toBeVisible()
    await expect(canvas.queryByText('SLAs')).toBeNull()
  },
}
