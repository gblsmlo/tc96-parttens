import type { Decorator } from '@storybook/react-vite'

export const InspectorFrame: Decorator = (Story) => (
  <div className="flex h-160 justify-end overflow-hidden rounded-lg border">
    <Story />
  </div>
)

export const RendererFrame: Decorator = (Story) => (
  <div className="w-96 max-w-full">
    <Story />
  </div>
)

export const desktop = { viewport: { isRotated: false, value: 'desktop' } }

export const mobile = { viewport: { isRotated: false, value: 'mobile2' } }
