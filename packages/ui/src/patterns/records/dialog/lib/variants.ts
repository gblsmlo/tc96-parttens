import { cva } from 'class-variance-authority'

export const recordDialogDescriptionVariants = cva(
  'grid w-full [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:pt-0.5 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground',
  {
    defaultVariants: { minHeight: false },
    variants: {
      minHeight: {
        false: '[&_textarea]:min-h-0',
        true: '[&_textarea]:min-h-22',
      },
    },
  },
)

export const recordDialogInlineShellVariants = cva('', {
  defaultVariants: { headline: true, part: 'body' },
  variants: {
    headline: { false: '', true: '' },
    part: {
      body: 'flex flex-1 flex-col gap-3',
      properties: 'mt-auto flex flex-wrap items-center gap-2',
    },
  },
  compoundVariants: [{ class: 'pt-3', headline: false, part: 'body' }],
})

export const recordDialogRowShellVariants = cva('', {
  defaultVariants: { headline: true, part: 'body' },
  variants: {
    headline: { false: '', true: '' },
    part: {
      body: 'flex flex-1 flex-col',
      rows: 'mt-auto',
    },
  },
  compoundVariants: [
    { class: 'gap-4', headline: true, part: 'body' },
    { class: 'pt-3', headline: false, part: 'body' },
  ],
})

export const recordDialogBarShellVariants = cva('', {
  defaultVariants: { part: 'body' },
  variants: {
    part: {
      bar: 'mt-2 flex flex-wrap items-center gap-2',
      body: 'flex flex-1 flex-col',
      content: 'flex flex-1 flex-col pt-6 *:flex-1',
    },
  },
})
