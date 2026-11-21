import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  anchoredToastManager,
  ToastProvider,
  toastManager,
} from '@tc96/ui/toast'
import { useRef } from 'react'
import { Slot } from '../../test-utils/anatomy-slot'
import { ToastScene } from './toast-layouts.tsx'

const showAnatomyToast = () =>
  toastManager.add({
    actionProps: { children: 'actionProps' },
    description: <Slot name="description" />,
    id: 'storybook-anatomy-toast',
    timeout: 0,
    title: <Slot name="title" />,
    type: 'info',
  })

const AnchoredAnatomyScene = () => {
  const anchor = useRef<HTMLButtonElement>(null)
  return (
    <ToastScene
      onMount={() =>
        anchoredToastManager.add({
          description: <Slot name="description" />,
          id: 'storybook-anchored-anatomy-toast',
          positionerProps: { anchor: anchor.current },
          timeout: 0,
          title: <Slot name="title" />,
          type: 'info',
        })
      }
    >
      <Button ref={anchor} variant="outline">
        <Slot name="positionerProps.anchor" />
      </Button>
    </ToastScene>
  )
}

const meta = {
  component: ToastProvider,
  parameters: {
    docs: { story: { iframeHeight: '320px', inline: false } },
    layout: 'centered',
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Toast/API Reference',
} satisfies Meta<typeof ToastProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <ToastScene onMount={showAnatomyToast}>
      <Slot name="children" />
    </ToastScene>
  ),
}

export const AnchoredAnatomy: Story = {
  render: () => <AnchoredAnatomyScene />,
}
