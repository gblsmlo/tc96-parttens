# Example consumer

A COSS project as tc96 expects to find it, used by the consumer tests. It is
never installed into in place: `test:consumer:registry` and `test:consumer:ssr`
copy it to `.test-output/` and then:

1. install the COSS components from the locked snapshot in `packages/ui`,
   rewriting their imports to the `@acme/*` aliases as shadcn would, and add a
   marker class to the consumer's `button.tsx`;
2. install the packed `tc96-parttens` CLI and run `tc96-parttens add`.

What it proves:

- aliases come from `components.json`; `patterns` resolves to
  `packages/organisms/src`, a path other than the default;
- the patterns compile against the consumer's COSS (`tsc --noEmit`);
- the CLI generates the `@acme/patterns` barrel, which keeps patterns from
  earlier runs and, with every pattern installed, exports the workspace
  aggregate's public API;
- server rendering through the barrel uses the consumer's button, so the
  marker shows up;
- nothing is written to the consumer's `packages/ui`.

`src/ssr.tsx` only compiles after the patterns are installed, so this
directory is outside the workspace typecheck.
