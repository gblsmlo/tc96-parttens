import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import {
  RichTextEditor5,
  type RichTextEditor5Props,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { fn } from 'storybook/test'
import {
  rolloutAuthors,
  rolloutBreadcrumbs,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import type { RichTextEditor5Controls } from './rich-text-editor-5-controls.ts'

export const richTextEditor5Handlers = {
  onChange: fn(),
  onDecision: fn(),
}

export const PlanPage = (props: Readonly<RichTextEditor5Props>) => (
  <RichTextEditor5
    {...props}
    navbar={({ status }) => (
      <Navbar1 breadcrumbs={rolloutBreadcrumbs} status={status} />
    )}
  />
)

export const ComposedRichTextEditor5 = ({
  authorId,
  stepDelay,
}: Readonly<RichTextEditor5Controls>) => {
  const author =
    rolloutAuthors.find((person) => person.id === authorId) ?? rolloutAuthors[0]
  if (!author) return null
  return (
    <PlanPage
      author={author}
      defaultValue={rolloutValue()}
      formatTime={rolloutTime}
      key={authorId}
      onChange={richTextEditor5Handlers.onChange}
      onDecision={richTextEditor5Handlers.onDecision}
      stepDelay={stepDelay}
    />
  )
}
