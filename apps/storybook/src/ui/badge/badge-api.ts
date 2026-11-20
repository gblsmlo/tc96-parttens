import type { ApiReferenceEntry } from '../../../.storybook/docs-page.tsx'

export const badgeVariantNames = [
  'primary',
  'secondary',
  'outline',
  'destructive',
  'error',
  'info',
  'success',
  'warning',
] as const

export const badgeSizeNames = ['default', 'large'] as const

export const badgeApi = {
  Badge: {
    description: `A short label with variant and size options. Custom component built on the Base UI \`useRender\` hook, not a Base UI wrapper; \`badgeVariants\` is the \`cva\` behind it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`variant\` | \`"primary"\`, \`"destructive"\`, \`"error"\`, \`"info"\`, \`"outline"\`, \`"secondary"\`, \`"success"\` or \`"warning"\` | \`"primary"\` | Controls the badge styling and color scheme; COSS names \`primary\` \`"default"\` |
| \`size\` | \`"default"\` or \`"large"\` | \`"default"\` | Controls the badge size; COSS names \`large\` \`"lg"\` and also has \`"sm"\`, which this workspace removed |
| \`render\` | \`React.ReactElement\` | - | Renders as a different element (e.g., \`Link\`) |

Rendered as a \`button\` or an \`a\`, the badge gets a pointer cursor, a hover color and, with a coarse pointer, a 44px hit area. An icon before the text is decorative: give it \`aria-hidden\`.`,
    name: 'Badge',
  },
} satisfies Record<string, ApiReferenceEntry>
