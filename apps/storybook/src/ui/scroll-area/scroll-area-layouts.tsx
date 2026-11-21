import { ScrollArea } from '@tc96/ui/scroll-area'
import type { ScrollAreaControls } from './scroll-area-controls.ts'

interface FileEntry {
  modified: string
  name: string
  owner: string
  size: string
}

export const longFileName =
  'quarterly-revenue-forecast-by-region-and-channel-final-v3.xlsx'

const fileNames = [
  'brand-guidelines.pdf',
  longFileName,
  'onboarding-checklist.docx',
  'hero-banner@2x.png',
  'customer-interviews.mp4',
  'pricing-page-copy.md',
  'invoice-0423.pdf',
  'team-offsite-agenda.docx',
  'logo-dark.svg',
  'logo-light.svg',
  'roadmap-2027.key',
  'support-macros.csv',
  'release-notes-4.2.md',
  'contract-acme-signed.pdf',
  'icon-set.fig',
  'usability-test-notes.md',
  'q3-board-deck.pptx',
  'press-kit.zip',
  'newsletter-october.html',
  'api-keys-rotation.txt',
  'expense-report-sept.xlsx',
  'feature-flags.json',
  'office-floor-plan.pdf',
  'recruiting-pipeline.csv',
  'style-tokens.json',
  'interview-scorecard.docx',
  'launch-video-final.mov',
  'security-review.pdf',
  'payroll-summary.xlsx',
  'sitemap.xml',
]

const owners = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Rocha']

const files: FileEntry[] = fileNames.map((name, index) => ({
  modified: `Oct ${String((index % 28) + 1).padStart(2, '0')}, 2026`,
  name,
  owner: owners[index % owners.length] ?? 'Ana Souza',
  size: `${(((index * 37) % 480) / 10 + 0.4).toFixed(1)} MB`,
}))

const scrollAreaClassName = 'h-72 w-64 rounded-lg border'

const FileRow = ({ file }: Readonly<{ file: FileEntry }>) => (
  <li className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
    <span className="truncate">{file.name}</span>
    <span className="ms-auto shrink-0 text-muted-foreground tabular-nums">
      {file.size}
    </span>
  </li>
)

interface ComposedScrollAreaProps extends ScrollAreaControls {
  overscrollContain?: boolean
}

export const ComposedScrollArea = ({
  clampContentMinWidth,
  overscrollContain,
  rows,
  scrollbarGutter,
  scrollFade,
}: Readonly<ComposedScrollAreaProps>) => (
  <ScrollArea
    className={scrollAreaClassName}
    clampContentMinWidth={clampContentMinWidth}
    overscrollContain={overscrollContain}
    scrollbarGutter={scrollbarGutter}
    scrollFade={scrollFade}
  >
    <ul aria-label="Files" className="flex flex-col p-1">
      {files.slice(0, rows).map((file) => (
        <FileRow file={file} key={file.name} />
      ))}
    </ul>
  </ScrollArea>
)

export const HorizontalScrollArea = () => (
  <ScrollArea className="w-96 max-w-full rounded-lg border">
    <ul aria-label="Files" className="flex w-max gap-3 p-3">
      {files.slice(0, 12).map((file) => (
        <li
          className="flex w-36 shrink-0 flex-col gap-1 rounded-md bg-muted p-3 text-sm"
          key={file.name}
        >
          <span className="truncate font-medium">{file.name}</span>
          <span className="text-muted-foreground tabular-nums">
            {file.size}
          </span>
        </li>
      ))}
    </ul>
  </ScrollArea>
)

export const BothAxesScrollArea = () => (
  <ScrollArea className="h-72 w-80 max-w-full rounded-lg border">
    <ul aria-label="Files" className="flex w-max flex-col p-1">
      {files.map((file) => (
        <li
          className="grid grid-cols-[16rem_5rem_7rem_8rem] gap-4 rounded-md px-3 py-2 text-sm"
          key={file.name}
        >
          <span className="truncate">{file.name}</span>
          <span className="text-muted-foreground tabular-nums">
            {file.size}
          </span>
          <span className="text-muted-foreground">{file.modified}</span>
          <span className="text-muted-foreground">{file.owner}</span>
        </li>
      ))}
    </ul>
  </ScrollArea>
)

export const FillScrollArea = () => (
  <ScrollArea className={scrollAreaClassName} fill>
    <div className="flex min-h-full flex-col p-1">
      <ul aria-label="Files" className="flex flex-col">
        {files.slice(0, 3).map((file) => (
          <FileRow file={file} key={file.name} />
        ))}
      </ul>
      <p className="mt-auto border-t px-3 py-2 text-muted-foreground text-sm">
        3 files
      </p>
    </div>
  </ScrollArea>
)

export const NestedScrollArea = () => (
  <ScrollArea className="h-80 w-72 rounded-lg border">
    <div className="flex flex-col gap-3 p-4 text-sm">
      <p className="font-medium">Shared folder</p>
      <p className="text-muted-foreground">
        Files the whole team can open and edit. New uploads appear at the top of
        the list.
      </p>
      <ComposedScrollArea
        clampContentMinWidth
        overscrollContain
        rows={files.length}
        scrollbarGutter={false}
        scrollFade={false}
      />
      {files.slice(0, 12).map((file) => (
        <p className="text-muted-foreground" key={file.name}>
          {file.owner} uploaded {file.name}.
        </p>
      ))}
    </div>
  </ScrollArea>
)
