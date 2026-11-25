import type { RichTextEditorInstance } from '@tc96/ui/patterns/rich-text-editor'
import { type Point, RangeApi, type TRange } from 'platejs'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { SuggestionAuthor } from '../shared/suggestions'
import { documentLines, passageLines } from './document-text'
import type {
  RichTextEditor5Finding,
  RichTextEditor5Plan,
  RichTextEditor5PlanEvent,
  RichTextEditor5Planner,
  RichTextEditor5Step,
  RichTextEditor5Task,
} from './types'
import { writeEdit } from './write-edit'

export interface Passage {
  range: TRange
  text: string
}

export interface RunState {
  edits: number
  findings: RichTextEditor5Finding[]
  scope: 'document' | 'passage'
  status: 'done' | 'failed' | 'running' | 'stopped'
  steps: RichTextEditor5Step[]
  task: RichTextEditor5Task
}

const isAsyncIterable = (
  value: unknown,
): value is AsyncIterable<RichTextEditor5PlanEvent> =>
  typeof value === 'object' && value !== null && Symbol.asyncIterator in value

async function* toEvents(
  result:
    | AsyncIterable<RichTextEditor5PlanEvent>
    | Promise<RichTextEditor5Plan>
    | RichTextEditor5Plan,
): AsyncGenerator<RichTextEditor5PlanEvent> {
  const resolved = await result
  if (isAsyncIterable(resolved)) {
    yield* resolved
    return
  }
  for (const step of resolved.steps) yield { step, type: 'step' }
  for (const edit of resolved.edits) yield { edit, type: 'edit' }
  for (const finding of resolved.findings) yield { finding, type: 'finding' }
}

function pause(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (ms <= 0 || signal.aborted) {
      resolve()
      return
    }
    const done = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', done)
      resolve()
    }
    const timer = setTimeout(done, ms)
    signal.addEventListener('abort', done, { once: true })
  })
}

export interface UseAssistantRunOptions {
  assistant: SuggestionAuthor
  author: SuggestionAuthor
  editor: RichTextEditorInstance
  planner: RichTextEditor5Planner
  stepDelay: number
}

export function useAssistantRun({
  assistant,
  author,
  editor,
  planner,
  stepDelay,
}: UseAssistantRunOptions) {
  const [run, setRun] = useState<RunState | null>(null)
  const [caret, setCaret] = useState<Point | null>(null)
  const controller = useRef<AbortController | null>(null)
  const created = useRef(new Set<string>())
  const latest = useRef({ assistant, author, planner, stepDelay })
  latest.current = { assistant, author, planner, stepDelay }

  useEffect(() => () => controller.current?.abort(), [])

  const start = useCallback(
    async (task: RichTextEditor5Task, passage: Passage | null) => {
      controller.current?.abort()
      const abort = new AbortController()
      controller.current = abort
      const current = () => controller.current === abort
      const ref = passage
        ? editor.api.rangeRef(passage.range, { affinity: 'inward' })
        : null
      const update = (change: (state: RunState) => RunState) => {
        if (current()) setRun((state) => (state ? change(state) : state))
      }
      setRun({
        edits: 0,
        findings: [],
        scope: passage ? 'passage' : 'document',
        status: 'running',
        steps: [],
        task,
      })
      setCaret(
        passage ? RangeApi.end(passage.range) : (editor.api.start([]) ?? null),
      )
      let written = 0
      try {
        const { planner: plan, stepDelay: delay } = latest.current
        const result = plan({
          selection: passage
            ? passageLines(editor, passage.range).join('\n')
            : null,
          signal: abort.signal,
          task,
          text: documentLines(editor).join('\n'),
        })
        for await (const event of toEvents(result)) {
          if (abort.signal.aborted) break
          if (event.type === 'step')
            update((state) => ({
              ...state,
              steps: [...state.steps, event.step],
            }))
          else if (event.type === 'finding')
            update((state) => ({
              ...state,
              findings: [...state.findings, event.finding],
            }))
          else {
            const at = writeEdit(editor, event.edit, {
              assistant: latest.current.assistant,
              author: latest.current.author,
              created: created.current,
              within: () => ref?.current ?? null,
            })
            if (at) {
              written += 1
              setCaret(at.focus)
              const edits = written
              update((state) => ({ ...state, edits }))
            }
          }
          await pause(delay, abort.signal)
        }
        update((state) => ({
          ...state,
          status: abort.signal.aborted ? 'stopped' : 'done',
        }))
      } catch {
        update((state) => ({ ...state, status: 'failed' }))
      } finally {
        ref?.unref()
        if (current()) controller.current = null
      }
    },
    [editor],
  )

  const stop = useCallback(() => {
    controller.current?.abort()
  }, [])

  const clear = useCallback(() => {
    controller.current?.abort()
    controller.current = null
    setRun(null)
    setCaret(null)
  }, [])

  return { caret, clear, created: created.current, run, start, stop }
}
