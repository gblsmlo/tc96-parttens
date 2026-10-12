---
capability: collection-gallery
plan: 0001
owner: tc96-frontend:frontend-developer
status: Ready
appetite: one implementation session
inputs: requirements.md, design.md and user-experience.md accepted by the owner on 2026-10-12
---

# Collection Gallery View Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: use executing-plans task by task, preserving the repository's TDD and verification rules.

**Goal:** Add a generic Gallery renderer to Collection Views and reproduce the supplied document-card composition in Storybook.

**Architecture:** `GalleryView` is a flat controlled renderer over `CollectionDefinition`, with a memoized consumer leaf plus internal empty and loading states. `CollectionViewOutlet` selects it through the new `gallery` mode and requires `renderGalleryItem` only for that mode.

**Tech Stack:** React 19, TypeScript, Bun Test, Tailwind CSS v4, COSS, CardSurface and Storybook 10.

---

### Task 1: Define Gallery behavior with failing tests

**Files:**

- Create: `packages/parttens/src/collection-views/views/gallery/components/gallery-view.test.tsx`
- Modify: `packages/parttens/src/collection-views/composition/collection-view-outlet.test.tsx`

1. Test source order, empty state, loading skeleton count and memoized renderer behavior.
2. Test that the outlet renders Gallery and rejects a missing Gallery renderer.
3. Run the focused tests and confirm they fail because Gallery does not exist yet.

### Task 2: Implement the minimal Gallery renderer

**Files:**

- Create: `packages/parttens/src/collection-views/views/gallery/components/gallery-view.tsx`
- Create: `packages/parttens/src/collection-views/views/gallery/components/gallery-view-item.tsx`
- Create: `packages/parttens/src/collection-views/views/gallery/components/gallery-item-skeleton.tsx`
- Create: `packages/parttens/src/collection-views/views/gallery/index.ts`
- Create: `packages/parttens/src/collection-views/views/gallery/README.md`
- Modify: `packages/parttens/src/collection-views/types/collection.ts`
- Modify: `packages/parttens/src/collection-views/composition/collection-view-outlet.tsx`
- Modify: `packages/parttens/src/collection-views/composition/index.ts`
- Modify: `packages/parttens/src/collection-views/index.ts`

1. Add the mode, renderer and outlet branch without domain fields or state.
2. Run focused tests until green.
3. Run TypeScript and Biome on the changed implementation.

### Task 3: Add the reference stories

**Files:**

- Create: `apps/storybook/src/patterns/collection-views/views/gallery.stories.tsx`

1. Add named Default, Loading and Empty states through serializable args.
2. Compose the screenshot from existing card, text, avatar, separator and icon APIs.
3. Run the focused Storybook tests in light and dark and inspect both rendered themes.

### Task 4: Record and verify the public contract

**Files:**

- Modify: `packages/parttens/src/collection-views/AGENTS.md`
- Modify: `docs/architecture/tc96-parttens.md`
- Modify: `docs/architecture/public-api-exports.json`

1. Record Gallery's import direction, flat-order and renderer invariants, data attributes and responsive scale.
2. Regenerate the public API baseline and inspect that only Gallery exports were added.
3. Run Biome, typecheck, focused tests, Storybook typecheck, `check:coss`, `boundaries:check`, `overrides:check` and `verify:public-api`.
4. Do not commit, push or publish without a separate owner request.

