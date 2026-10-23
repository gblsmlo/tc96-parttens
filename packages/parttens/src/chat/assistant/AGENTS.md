# Chat assistant pattern

A controlled AI assistant card for an editor: `AssistantPanel` (a `section` named by its `h2` on the COSS `Card`, placed `floating` over its container or `docked`, with a header, a greeting with suggestions or the conversation, the composer and a fixed disclaimer), `AssistantSuggestions` (the "try asking" list) and `AssistantComposer` (the COSS `Composer` with attach and send). The consumer passes the messages, the suggestions, `typing`, `expanded` and every callback, and answers `onSend` and `onSuggestion` itself. The pattern never calls a model, fetches, streams or persists; its only state is the draft of the composer and the scroll position held by `useChatScroll`.

## Map

| Folder | Holds |
| --- | --- |
| `composition/assistant-panel/` | `AssistantPanel`, its test and barrel |
| `composition/assistant-suggestions/` | `AssistantSuggestions`, its barrel |
| `composition/assistant-composer/` | `AssistantComposer`, its test and barrel |
| `components/` | building blocks of the panel, never public: header action with tooltip, empty state, message item |
| `lib/` | `variants.ts`: the root `cva` (placement and expanded), header, footer and suggestion classes |
| `store/` | `assistant-context.ts`: the merged `labels` the parts read |
| `types/` | the three prop interfaces |
| `test/dom.ts` | the JSDOM setup the tests import; this pattern's own copy, with the form-control globals, `document.fonts`, `ResizeObserver` and `getAnimations` the COSS composer and scroll area need |
| `core.ts` | React-free surface: message and suggestion types, `AssistantLabels`, the pt-BR defaults, `mergeAssistantLabels`, `assistantDraftText`, `assistantItemCount` |

Import direction: `composition/` → `components/`, `lib/`, `store/`, `types/`, `core.ts`; `components/` → `composition/assistant-suggestions/`, `lib/`, `store/`, `core.ts`. COSS comes from `@tc96/ui/<component>` and `@tc96/ui/chat/<part>`, plus `@tc96/ui/chat/hooks/use-chat-scroll`. No import into another pattern or into `packages/parttens/src/shared`.

## Dependents

- `packages/parttens/src/index.ts` re-exports `chat/assistant/index`.
- `packages/registry/src/manifest.ts` (`patternSources`) and `scripts/test-patterns.ts` list the folder `chat/assistant` for the registry item `chat-assistant`, which depends on `@coss/chat` and `@coss/composer` besides `badge`, `button`, `card` and `tooltip`.
- The workflow and agent-builder templates (T5) mount `AssistantPanel` by file path.

## Invariants

- The root is a `section` with `aria-labelledby` pointing at the `h2` `labels.title` (`Assistente`). It is not a dialog: the card is non-modal and takes no focus trap.
- `placement="floating"` is `absolute` with `end-4 bottom-4`, so the nearest positioned ancestor must be the canvas; the shadow sits on the `section`, not the `Card`. `expanded` only changes the floating size; there is no collapsed-to-header state, "Minimizar" returns to the compact size.
- Each header button (Nova conversa, Histórico, Expandir or Minimizar, Encerrar) renders only when its callback is passed, with a `Tooltip` and the same text as `aria-label`. The `Beta` badge shows unless `badge={false}`.
- With no messages and no `typing` the body is the empty state: `greeting`, `description` and the suggestions; the suggestions block disappears without `suggestions`. Otherwise it is a `ChatConversation` (`role="log"`); the typing indicator is a `role="status"` and sits after the last message.
- Sending sets `scroll.atBottomRef`, so the list follows the new message even if the user had scrolled up. `itemCount` counts the typing indicator.
- `AssistantComposer` is a controlled `Composer` over a `textarea`: `Enter` sends, `Shift + Enter` breaks the line, `onSend` gets the trimmed text and the draft clears; a blank draft sends nothing. The attach button exists only with `onAttach`.
- An assistant message with `error` shows its text in a `role="alert"` with a retry button when `onRetry` is passed; the pattern does not resend.
- Default copy is pt-BR (`assistantDefaultLabels`, `assistantDefaultDisclaimer`, `assistantDefaultPlaceholder`); the consumer overrides through `labels`, `disclaimer` and `placeholder`.

## Styling

| Attribute | Where |
| --- | --- |
| `data-slot="assistant-panel"`, `data-placement="floating\|docked"`, `data-expanded` | the `section`, always |
| `data-slot="assistant-header"`, `assistant-actions`, `assistant-footer`, `assistant-disclaimer` | header, its action group, the footer and the disclaimer |
| `data-slot="assistant-empty"`, `assistant-greeting`, `assistant-description` | the empty state |
| `data-slot="assistant-suggestions"`, `assistant-suggestion` | the list section and each button |
| `data-error="true"` | the `ChatMessage` of an errored assistant message |

- Colors come from tokens only. `scripts/override-exceptions.json` has one entry here: `ComposerInput` with `placeholder:text-muted-foreground`, because the COSS placeholder (`muted-foreground/72`) measured 3,08:1 in light and 3,15:1 in dark. The ratios are in `docs/architecture/tc96-parttens.md`, section "Patterns: Chat Assistant".
- The `ChatConversation` edge fades come from `popover` and the `Card` is `card`; they match in the example theme. A consumer theme where the two differ sees a faint band at the list edges.

## Verify

```bash
bun test --isolate packages/parttens/src/chat/assistant
bunx biome check packages/parttens/src/chat
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
bun test packages/registry
cd apps/storybook && bunx vitest run --project=storybook --project=storybook-dark src/patterns/chat/assistant
```

The stories are in `apps/storybook/src/patterns/chat/assistant/`. `assistant-panel.stories.tsx` (`Patterns/Chat/Assistant`) is the root with the `Doc` page and its `usage` and `api`: `Empty` (clicks a suggestion), `Conversation` (types and sends), `Typing`, `Error`, `Expanded` and `Minimized`, all floating inside a positioned decorator. `usages/workflow.stories.tsx` owns the conversation as a consumer would, with the workflow editor's suggestions. The stories run axe with `test: 'error'`.

## Pointers

- Public API: `index.ts` and the `chat-assistant` entry of `docs/architecture/public-api-exports.json`. Props are in `types/index.ts`, the data types in `core.ts`.
- Decisions: ADR 0006 D9 and `docs/architecture/tc96-parttens.md`, section "Patterns: Chat Assistant". UX: `.specs/flow-editors/user-experience.md` §2 "Assistente".
