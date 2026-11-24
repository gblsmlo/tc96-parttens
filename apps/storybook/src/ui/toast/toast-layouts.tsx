import { FloppyDiskIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  AnchoredToastProvider,
  anchoredToastManager,
  type ToastPosition,
  ToastProvider,
  toastManager,
} from '@tc96/ui/toast'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import type { ToastControls } from './toast-controls.ts'

interface ToastSceneProps {
  children: ReactNode
  onMount?: () => void
  position?: ToastPosition
}

interface ComposedToastProps extends ToastControls {
  onAction?: () => void
  showOnMount?: boolean
  timeout?: number
}

interface ShowOnMountProps {
  showOnMount?: boolean
}

interface AnchoredToastProps extends ShowOnMountProps {
  tooltipStyle?: boolean
}

interface ArchiveWithUndoProps extends ShowOnMountProps {
  onUndo?: () => void
}

interface UploadFilesProps extends ShowOnMountProps {
  delay?: number
}

type ToastContent = Pick<ToastControls, 'action' | 'description' | 'title'> &
  Partial<Pick<ToastControls, 'type'>>

export const composedToastId = 'storybook-composed-toast'

export const ToastScene = ({
  children,
  onMount,
  position,
}: Readonly<ToastSceneProps>) => {
  const mount = useRef(onMount)
  useEffect(() => {
    mount.current?.()
  }, [])
  return (
    <ToastProvider position={position}>
      <AnchoredToastProvider>{children}</AnchoredToastProvider>
    </ToastProvider>
  )
}

const addComposedToast = (
  { action, description, title, type }: ToastContent,
  timeout: number,
  onAction?: () => void,
) =>
  toastManager.add({
    actionProps: action
      ? {
          children: 'Undo',
          onClick: () => {
            onAction?.()
            toastManager.close(composedToastId)
          },
        }
      : undefined,
    description: description || undefined,
    id: composedToastId,
    timeout,
    title: title || undefined,
    type: type === 'default' ? undefined : type,
  })

export const ComposedToast = ({
  action,
  description,
  onAction,
  position,
  showOnMount = true,
  timeout = 0,
  title,
  type,
}: Readonly<ComposedToastProps>) => {
  useEffect(() => {
    if (showOnMount) {
      addComposedToast({ action, description, title, type }, timeout, onAction)
    }
  }, [action, description, onAction, showOnMount, timeout, title, type])
  return (
    <ToastScene position={position}>
      <Button
        onClick={() =>
          addComposedToast(
            { action, description, title, type },
            timeout,
            onAction,
          )
        }
        variant="outline"
      >
        Show toast
      </Button>
    </ToastScene>
  )
}

const stackedMessages = [
  'Short message.',
  'A message long enough to wrap onto a second line in the toast.',
  'A longer message that runs across several lines, so the stack has to measure each toast before it lays them out and expands.',
  'Done.',
]

const addStackedToast = (count: number) => {
  const toastTitle = `Toast ${count + 1}`
  return toastManager.add({
    description: stackedMessages[count % stackedMessages.length],
    id: `storybook-stacked-toast-${count}`,
    timeout: 0,
    title: toastTitle,
  })
}

export const StackedToasts = ({
  showOnMount = true,
}: Readonly<ShowOnMountProps>) => {
  const [count, setCount] = useState(showOnMount ? 3 : 0)
  const showStack = () => {
    for (const index of [0, 1, 2]) addStackedToast(index)
  }
  return (
    <ToastScene onMount={showOnMount ? showStack : undefined}>
      <Button
        onClick={() => {
          addStackedToast(count)
          setCount(count + 1)
        }}
        variant="outline"
      >
        Add toast
      </Button>
    </ToastScene>
  )
}

