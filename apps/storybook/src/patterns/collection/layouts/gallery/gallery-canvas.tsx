import type { Decorator } from '@storybook/react-vite'

export const GalleryCanvas: Decorator = (Story) => (
  <div className="w-5xl max-w-full p-4">
    <Story />
  </div>
)
