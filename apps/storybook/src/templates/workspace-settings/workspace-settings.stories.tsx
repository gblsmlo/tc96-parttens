import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WorkspaceSettingsTemplate } from './workspace-settings-template'

const meta = {
  args: {
    onSaveDetails: fn(),
    onSavePreferences: fn(),
  },
  component: WorkspaceSettingsTemplate,
  parameters: {
    docs: {
      description: {
        component:
          'A workspace settings page: two `SettingsSection`s of `SettingsRow`s, each with its own save action that stays disabled until a value in that section changes.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Templates/Workspace Settings',
} satisfies Meta<typeof WorkspaceSettingsTemplate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SaveSection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Renaming the workspace enables only Salvar workspace; saving sends the new details and disables the button again.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const saveWorkspace = canvas.getByRole('button', {
      name: 'Salvar workspace',
    })
    const savePreferences = canvas.getByRole('button', {
      name: 'Salvar preferências',
    })
    await expect(saveWorkspace).toBeDisabled()

    const name = canvas.getByRole('textbox', { name: 'Nome do workspace' })
    await userEvent.clear(name)
    await userEvent.type(name, 'Risine CRM')
    await expect(saveWorkspace).toBeEnabled()
    await expect(savePreferences).toBeDisabled()

    await userEvent.click(saveWorkspace)
    await expect(args.onSaveDetails).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Risine CRM' }),
    )
    await expect(saveWorkspace).toBeDisabled()
  },
}
