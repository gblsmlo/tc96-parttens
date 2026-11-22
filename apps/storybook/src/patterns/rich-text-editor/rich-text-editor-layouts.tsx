import {
  EditorTitle,
  type EditorTitleHandle,
  RichTextEditor,
  type RichTextEditorHandle,
  type RichTextEditorProps,
} from '@tc96/parttens'
import { useRef } from 'react'
import type { RichTextEditorControls } from './rich-text-editor-controls.ts'
import {
  contentTitle,
  counterTitle,
  englishLabels,
  fullDocument,
  pixel,
  sampleMentions,
} from './rich-text-editor-data.ts'

export interface ComposedRichTextEditorProps extends RichTextEditorControls {
  autoFocusTitle?: boolean
  onTitleChange?: (value: string) => void
  onValueChange?: RichTextEditorProps['onValueChange']
}

const portuguese = {
  ariaLabel: 'Nota',
  titleEmptyLabel: 'Nota sem título',
  titleLabel: 'Título',
} as const

const english = {
  ariaLabel: 'Note',
  titleEmptyLabel: 'Untitled note',
  titleLabel: 'Title',
} as const

const titleSeed = (content: boolean, titleCounter: boolean) => {
  if (titleCounter) return counterTitle
  return content ? contentTitle : ''
}

export const ComposedRichTextEditor = ({
  autoFocusTitle = false,
  content,
  draggableBlocks,
  imagePicker,
  labels,
  maxListDepth,
  mentions,
  onTitleChange,
  onValueChange,
  placeholder,
  title,
  titleCounter,
}: Readonly<ComposedRichTextEditorProps>) => {
  const titleRef = useRef<EditorTitleHandle>(null)
  const bodyRef = useRef<RichTextEditorHandle>(null)
  const names = labels === 'english' ? english : portuguese
  const labelProps = labels === 'english' ? englishLabels : {}

  return (
    <div
      className={
        draggableBlocks ? 'flex flex-col gap-4 ps-10' : 'flex flex-col gap-4'
      }
      key={[
        content,
        draggableBlocks,
        labels,
        maxListDepth,
        mentions,
        titleCounter,
      ].join()}
    >
      {title ? (
        <EditorTitle
          autoFocus={autoFocusTitle}
          counterFrom={titleCounter ? 60 : undefined}
          defaultValue={titleSeed(content, titleCounter)}
          emptyLabel={names.titleEmptyLabel}
          label={names.titleLabel}
          max={titleCounter ? 80 : undefined}
          onArrowDownAtEnd={() => bodyRef.current?.focusStart()}
          onChange={onTitleChange}
          onEnter={() => bodyRef.current?.focusStart()}
          ref={titleRef}
        />
      ) : null}
      <RichTextEditor
        {...labelProps}
        aria-label={names.ariaLabel}
        defaultValue={content ? fullDocument : undefined}
        draggableBlocks={draggableBlocks}
        maxListDepth={maxListDepth}
        mentions={mentions ? sampleMentions : undefined}
        onExitStart={title ? () => titleRef.current?.focusEnd() : undefined}
        onPickImage={
          imagePicker
            ? async () => ({ alt: 'pixel.png', url: pixel })
            : undefined
        }
        onValueChange={onValueChange}
        placeholder={placeholder}
        ref={bodyRef}
      />
    </div>
  )
}
