import { useEffect, useRef, useState } from 'react'
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from 'y-protocols/awareness'
import * as Y from 'yjs'
import {
  addReply,
  createThread,
  registerMember,
  setResolved,
} from './comments-store'
import type {
  RichTextEditor4Room,
  RichTextEditor4Status,
  RichTextEditor4User,
} from './types'
import {
  getSharedRoot,
  listTextBlocks,
  plainLength,
  plainText,
} from './yjs-tree'

interface Peer {
  awareness: Awareness
  doc: Y.Doc
}

interface AwarenessChange {
  added: number[]
  removed: number[]
  updated: number[]
}

function createLink(a: Peer, b: Peer) {
  const origin = Symbol('local-room-link')
  let connected = false

  const forwardDoc = (target: Y.Doc) => (update: Uint8Array, from: unknown) => {
    if (connected && from !== origin) Y.applyUpdate(target, update, origin)
  }
  const forwardAwareness =
    (source: Awareness, target: Awareness) =>
    ({ added, removed, updated }: AwarenessChange, from: unknown) => {
      if (!connected || from === origin) return
      applyAwarenessUpdate(
        target,
        encodeAwarenessUpdate(source, [...added, ...updated, ...removed]),
        origin,
      )
    }

  const docToB = forwardDoc(b.doc)
  const docToA = forwardDoc(a.doc)
  const awarenessToB = forwardAwareness(a.awareness, b.awareness)
  const awarenessToA = forwardAwareness(b.awareness, a.awareness)
  a.doc.on('update', docToB)
  b.doc.on('update', docToA)
  a.awareness.on('update', awarenessToB)
  b.awareness.on('update', awarenessToA)

  const exchange = (from: Peer, to: Peer) => {
    Y.applyUpdate(
      to.doc,
      Y.encodeStateAsUpdate(from.doc, Y.encodeStateVector(to.doc)),
      origin,
    )
    applyAwarenessUpdate(
      to.awareness,
      encodeAwarenessUpdate(from.awareness, [
        ...from.awareness.getStates().keys(),
      ]),
      origin,
    )
  }

  let saved: Record<string, unknown> | null = null

  return {
    connect() {
      if (connected) return
      connected = true
      exchange(a, b)
      exchange(b, a)
      if (saved) a.awareness.setLocalState(saved)
      saved = null
    },
    destroy() {
      connected = false
      a.doc.off('update', docToB)
      b.doc.off('update', docToA)
      a.awareness.off('update', awarenessToB)
      b.awareness.off('update', awarenessToA)
    },
    disconnect() {
      if (!connected) return
      saved = a.awareness.getLocalState()
      a.awareness.setLocalState(null)
      connected = false
    },
    get connected() {
      return connected
    },
  }
}

function refresh(awareness: Awareness) {
  const state = awareness.getLocalState()
  if (!state) return
  awareness.setLocalState(state)
  awareness.setLocalState(state)
}

export type LocalRoomStep =
  | { at: number; block: number; offset: number; type: 'caret'; user: string }
  | {
      at: number
      block: number
      from: number
      to: number
      type: 'select'
      user: string
    }
  | {
      at: number
      block: number
      offset: number | 'end'
      text: string
      type: 'type'
      user: string
    }
  | {
      at: number
      status: RichTextEditor4Status
      type: 'status'
      user: string
    }
  | {
      at: number
      block: number
      body: string
      from: number
      id: string
      to: number
      type: 'comment'
      user: string
    }
  | { at: number; body: string; thread: string; type: 'reply'; user: string }
  | { at: number; thread: string; type: 'resolve'; user: string }

export interface LocalRoomClock {
  clearTimeout: (handle: unknown) => void
  now: () => number
  setTimeout: (callback: () => void, delay: number) => unknown
}

export interface LocalRoomOptions {
  autoplay?: boolean
  clock?: LocalRoomClock
  script?: readonly LocalRoomStep[]
  teammates?: readonly RichTextEditor4User[]
}

export interface LocalTeammate {
  caret: (block: number, offset: number) => void
  comment: (input: {
    block: number
    body: string
    from: number
    id: string
    to: number
  }) => void
  doc: Y.Doc
  reply: (thread: string, body: string) => void
  resolve: (thread: string) => void
  select: (block: number, from: number, to: number) => void
  setStatus: (status: RichTextEditor4Status) => void
  type: (block: number, text: string, offset?: number | 'end') => void
  user: RichTextEditor4User
}

export interface LocalRoom extends RichTextEditor4Room {
  connect: () => void
  destroy: () => void
  disconnect: () => void
  join: () => RichTextEditor4Room
  readonly online: boolean
  replay: () => void
  step: () => LocalRoomStep | null
  stepAll: () => void
  teammates: readonly LocalTeammate[]
}

const defaultClock: LocalRoomClock = {
  clearTimeout: (handle) =>
    globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
  now: () => Date.now(),
  setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
}

const hasContent = (doc: Y.Doc) => getSharedRoot(doc).length > 0

const createPeer = (): Peer => {
  const doc = new Y.Doc()
  return { awareness: new Awareness(doc), doc }
}