const addAnchoredToast = (anchor: Element | null, tooltipStyle: boolean) =>
  anchoredToastManager.add({
    data: { tooltipStyle },
    description: 'Describe what happened here.',
    id: 'storybook-anchored-toast',
    positionerProps: { anchor },
    timeout: 0,
    title: 'Heads up!',
  })

export const AnchoredToast = ({
  showOnMount = true,
  tooltipStyle = false,
}: Readonly<AnchoredToastProps>) => {
  const anchor = useRef<HTMLButtonElement>(null)
  return (
    <ToastScene
      onMount={
        showOnMount
          ? () => addAnchoredToast(anchor.current, tooltipStyle)
          : undefined
      }
    >
      <Button
        onClick={() => addAnchoredToast(anchor.current, tooltipStyle)}
        ref={anchor}
        variant="outline"
      >
        Show toast
      </Button>
    </ToastScene>
  )
}

const archiveMessage = (onUndo?: () => void) => {
  const id = toastManager.add({
    actionProps: {
      children: 'Undo',
      onClick: () => {
        onUndo?.()
        toastManager.close(id)
        toastManager.add({
          description: 'The message is back in your inbox.',
          title: 'Message restored',
          type: 'info',
        })
      },
    },
    description: 'It moved to the Archive folder.',
    timeout: 0,
    title: 'Message archived',
    type: 'success',
  })
}

export const ArchiveWithUndo = ({
  onUndo,
  showOnMount = true,
}: Readonly<ArchiveWithUndoProps>) => (
  <ToastScene onMount={showOnMount ? () => archiveMessage(onUndo) : undefined}>
    <Button onClick={() => archiveMessage(onUndo)} variant="outline">
      Archive
    </Button>
  </ToastScene>
)

const saveSettings = () =>
  toastManager.add({
    description: 'Everyone in the workspace sees the new settings.',
    id: 'storybook-settings-saved',
    title: 'Settings saved',
    type: 'success',
  })

export const SaveSettings = ({
  showOnMount = true,
}: Readonly<ShowOnMountProps>) => (
  <ToastScene onMount={showOnMount ? saveSettings : undefined}>
    <Button onClick={saveSettings} variant="outline">
      Save
    </Button>
  </ToastScene>
)

const uploadFiles = (delay: number) =>
  toastManager.promise(
    new Promise<string>((resolve) =>
      setTimeout(() => resolve('3 files uploaded'), delay),
    ),
    {
      error: () => ({
        description: 'Check your connection and try again.',
        title: 'Upload failed',
      }),
      loading: {
        description: 'The files are uploading.',
        title: 'Uploading…',
      },
      success: (result: string) => ({
        description: result,
        title: 'Upload complete',
      }),
    },
  )

export const UploadFiles = ({
  delay = 2000,
  showOnMount = true,
}: Readonly<UploadFilesProps>) => (
  <ToastScene onMount={showOnMount ? () => uploadFiles(delay) : undefined}>
    <Button onClick={() => uploadFiles(delay)} variant="outline">
      Upload files
    </Button>
  </ToastScene>
)

const saveDraft = (anchor: Element | null) =>
  anchoredToastManager.add({
    data: { tooltipStyle: true },
    id: 'storybook-draft-saved',
    positionerProps: { anchor, sideOffset: 6 },
    timeout: 2000,
    title: 'Draft saved',
  })

export const SaveDraft = ({
  showOnMount = true,
}: Readonly<ShowOnMountProps>) => {
  const anchor = useRef<HTMLButtonElement>(null)
  return (
    <ToastScene
      onMount={showOnMount ? () => saveDraft(anchor.current) : undefined}
    >
      <Tooltip>
        <TooltipTrigger
          delay={0}
          render={
            <Button
              aria-label="Save draft"
              onClick={() => saveDraft(anchor.current)}
              ref={anchor}
              size="icon"
              variant="outline"
            />
          }
        >
          <FloppyDiskIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipPopup>Save draft</TooltipPopup>
      </Tooltip>
    </ToastScene>
  )
}
