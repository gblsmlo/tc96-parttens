# 0010. O tc96 instala no layout do tc96-mono, pelo CLI `@tc96/cli`

- **Status:** Draft (decisão do dono na conversa de 2026-11-24; o texto espera a revisão dele)
- **Date:** 2026-11-24
- **Origin:** pedido do dono em 2026-11-24: o repositório passa de tc96-parttens para tc96-ui, a UI fica no pacote `@tc96/ui` dos repositórios consumidores, com o tc96-mono como referência de estrutura e padrão, e o CLI cria o `components.json` para que o destino possa mudar
- **Supersedes:** none
- **Amends:** [ADR 0007](0007-single-ui-package.md): o pacote único continua, agora com o nome `@tc96/ui`, as camadas em `src/{components,hooks,lib,helpers,patterns,blocks}` e o `cn` no `@tc96/utils`

## Context

| Força | Fonte |
| --- | --- |
| O tc96-mono tem `packages/ui` como `@tc96/ui`, com `exports` `"./*": "./src/components/*.tsx"`, `./hooks/*` e `./lib/*`, e `packages/utils` como `@tc96/utils` | `tc96-mono/packages/ui/package.json`, `tc96-mono/packages/utils/package.json` |
| O tc96-mono não tem `tsconfig.json` na raiz nem `paths`; cada pacote estende `@tc96/config` | `tc96-mono/packages/config/README.md` (MONO-05) |
| O CLI exigia `paths` no `tsconfig` da raiz para cada alias | `packages/registry/src/config.ts` (antes desta mudança) |
| O CLI instalava hooks e lib dentro do diretório de `ui`; no tc96-mono eles ficam em `src/hooks` e `src/lib` | `packages/registry/src/coss.ts` (antes desta mudança) |
| Os imports do repo (`@tc96/parttens`, `@tc96/blocks`, `@tc96/helpers`) diferiam dos que o consumidor recebe | `tsconfig.base.json` (antes desta mudança) |
| Publicar o CLI como `@tc96/ui` faria `bunx @tc96/ui` competir com o pacote local de mesmo nome | inferência; não verificado |

## Decision

Vamos instalar no layout do tc96-mono por padrão e publicar o CLI como `@tc96/cli` (comando `tc96`). `tc96 init` grava o `components.json` desse layout quando ele falta e acrescenta ao `packages/ui/package.json` os `exports` de camada ausentes; `tc96 add` resolve cada alias pelo `tsconfig` ou, sem entrada, pelos `exports` do pacote do workspace. O repo passa a ter o mesmo layout e os mesmos imports que o consumidor recebe.

**Axis that decided it:** boundary

## Alternatives

- **Manter o padrão do shadcn (`@acme/ui/components` com `paths`):** obriga o tc96-mono a ganhar `paths`, contra a regra MONO-05.
- **Publicar o CLI como `@tc96/ui`:** o nome coincide com o pacote do consumidor.
- **Só renomear `packages/parttens` para `packages/patterns`:** mantém imports diferentes entre o repo e o consumidor, e o código copiado das stories continua precisando de reescrita.

## Consequences

- Os imports do repo são `@tc96/ui/<componente>`, `@tc96/ui/hooks/*`, `@tc96/ui/lib/*`, `@tc96/ui/helpers/*`, `@tc96/ui/patterns` e `@tc96/ui/blocks/*`, iguais aos do consumidor.
- Os caminhos dos itens do registry passam a ser relativos a `packages/ui/src` (`patterns/...`), e a chave do agregado na baseline da API pública passa de `parttens` para `patterns`.
- O CLI ganha os aliases `hooks` e `lib`; sem eles, hooks e lib continuam dentro do diretório de `ui`, como antes.
- Um componente de pasta instalado pelo CLI ganha um export próprio no pacote, porque `./*` só alcança `*.tsx`.
- O `@tc96/parttens` no npm fica na 0.26.0 e precisa de `npm deprecate` apontando para `@tc96/cli`.

## Not verified

- A publicação do `@tc96/cli` no npm e o fluxo de release com o novo nome.
- A renomeação do repositório no GitHub para tc96-ui.
