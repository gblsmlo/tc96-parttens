import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import {
  RichTextEditor2,
  type RichTextEditor2Props,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import { fn } from 'storybook/test'
import {
  breadcrumbs,
  emptyPage,
  people,
  playbook,
} from '../fixtures/rich-text-editor-2.ts'
import type { RichTextEditor2Controls } from './rich-text-editor-2-controls.ts'

export const richTextEditor2Handlers = {
  onSave: fn(),
  onShare: fn(),
  onSettingsChange: fn(),
}

export const WikiPage = (props: Readonly<RichTextEditor2Props>) => (
  <RichTextEditor2
    {...props}
    navbar={({ pageMenuItems }) => (
      <Navbar1
        breadcrumbs={breadcrumbs}
        collaborators={(props.people ?? []).map(({ id, name }) => ({
          id,
          name,
        }))}
        menu={pageMenuItems}
        onShare={richTextEditor2Handlers.onShare}
      />
    )}
  />
)

export const ComposedRichTextEditor2 = ({
  fullWidth,
  locked,
  saveDelay,
  smallText,
  withPeople,
  withPlaybook,
}: Readonly<RichTextEditor2Controls>) => (
  <div className="p-6">
    <WikiPage
      defaultSettings={{ fullWidth, locked, smallText }}
      defaultValue={withPlaybook ? playbook : emptyPage}
      key={`${fullWidth}-${locked}-${smallText}-${withPlaybook}`}
      onSave={richTextEditor2Handlers.onSave}
      onSettingsChange={richTextEditor2Handlers.onSettingsChange}
      people={withPeople ? people : []}
      saveDelay={saveDelay}
    />
  </div>
)