function createTeammate(
  user: RichTextEditor4User,
  clock: LocalRoomClock,
): LocalTeammate & Peer {
  const peer = createPeer()
  registerMember(peer.doc, user)
  peer.awareness.setLocalState({
    data: user,
    presence: { status: 'viewing' },
    selection: null,
  })

  const blockAt = (index: number) =>
    listTextBlocks(getSharedRoot(peer.doc))[index]
  const relative = (block: Y.XmlText, offset: number) =>
    Y.relativePositionToJSON(
      Y.createRelativePositionFromTypeIndex(block, offset),
    )
  const setSelection = (block: Y.XmlText, from: number, to: number) =>
    peer.awareness.setLocalStateField('selection', {
      anchor: relative(block, from),
      focus: relative(block, to),
    })
  const setStatus = (status: RichTextEditor4Status) =>
    peer.awareness.setLocalStateField('presence', { status })

  return {
    ...peer,
    caret(index, offset) {
      const block = blockAt(index)
      if (!block) return
      setSelection(block, offset, offset)
    },
    comment({ block: index, body, from, id, to }) {
      const block = blockAt(index)
      if (!block) return
      const quote = plainText(block).slice(from, to)
      peer.doc.transact(() => {
        block.format(from, to - from, {
          comment: true,
          [`comment_${id}`]: true,
        })
        createThread(peer.doc, {
          author: user,
          body,
          createdAt: clock.now(),
          id,
          quote,
        })
      })
    },
    reply(thread, body) {
      addReply(peer.doc, thread, { author: user, body, createdAt: clock.now() })
    },
    resolve(thread) {
      setResolved(peer.doc, thread, true, user)
    },
    select(index, from, to) {
      const block = blockAt(index)
      if (!block) return
      setSelection(block, from, to)
    },
    setStatus,
    type(index, text, offset = 'end') {
      const block = blockAt(index)
      if (!block) return
      const at = offset === 'end' ? plainLength(block) : offset
      peer.doc.transact(() => block.insert(at, text, {}), `teammate:${user.id}`)
      setSelection(block, at + text.length, at + text.length)
      setStatus('editing')
    },
    user,
  }
}

export function createLocalRoom({
  autoplay = true,
  clock = defaultClock,
  script = [],
  teammates: users = [],
}: Readonly<LocalRoomOptions> = {}): LocalRoom {
  const hub = createPeer()
  hub.awareness.setLocalState(null)
  const clients: { link: ReturnType<typeof createLink>; peer: Peer }[] = []
  const links: ReturnType<typeof createLink>[] = []

  const attach = (peer: Peer) => {
    const link = createLink(peer, hub)
    link.connect()
    links.push(link)
    return link
  }

  const members = users.map((user) => {
    const teammate = createTeammate(user, clock)
    attach(teammate)
    return teammate
  })

  const ordered = [...script].sort((a, b) => a.at - b.at)
  let cursor = 0
  let timers: unknown[] = []
  let started = false

  const run = (step: LocalRoomStep) => {
    const teammate = members.find((member) => member.user.id === step.user)
    if (!teammate) return
    switch (step.type) {
      case 'caret':
        teammate.caret(step.block, step.offset)
        break
      case 'comment':
        teammate.comment(step)
        break
      case 'reply':
        teammate.reply(step.thread, step.body)
        break
      case 'resolve':
        teammate.resolve(step.thread)
        break
      case 'select':
        teammate.select(step.block, step.from, step.to)
        break
      case 'status':
        teammate.setStatus(step.status)
        break
      case 'type':
        teammate.type(step.block, step.text, step.offset)
        break
    }
  }

  const stop = () => {
    for (const timer of timers) clock.clearTimeout(timer)
    timers = []
  }

  const start = () => {
    stop()
    started = true
    const base = cursor
    ordered.slice(base).forEach((step, index) => {
      const timer = clock.setTimeout(() => {
        if (cursor === base + index) {
          cursor += 1
          run(step)
        }
      }, step.at)
      timers.push(timer)
    })
  }

  const watch = () => {
    if (autoplay && !started && hasContent(hub.doc)) start()
  }
  hub.doc.on('update', watch)

  const makeClient = (): RichTextEditor4Room => {
    const peer = createPeer()
    const link = attach(peer)
    clients.push({ link, peer })
    return {
      awareness: peer.awareness,
      connect: () => {
        link.connect()
        for (const other of [...members, ...clients.map((c) => c.peer)]) {
          if (other !== peer) refresh(other.awareness)
        }
      },
      disconnect: () => link.disconnect(),
      doc: peer.doc,
      replay: () => room.replay(),
    }
  }

  const primary = makeClient()

  const room: LocalRoom = {
    awareness: primary.awareness,
    connect: () => primary.connect?.(),
    destroy() {
      stop()
      hub.doc.off('update', watch)
      for (const link of links) link.destroy()
      for (const peer of [hub, ...members, ...clients.map((c) => c.peer)]) {
        peer.awareness.destroy()
        peer.doc.destroy()
      }
    },
    disconnect: () => primary.disconnect?.(),
    doc: primary.doc,
    join: makeClient,
    get online() {
      return clients[0]?.link.connected ?? false
    },
    replay() {
      stop()
      cursor = 0
      started = false
      for (const teammate of members) {
        teammate.setStatus('viewing')
        teammate.awareness.setLocalStateField('selection', null)
      }
      if (autoplay) start()
    },
    step() {
      const next = ordered[cursor]
      if (!next) return null
      cursor += 1
      run(next)
      return next
    },
    stepAll() {
      while (room.step()) {}
    },
    teammates: members,
  }
  return room
}

export function useLocalRoom(
  options?: Readonly<LocalRoomOptions>,
): LocalRoom | null {
  const [room, setRoom] = useState<LocalRoom | null>(null)
  const optionsRef = useRef(options)
  useEffect(() => {
    const created = createLocalRoom(optionsRef.current)
    setRoom(created)
    return () => created.destroy()
  }, [])
  return room
}
