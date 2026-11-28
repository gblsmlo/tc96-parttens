import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type PropertiesControls,
  propertiesControlArgs,
  propertiesControlArgTypes,
} from './properties-controls'
import { ComposedProperties } from './properties-layouts'

const meta = {
  args: { ...propertiesControlArgs, onRetry: fn() },
  argTypes: propertiesControlArgTypes,
  parameters: {
    controls: { exclude: ['empty', 'error', 'loading', 'variant'] },
  },
  render: (args) => <ComposedProperties {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Variants',
} satisfies Meta<PropertiesControls>

export default meta

type Story = StoryObj<PropertiesControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          '`loading`: one 24px skeleton per visible property, inside an `output` named by `labels.loading`, with `aria-busy` on the row and no menu trigger.',
      },
    },
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  parameters: {
    docs: {
      description: {
        story:
          '`error` with `onRetry`: the values give way to `labels.error` in `destructive-foreground`, announced as an alert, and a `labels.retry` badge button; the menu trigger leaves.',
      },
    },
  },
}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { empty: true },
  parameters: {
    docs: {
      description: {
        story:
          'No value on any display: every surface is `muted`, so the badge turns `outline` and its placeholder text `muted-foreground`.',
      },
    },
  },
}
