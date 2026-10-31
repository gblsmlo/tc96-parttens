# 0007. As camadas do consumidor ficam num único pacote `ui`

- **Status:** Draft
- **Date:** 2026-10-31
- **Origin:** auditoria da instalação no `lemind-mono` em 2026-10-31; o dono espera que um monorepo receba o tc96 num pacote `ui` (`ui/{components,elements,helpers,patterns,utils}`), e o `lemind-mono` recebeu cinco pacotes irmãos
- **Supersedes:** none (nenhum ADR anterior); altera as decisões de 2026-10-01 e 2026-10-05 em `docs/architecture/tc96-parttens.md` § Estrutura do consumidor
- **Amends:** none

## Context

| Força | Fonte |
| --- | --- |
| O README e a página de instalação prescreviam `packages/{ui,elements,helpers,patterns}` como pacotes irmãos | `README.md` § Consumer structure, `apps/docs/content/docs/installation.mdx` § Aliases (antes desta mudança) |
| O exemplo de alias usava `ui: @acme/ui`, nome de pacote sem subcaminho | mesmas fontes |
| `readAliases` troca o último segmento do `ui`: `@acme/ui` gera `@acme/patterns`, `@acme/ui/components` gera `@acme/ui/patterns` | `packages/registry/src/config.ts` |
| A sugestão de `paths` trocava o segmento `ui` do caminho, então mesmo `@acme/ui/components` sugeria `packages/patterns/src/components` | `packages/registry/src/config.ts` (antes desta mudança) |
| As dependências npm iam para o `package.json` da raiz | `packages/registry/src/dependencies.ts` (antes desta mudança) |
| O `lemind-mono` seguiu o README: `ui: @lemind/ui`, aliases irmãos, `paths` para `packages/<camada>/src/*` | `lemind-mono/components.json`, `lemind-mono/tsconfig.json` |
| O `lemind-mono` move à mão as dependências que o CLI grava na raiz | `lemind-mono/AGENTS.md:44` |
| O layout de monorepo do shadcn usa `ui: @workspace/ui/components` e `utils: @workspace/ui/lib/utils` | documentação de monorepo do shadcn |

## Decision

Vamos documentar como padrão um único pacote `ui` com `src/{components,elements,helpers,patterns,lib}`, aliases no layout do shadcn (`ui: @acme/ui/components`), sugerir `paths` ao lado do diretório do `ui` quando o alias nomeia esse diretório, e instalar as dependências npm no pacote do workspace que contém o diretório de `patterns`.

**Axis that decided it:** boundary

A derivação dos aliases não muda: com `ui: @acme/ui/components` ela já dá `@acme/ui/<camada>`, e quem declarou aliases irmãos, como o `lemind-mono`, continua instalando onde está.

## Alternatives

- **Derivar `@acme/ui/<camada>` também de `ui: @acme/ui`:** quebra quem depende da derivação irmã e, com `@acme/ui/*` apontando para `src/components/*`, poria as camadas dentro de `components/`.
- **Manter pacotes irmãos:** contraria a expectativa do dono e o layout do shadcn, e mantém as dependências fora do pacote que as usa.

## Consequences

- O consumidor precisa de `exports` no `package.json` do `ui` para cada camada (`./elements/*`, `./helpers/*`, `./patterns/*`).
- Um consumidor com pacotes irmãos passa a receber as dependências no pacote de `patterns`, não na raiz.
- `bun add --cwd`, `pnpm add --dir`, `npm install -w` e `yarn workspace <nome> add` são os comandos usados por gerenciador.

## Not verified

- `pnpm add --dir` e `yarn workspace` não foram executados nesta máquina; só os testes do comando gerado.
