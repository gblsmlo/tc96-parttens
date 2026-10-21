# 0004. Templates vivem só no Storybook, em `Templates/`, fora do registry e do CLI

- **Status:** Accepted (dono, na conversa de 2026-10-20)
- **Date:** 2026-10-20
- **Origin:** mapeamento do Verve CRM (`docs/plans/2026-10-20-verve-crm-mapeamento.md`), pedido do dono: "Full page devem ser montada em Templates"

## Context

| Força | Fonte |
| --- | --- |
| O mapeamento do Verve CRM achou 20 páginas inteiras que compõem patterns existentes ou candidatos | `docs/plans/2026-10-20-verve-crm-mapeamento.md` (Templates) |
| O repo não tem camada de Templates: nenhuma pasta em `packages/parttens/src`, nenhuma story em `Templates/` | `ls packages/parttens/src apps/storybook/src` |
| A estrutura do consumidor põe templates e páginas na aplicação, em `apps/web/` | `docs/architecture/tc96-parttens.md:281` |
| Patterns não carregam regra de negócio nem dados; são controlados pelo consumidor | `AGENTS.md` (Code conventions) |
| `bun run story:source <id>` já entrega uma story como componente pronto, com helpers, dados e imports | `AGENTS.md` (Visual work) |

## Decision

Uma página inteira que compõe patterns é um template. Templates existem só como stories no Storybook, sob o título `Templates/<Nome>`. Não entram em `packages/parttens`, não têm item no registry e o CLI não os distribui.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Lugar | `apps/storybook/src/templates/`, uma pasta por template, com fixtures próprias |
| D2. Título | `Templates/<Nome>` na sidebar, ao lado de `UI/` e `Patterns/` |
| D3. Composição | O template importa patterns pelo barrel `@tc96/parttens` e componentes COSS por `@tc96/ui/<component>`; não cria componente que outro template reutilize. Um bloco que mais de um template precisa vira pattern |
| D4. Cópia | O consumidor leva um template com `bun run story:source <id>` ou pelo painel Code, como qualquer story |
| D5. Registry | `patternSources` em `packages/registry/src/manifest.ts` não ganha entrada de template; `docs/architecture/public-api-exports.json` não muda |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| Família `templates/` em `packages/parttens`, distribuída pelo CLI | a página é da aplicação do consumidor (`apps/web/`), traz rota, dados e layout de produto, e entraria na API pública e no baseline sem ser reutilizável como pattern |
| Templates em `apps/example` | o exemplo é um consumidor; fora do Storybook o template perde `story:source`, docs e o teste de axe |

## Consequences

- **Gains:**
  - nenhum export, item de registry ou regra de fronteira nova;
  - templates passam por `storybook:test` com axe como as demais stories;
  - o template mostra a composição real dos patterns e expõe lacunas que viram pattern.
- **Costs:**
  - o consumidor copia o template à mão, sem atualização pelo CLI;
  - um template quebra quando a API de um pattern muda, e só o `storybook:typecheck` acusa.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| Nenhuma pasta de template em `packages/parttens/src` | static | `ls packages/parttens/src` sem `templates` |
| Nenhum item de template no registry | unit | `grep -n "template" packages/registry/src/manifest.ts` sem resultado |
| Todo template está sob `Templates/` | static | `grep -rn "title:" apps/storybook/src/templates` só com `Templates/` |
| Templates passam no axe e no typecheck | component | `bun run storybook:test` e `bun run storybook:typecheck` |

## Not verified

- nenhum template existe ainda; as invariantes valem a partir do primeiro.
