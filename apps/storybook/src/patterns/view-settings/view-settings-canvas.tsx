import type { Decorator } from '@storybook/react-vite'
import { CollectionToolbar } from '@tc96/ui/patterns'

export const ViewSettingsCanvas: Decorator = (Story) => (
  <div className="w-full max-w-6xl p-6">
    <CollectionToolbar right={<Story />} />
  </div>
)
