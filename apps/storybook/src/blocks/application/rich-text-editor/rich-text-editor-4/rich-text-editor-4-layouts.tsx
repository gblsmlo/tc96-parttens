import type { Decorator } from '@storybook/react-vite'
import {
  type LocalRoom,
  type LocalRoomStep,
  RichTextEditor4,
  type RichTextEditor4Props,
  type RichTextEditor4Room,
  type RichTextEditor4Thread,
  useLocalRoom,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-4'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import { ToastProvider } from '@tc96/ui/toast'
import { useEffect, useMemo } from 'react'
import { fn } from 'storybook/test'
import {
  localUser,
  secondUser,
  specScript,
  specValue,
  teammateUsers,
} from '../fixtures/rich-text-editor-4.ts'
import type { RichTextEditor4Controls } from './rich-text-editor-4-controls.ts'

export const withToasts: Decorator = (Story) => (
  <ToastProvider position="bottom-center">
    <Story />
  </ToastProvider>
)

export const richTextEditor4Handlers = {
  onCommentsChange: fn<(threads: RichTextEditor4Thread[]) => void>(),
}

export const sessions: {
  room: LocalRoom | null
  second: RichTextEditor4Room | null
} = { room: null, second: null }

interface SessionOptions extends RichTextEditor4Controls {
  script?: LocalRoomStep[]
  value?: RichTextValue
}

function useSession({
  autoplay,
  script = specScript,
  teammates,
}: Readonly<SessionOptions>) {
  const room = useLocalRoom({
    autoplay,
    script,
    teammates: teammateUsers.slice(0, teammates),
  })
  useEffect(() => {
    sessions.room = room
    return () => {
      sessions.room = null
    }
  }, [room])
  return room
}

function withoutReplay(room: LocalRoom): RichTextEditor4Room {
  const { replay: _replay, ...rest } = room
  return rest
}

export const ComposedRichTextEditor4 = ({
  replay,
  value = specValue,
  ...options
}: Readonly<SessionOptions>) => {
  const room = useSession({ ...options, replay, value })
  const editorRoom = useMemo(
    () => (room ? (replay ? room : withoutReplay(room)) : null),
    [replay, room],
  )
  if (!editorRoom) return null
  return (
    <div className="p-4">
      <RichTextEditor4
        defaultValue={value}
        onCommentsChange={richTextEditor4Handlers.onCommentsChange}
        room={editorRoom}
        user={localUser}
      />
    </div>
  )
}

export const TwoClients = (
  props: Readonly<{ labels?: RichTextEditor4Props['labels'] }>,
) => {
  const room = useSession({ autoplay: false, replay: true, teammates: 3 })
  const second = useMemo(() => room?.join() ?? null, [room])
  useEffect(() => {
    sessions.second = second
    return () => {
      sessions.second = null
    }
  }, [second])
  if (!room || !second) return null
  return (
    <div className="grid gap-4 p-4 xl:grid-cols-2">
      <RichTextEditor4
        defaultValue={specValue}
        labels={{
          editor: 'Editor da Marina',
          title: 'Visão de Marina Costa',
          ...props.labels,
        }}
        onCommentsChange={richTextEditor4Handlers.onCommentsChange}
        room={room}
        user={localUser}
      />
      <RichTextEditor4
        defaultValue={specValue}
        labels={{ editor: 'Editor do Otávio', title: 'Visão de Otávio Reis' }}
        room={second}
        user={secondUser}
      />
    </div>
  )
}

export function selectText(editable: HTMLElement, text: string): void {
  const leaf = Array.from(
    editable.querySelectorAll('[data-slate-string]'),
  ).find((node) => node.textContent?.includes(text))
  const node = leaf?.firstChild
  if (!node) throw new Error(`Text not found: ${text}`)
  const start = (node.textContent ?? '').indexOf(text)
  editable.focus()
  const range = document.createRange()
  range.setStart(node, start)
  range.setEnd(node, start + text.length)
  const selection = document.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
