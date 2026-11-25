import {
  RichTextAlignButton,
  RichTextBlockButton,
  RichTextBlockSelect,
  RichTextExtraBlockButton,
  RichTextHistoryButton,
  RichTextLinkButton,
  RichTextMarkButton,
  RichTextToolbar,
} from '@tc96/ui/patterns/rich-text-editor'
import { ToolbarGroup, ToolbarSeparator } from '@tc96/ui/toolbar'
import type { RichTextEditor1Labels } from './types'

const headingBlocks = ['h1', 'h2', 'h3'] as const

export function RichTextEditor1Toolbar({
  labels,
}: Readonly<{ labels: RichTextEditor1Labels }>) {
  return (
    <RichTextToolbar
      aria-label={labels.toolbar}
      className="flex-nowrap overflow-x-auto"
    >
      <ToolbarGroup>
        <RichTextHistoryButton action="undo" label={labels.history.undo} />
        <RichTextHistoryButton action="redo" label={labels.history.redo} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <RichTextBlockSelect
        blockLabels={labels.blocks}
        blocks={headingBlocks}
        label={labels.blockType}
        paragraphLabel={labels.blocks.paragraph}
      />
      <ToolbarSeparator />
      <ToolbarGroup>
        <RichTextMarkButton label={labels.marks.bold} mark="bold" />
        <RichTextMarkButton label={labels.marks.italic} mark="italic" />
        <RichTextMarkButton label={labels.marks.underline} mark="underline" />
        <RichTextMarkButton
          label={labels.marks.strikethrough}
          mark="strikethrough"
        />
        <RichTextMarkButton label={labels.marks.code} mark="code" />
        <RichTextMarkButton label={labels.marks.highlight} mark="highlight" />
        <RichTextLinkButton labels={labels.link} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <RichTextBlockButton block="ul" label={labels.bulletList} />
        <RichTextBlockButton block="ol" label={labels.numberedList} />
        <RichTextExtraBlockButton block="todo" label={labels.taskList} />
        <RichTextBlockButton block="blockquote" label={labels.quote} />
        <RichTextExtraBlockButton block="code" label={labels.codeBlock} />
        <RichTextExtraBlockButton block="hr" label={labels.divider} />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <RichTextAlignButton alignment="left" label={labels.align.left} />
        <RichTextAlignButton alignment="center" label={labels.align.center} />
        <RichTextAlignButton alignment="right" label={labels.align.right} />
        <RichTextAlignButton alignment="justify" label={labels.align.justify} />
      </ToolbarGroup>
    </RichTextToolbar>
  )
}
