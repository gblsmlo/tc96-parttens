# 0008. `packages/ui` passa a ser código do repositório, e o COSS vira só uma fonte de componentes novos

- **Status:** Draft (decisão do dono na conversa de 2026-11-01, "Approve ADR"; o texto espera a revisão dele)
- **Date:** 2026-11-01
- **Origin:** pedido do dono na conversa de 2026-11-01: não depender mais do COSS para criar os patterns, documentar todos os componentes de `ui` e começar a excluir tamanhos e variantes que os templates futuros não usarão
- **Supersedes:** none
- **Amends:** a regra "`packages/ui` é somente leitura" de `AGENTS.md` (Rules that are enforced by scripts); a busca de componentes COSS na instalação, decidida no [ADR 0001](0001-instalador-proprio.md); a premissa de snapshot imutável citada no [ADR 0003](0003-plain-coss-card.md)

## Context

| Força | Fonte |
| --- | --- |
| `check:coss` reprova qualquer arquivo de `packages/ui` que difira do hash gravado, e `sync:coss` reescreve edições | `scripts/check-coss.ts`, `scripts/sync-coss.ts` |
| Remover uma variante ou um tamanho é uma edição de `packages/ui`, então hoje é impossível | `packages/ui/src/button.tsx` (7 variantes, 10 tamanhos), `packages/ui/src/badge.tsx` (8 variantes) |
| O repositório já contorna o snapshot com uma exceção do dono (`SelectItem`, `ComboboxItem`) e com 33 exceções de `className` | `AGENTS.md`, `scripts/override-exceptions.json` |
| O CLI busca em `coss.com` os componentes que o consumidor não tem | `packages/registry/src/cli.ts:101`, `packages/registry/src/coss.ts` |
| O COSS publica 59 itens `registry:ui`; o lock cobre 55 itens e faltam `accordion`, `checkbox-group`, `drawer`, `fieldset`, `frame`, `otp-field`, `preview-card`, `slider`, `toast` e `fonts` | `https://coss.com/ui/r/registry.json` em 2026-11-01, `packages/ui/coss.lock.json` |
| O COSS também publica itens que não são componentes: `merge-props`, `use-render`, `csp-provider`, `direction-provider`, `font-sans`, `font-mono`, `font-heading`, `colors-neutral` | mesma fonte |
| Só 4 variantes e 3 tamanhos de `Button` aparecem como literal no código; o uso dinâmico não foi medido | busca por `<Button ... variant=` em `packages`, `apps/example` |
| Só `button` e `input` têm stories de tamanhos; a maioria dos componentes de `ui` não tem página `Doc` | `apps/storybook/src/ui` |

## Decision

Vamos tratar `packages/ui` como código do repositório: os arquivos podem ser editados, e o COSS deixa de ser consultado depois da primeira cópia de cada componente. `sync:coss` fica restrito a trazer itens novos e se recusa a sobrescrever um arquivo que já existe. O CLI instala `ui` a partir deste repositório, sem acessar `coss.com`.

| Aspecto | Desenho |
| --- | --- |
| Origem | `packages/ui/ui.manifest.json` substitui `coss.lock.json`: nome do item, `origin` (`coss` ou `own`) e caminhos, sem hash de conteúdo |
| `check:coss` | Passa a verificar só que todo arquivo de `packages/ui/src` está no manifesto e que todo item do manifesto existe; sem hash e sem `--remote` |
| `sync:coss <item>` | Copia o item e suas dependências que faltam; falha se algum arquivo de destino já existe |
| Instalação do consumidor | O registro publica os arquivos de `packages/ui` listados no manifesto; um componente fora do manifesto é erro, e `registries.@coss` deixa de ser lido |
| Podar variantes e tamanhos | Edição direta em `packages/ui`, precedida de uma varredura por AST que mede o uso em patterns, templates, stories e exemplo, incluindo props dinâmicas |
| Documentação | Cada componente de `ui` tem uma raiz `UI/<Nome>` com `Doc` via `DocsPage`; variantes e tamanhos ficam em stories aninhadas com `tags: ['!autodocs']` |
| Exceções de `className` | Uma exceção de `scripts/override-exceptions.json` cujo componente passa a ser editável é removida e a mudança vai para o próprio componente |

**Axis that decided it:** boundary

A fronteira que o ADR 0001 e o `AGENTS.md` traçam entre "COSS, intocado" e "tc96" cobra mais do que entrega: o dono já edita `ui` por exceção e não pode podar o que os templates não usam. O manifesto mantém a fronteira que ainda vale, a de saber quais arquivos de `ui` existem e de onde vieram.

## Alternatives

- **Manter `ui` somente leitura e mascarar as variantes em `elements`:** deixa o código morto instalado em todo consumidor e duplica cada componente podado.
- **Manter o hash e registrar cada divergência como exceção:** a lista de exceções já tem 33 entradas de `className`, e podar dezenas de variantes a faria crescer sem que o hash diga algo útil.
- **Continuar buscando em `coss.com` na instalação:** o consumidor receberia um componente com variantes que os patterns não cobrem, e o resultado mudaria a cada publicação do COSS.

## Consequences

- Atualizações do COSS não chegam mais sozinhas: trazer uma correção upstream de um componente existente é uma comparação manual.
- Podar uma variante ou um tamanho quebra o tipo para o consumidor que a usa; entra numa versão minor com nota de lançamento, como mudança de API pública.
- `scripts/check-coss.ts`, `scripts/sync-coss.ts`, `scripts/coss.ts`, `packages/registry/src/coss.ts` e seus testes mudam, e o nome do script `check:coss` pode ser trocado.
- `AGENTS.md` e `docs/architecture/tc96-parttens.md` (regra "somente leitura", exceção de `SelectItem` e `ComboboxItem`, nota sobre `sync:coss`) e `docs/architecture/installation-contract.md` são atualizados.
- Os 10 itens ausentes e os itens de fundação entram com `sync:coss` antes da primeira edição; fontes e estilo são avaliados um a um, porque o tema é do consumidor.

## Not verified

- Se alguma versão publicada de `@tc96/parttens` confia na busca em `coss.com` de um consumidor em produção.
- O uso dinâmico de variantes e tamanhos: a contagem de 2026-11-01 é uma busca textual, não uma varredura por AST.
- Se `fonts` e `colors-neutral` pertencem a `ui` ou ao tema do exemplo.
