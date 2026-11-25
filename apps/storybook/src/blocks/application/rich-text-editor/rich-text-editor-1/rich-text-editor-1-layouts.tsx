import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import {
  RichTextEditor1,
  type RichTextEditor1Props,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-1'
import { fn } from 'storybook/test'
import {
  launchBrief,
  launchBriefBreadcrumbs,
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

export const DocumentPage = (props: Readonly<RichTextEditor1Props>) => (
  <RichTextEditor1
    {...props}
    navbar={({ menuItems, status }) => (
      <Navbar1
        breadcrumbs={launchBriefBreadcrumbs}
        menu={menuItems}
        status={status}
      />
    )}
  />
)

export const ComposedRichTextEditor1 = ({
  readOnly,
  saveDelay,
  showDescription,
  showStatus,
  withContent,
  withSave,
}: Readonly<RichTextEditor1Controls>) => (
  <DocumentPage
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
)
