import { ListBulletsIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { NodeApi } from 'platejs'
import {
  type PlateEditor,
  useEditorRef,
  useEditorSelector,
} from 'platejs/react'
import { useMemo, useState } from 'react'
import type { RichTextEditor2Labels } from './types'

interface OutlineItem {
  index: number
  level: 2 | 3
  text: string
}

function headingsOf(editor: PlateEditor): string {
  const items: OutlineItem[] = []
  editor.children.forEach((node, index) => {
    if (node.type !== 'h2' && node.type !== 'h3') return
    const text = NodeApi.string(node).trim()
    if (text) items.push({ index, level: node.type === 'h2' ? 2 : 3, text })
  })
  return JSON.stringify(items)
}

function useOutline(): { items: OutlineItem[]; jump: (index: number) => void } {
  const editor = useEditorRef()
  const serialized = useEditorSelector(headingsOf, [])
  const items = useMemo(
    () => JSON.parse(serialized) as OutlineItem[],
    [serialized],
  )
  const jump = (index: number) => {
    const node = editor.children[index]
    if (!node) return
    editor.api
      .toDOMNode(node)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return { items, jump }
}

export function WikiOutlineRail({
  labels,
}: Readonly<{ labels: RichTextEditor2Labels }>) {
  const { items, jump } = useOutline()
  if (items.length === 0) return null

  return (
    <div
      className="pointer-events-none absolute inset-y-0 inset-e-0 hidden lg:block"
      data-slot="wiki-outline-rail"
    >
      <nav
        aria-label={labels.outline}
        className="group/outline pointer-events-auto sticky top-24 ms-auto w-8 rounded-xl border border-transparent p-1 transition-[width] focus-within:w-60 focus-within:border-border focus-within:bg-popover focus-within:shadow-lg/5 hover:w-60 hover:border-border hover:bg-popover hover:shadow-lg/5"
      >
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={`${item.index}-${item.text}`}>
              <button
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-start text-muted-foreground text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
                data-level={item.level}
                onClick={() => jump(item.index)}
                type="button"
              >
                <span
                  className={cn(
                    'sr-only min-w-0 flex-1 truncate group-focus-within/outline:not-sr-only group-hover/outline:not-sr-only',
                    item.level === 3 && 'ps-3',
                  )}
                >
                  {item.text}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'ms-auto h-0.5 shrink-0 rounded-full bg-current opacity-60',
                    item.level === 2 ? 'w-4' : 'w-2',
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export function WikiOutlinePopover({
  labels,
}: Readonly<{ labels: RichTextEditor2Labels }>) {
  const { items, jump } = useOutline()
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        aria-label={labels.outlineTrigger}
        render={<Button className="lg:hidden" size="icon-sm" variant="ghost" />}
      >
        <ListBulletsIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup align="start" className="w-64">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">{labels.outlineEmpty}</p>
        ) : (
          <ul
            aria-label={labels.outline}
            className="flex flex-col gap-0.5"
            data-slot="wiki-outline-list"
          >
            {items.map((item) => (
              <li key={`${item.index}-${item.text}`}>
                <button
                  className={cn(
                    'flex w-full cursor-pointer items-center truncate rounded-md px-2 py-1 text-start text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring',
                    item.level === 3 && 'ps-5 text-muted-foreground',
                  )}
                  onClick={() => {
                    setOpen(false)
                    jump(item.index)
                  }}
                  type="button"
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverPopup>
    </Popover>
  )
}
