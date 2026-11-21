import type { Meta, StoryObj } from '@storybook/react-vite'
import { composerControlArgs } from './composer-controls.ts'
import { ComposerCanvas } from './composer-frame.tsx'
import { ComposedComposer, CustomControlComposer } from './composer-layouts.tsx'

const meta = {
  decorators: [ComposerCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Composer/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithLeadingAction: Story = {
  render: () => <ComposedComposer {...composerControlArgs} leading />,
}

export const WithSuggestions: Story = {
  render: () => (
    <ComposedComposer
      {...composerControlArgs}
      placeholder="Type @ to mention, / for actions"
      suggestions
    />
  ),
}

export const WithCustomControl: Story = {
  render: () => <CustomControlComposer />,
}

export const AsTextarea: Story = {
  render: () => <ComposedComposer {...composerControlArgs} input="textarea" />,
}
