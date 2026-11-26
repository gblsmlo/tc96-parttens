# 0011. Os temas viram o pacote `@tc96/themes`, e o CLI instala um preset por consumidor

- **Status:** Draft (decisão do dono na conversa de 2026-11-26; o texto espera a revisão dele)
- **Date:** 2026-11-26
- **Origin:** pedido do dono em 2026-11-26: a feature de temas passa a ser um pacote com `scripts`, `registry` e `fonts`, para gerir os temas criados e permitir que o consumidor instale pelo CLI só o tema que quiser; o tweakcn deixa de ser fonte e fica como referência, com créditos no `AGENTS.md`
- **Supersedes:** a linha "Presets de tema por `data-theme-preset` no tema do exemplo" da tabela de decisões de `docs/architecture/tc96-ui.md` (2026-10-21), no ponto em que os presets do tweakcn eram gerados pelo `sync:themes`
- **Amends:** [ADR 0008](0008-ui-owned-source.md): temas e tokens continuam fora de `packages/ui`, agora em `packages/themes`

## Context

| Força | Fonte |
| --- | --- |
| Os 42 presets do tweakcn eram regenerados de `https://tweakcn.com/r/themes/registry.json` a cada `sync:themes`, sem revisão por preset | `scripts/sync-themes.ts` (antes desta mudança) |
| O `Default` ficava escrito à mão em `styles.css` e as base colors em `base-colors.css`, cada um num formato | `apps/example/packages/ui/src/styles.css`, `themes/base-colors.css` (antes desta mudança) |
| O CLI só listava os tokens ausentes e nunca escrevia no CSS do consumidor | `packages/registry/src/cli.ts` (`tc96 does not edit your CSS`) |
| O tweakcn organiza o tema em cores (primary, secondary, accent, base, card, popover, muted, destructive, border & input, chart, sidebar), tipografia e outros, e separa registry, fontes e aplicação em runtime | `jnsahaj/tweakcn`: `utils/registry`, `utils/fonts`, `utils/apply-theme.ts` |

## Decision

Vamos guardar cada tema como dados em `packages/themes/src/presets/<nome>.ts`, nos grupos colors, typography e other, e gerar dele o CSS do exemplo e o item de registry. O `tc96 add --theme <nome>` grava um único preset em `themes/<nome>.css`, ao lado do stylesheet do `components.json`, sob `:root` e `.dark`, e o importa no stylesheet com as fontes web; trocar de preset substitui o anterior. O CLI passa a escrever no CSS do consumidor só nesse comando e só depois de confirmação (ou `--yes`).

**Axis that decided it:** boundary

## Alternatives

- **Manter o `sync:themes`:** os presets mudam quando o tweakcn muda, sem revisão nem contraste registrado.
- **Instalar todos os presets com `data-theme-preset`:** o consumidor recebe temas que não usa.
- **Só imprimir as regras do tema, como o CLI faz com os tokens ausentes:** o consumidor copia à mão e perde a troca de preset pelo CLI.

## Consequences

- Um preset novo ou revisado é um arquivo de dados; `bun run themes:build` regenera `apps/example/packages/ui/src/themes/presets.css`, e `themes:check` reprova quando o arquivo gerado está velho.
- O grupo `status` (info, success, warning, purple, teal, switch-track, code) e o `destructive-foreground` são tokens do COSS que o tweakcn não tem; um preset que não os define herda os do `Default`.
- Os valores com `--alpha()` e `var(--color-*)` dependem do Tailwind do consumidor; `applyThemeStyles` converte `--alpha()` para `color-mix` ao aplicar em runtime.
