import { RichTextEditor1 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-1'
import { fn } from 'storybook/test'
import {
  launchBrief,
  launchBriefDescription,
  launchBriefStatus,
  launchBriefTitle,
} from '../fixtures/rich-text-editor-1.ts'
import type { RichTextEditor1Controls } from './rich-text-editor-1-controls.ts'

export const richTextEditor1Handlers = {
  onChange: fn(),
  onClear: fn(),
  onCopy: fn(),
  onReadOnlyChange: fn(),
  onSave: fn(),
  onTitleChange: fn(),
}

export const ComposedRichTextEditor1 = ({
  readOnly,
  saveDelay,
  showDescription,
  showStatus,
  withContent,
  withSave,
}: Readonly<RichTextEditor1Controls>) => (
  <div className="mx-auto max-w-6xl p-6">
    <RichTextEditor1
      defaultTitle={launchBriefTitle}
      {...(withContent ? { defaultValue: launchBrief } : {})}
      {...(showDescription ? { description: launchBriefDescription } : {})}
      onChange={richTextEditor1Handlers.onChange}
      onClear={richTextEditor1Handlers.onClear}
      onCopy={richTextEditor1Handlers.onCopy}
      onReadOnlyChange={richTextEditor1Handlers.onReadOnlyChange}
      onSave={withSave ? richTextEditor1Handlers.onSave : undefined}
      onTitleChange={richTextEditor1Handlers.onTitleChange}
      readOnly={readOnly || undefined}
      saveDelay={saveDelay}
      {...(showStatus ? { status: launchBriefStatus } : {})}
    />
  </div>
)
