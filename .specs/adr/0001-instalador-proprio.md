# 0001. O CLI @tc96/parttens instala com código próprio, sem o shadcn

- **Status:** Accepted (dono, na conversa de 2026-10-11)
- **Date:** 2026-10-11
- **Origin:** none (decisão do dono na conversa de 2026-10-11, "caminho A")
- **Supersedes:** none (nenhum ADR anterior); substitui a decisão em `docs/architecture/tc96-parttens.md:259` e a linha da tabela em `docs/architecture/tc96-parttens.md:333`

## Context

| Força | Fonte |
| --- | --- |
| O shadcn só é chamado num ponto: `spawnSync` de `shadcn add <manifest>` | `packages/registry/src/cli.ts:153-159` |
| O tc96 já lê os aliases do `components.json` e resolve diretórios pelo tsconfig | `packages/registry/src/config.ts:19-106` |
| O tc96 já reescreve imports por AST e calcula destinos | `packages/registry/src/manifest.ts:138-202` |
| O tc96 já exclui componentes COSS instalados | `packages/registry/src/manifest.ts:227-243` |
| O tc96 já checa tipos antes e depois da instalação | `packages/registry/src/check-compatibility.ts` |
| O tc96 já gera o barrel | `packages/registry/src/barrel.ts` |
| O repositório já busca itens COSS e normaliza imports para `packages/ui` | `scripts/coss.ts:33-69`, `scripts/sync-coss.ts:19-30` |
| O que o shadcn fazia: gravar nos targets `~/...`, perguntar antes de sobrescrever, `--dry-run`/`--diff`/`--view`, instalar dependências npm, buscar `@coss/<item>` recursivamente, reescrever imports COSS, gravar `registries.@coss` | `docs/architecture/tc96-parttens.md:247-249` |
| Contornos documentados: pergunta antes de sobrescrever mesmo com `--yes`; sem terminal sai com status 0 sem gravar; `shadcn init --force` apaga as chaves `elements`/`helpers`/`patterns` | `docs/architecture/tc96-parttens.md:248-249` |
| `shadcn@4.21.0` traz `@babel/core`, `ts-morph`, `recast`, `postcss`, `@modelcontextprotocol/sdk`, `undici` e zod 3, entre outras | `bun.lock:1713` |
| O pacote publicado declara `shadcn` como dependência | `packages/registry/src/build-registry.ts:163` |
| O workspace declara `shadcn` em `packages/registry` e no `devDependencies` da raiz | `packages/registry/package.json:9`, `package.json:55` |
| O zod 3 do shadcn exigiu contorno na checagem de dependências pendentes | `packages/registry/src/check-compatibility.ts:30-33`, `packages/registry/src/check-compatibility.test.ts:120` |
| Princípio mantido: o tc96 não distribui UI; o consumidor é dono dos componentes COSS | `docs/architecture/tc96-parttens.md:177` |
| Temas e tokens pertencem ao consumidor | `AGENTS.md:70` |
| 5 dos 34 itens de `packages/ui/coss.lock.json` declaram tokens: `badge`, `button`, `field`, `menu` com `cssVars.light`/`cssVars.dark` (ex.: `destructive-foreground`; `badge` também `info`, `success`, `warning` e seus `-foreground`); `skeleton` com `cssVars.theme` (`--animate-skeleton`) e `css` (`@keyframes skeleton`) | medição de 2026-10-11, busca de cada item em `https://coss.com/ui/r/<item>.json` |
| Nenhum dos 34 itens declara `envVars`, `devDependencies` ou `tailwind` | mesma medição |
| O shadcn mesclava esses tokens e regras no CSS do consumidor | mesma medição |
| `scripts/sync-coss.ts` e `scripts/check-coss.ts` ignoram `cssVars`: o tipo do item não tem o campo | `scripts/coss.ts:21-26` |
| O tema de `packages/ui` vive em `apps/example` | `AGENTS.md:108-110` |
| Com a primeira implementação, o consumidor de teste fica em `.test-output/` dentro do repositório, e um pacote achado subindo até o `node_modules` do repositório contou como instalado | medição de 2026-10-11, `bun run test:consumer:registry` (`scripts/test-consumer-registry.ts`) |
| Resultado: só parte dos pacotes Plate entrou no consumidor, o `node_modules` dele ficou com uma segunda cópia de `@platejs/core`, e a checagem de tipos pós-instalação do `rich-text-editor` falhou com TS2345/TS2322 entre as duas cópias | mesma medição |
| O shadcn não tinha esse problema porque sempre instalava todas as dependências declaradas | mesma medição |

## Decision

Vamos gravar arquivos, buscar componentes COSS e instalar dependências npm com código próprio em `packages/registry/src`, e retirar o pacote `shadcn` das dependências do repositório e do pacote publicado.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| Configuração | `components.json` do consumidor, lido só como JSON; aliases `ui`/`utils` obrigatórios, `elements`/`helpers`/`patterns` opcionais como hoje (`packages/registry/src/config.ts:19-106`) |
| Origem do COSS | `registries['@coss']` quando for string (modelo com `{name}`, URL http(s) ou caminho local); padrão `https://coss.com/ui/r/{name}.json`; forma objeto (`url` + `headers`) recusada com erro |
| Itens COSS | resolução recursiva de `registryDependencies`, pulando os que têm `<ui>/<item>.tsx`; a instalação falha para item com mais de um arquivo, arquivo fora de `registry/default/ui/<item>.tsx`, `envVars`, `devDependencies` ou `tailwind` não vazios, `registryDependency` fora de `@coss/`, ou import `@/` restante após a normalização |
| Tokens e CSS do COSS | o CLI nunca edita o CSS do consumidor (`docs/architecture/tc96-parttens.md:177`, `AGENTS.md:70`); para cada item COSS instalado, lê o arquivo de `tailwind.css` do `components.json` e avisa os tokens e regras `css` cujo nome não aparece nele (`--<nome>:` para light/dark, a chave para theme, o seletor para css), com os valores agrupados em `:root`, `.dark`, `@theme` e regras css, prontos para copiar; sem `tailwind.css` ou com arquivo ilegível, lista todos; não falha a instalação |
| Detecção de tokens | textual, só nesse arquivo; token definido em arquivo importado aparece como ausente (falso positivo, só aviso) |
| Módulo COSS | um módulo único de busca e normalização, usado pelo CLI, por `scripts/sync-coss.ts` e por `scripts/check-coss.ts`; os scripts continuam ignorando `cssVars` (`scripts/coss.ts:21-26`), porque o tema de `packages/ui` vive em `apps/example` (`AGENTS.md:108-110`) |
| Checagem de tipos | os componentes COSS ausentes entram como arquivos virtuais na checagem anterior à instalação |
| Gravação | inexistente: cria; igual: mantém; diferente: preserva, e só sobrescreve com "sim" por arquivo em terminal interativo; sem terminal, com `--yes` ou `--preserve-existing`: preserva sem perguntar; sem sobrescrita global |
| Pré-visualização | `--dry-run` lista arquivos, componentes COSS e dependências; `--view` mostra conteúdo; `--diff` mostra diff de linhas dos arquivos existentes |
| Dependências npm | uma dependência conta como presente só quando o `package.json` raiz do consumidor a declara (`dependencies`, `devDependencies`, `peerDependencies` ou `optionalDependencies`) e a versão instalada é compatível (mesmo major; mesmo minor abaixo de 1.0) (`packages/registry/src/dependencies.ts:36`, `:56`); as demais são instaladas, no pior caso todas as declaradas, como o shadcn, nunca menos; instaladas num único comando, com o gerenciador detectado por `packageManager` ou lockfile (bun, pnpm, yarn, npm); pnpm com `pnpm-workspace.yaml` recebe `-w`; na falha, o erro mostra o comando para rodar à mão |
| `components.json` | o CLI não grava mais `registries.@coss` |
| Formato dos itens | `registry:file`, target `~/...` e `$schema` do shadcn mantidos por compatibilidade, sem serem requisito |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| Manter o shadcn como instalador (`docs/architecture/tc96-parttens.md:259`) | mantém os contornos de `docs/architecture/tc96-parttens.md:248-249` e o peso de `bun.lock:1713` no pacote publicado |
| Mesclar `cssVars` e `css` dos itens COSS no CSS do consumidor, como o shadcn | edita tema e tokens, que pertencem ao consumidor (`docs/architecture/tc96-parttens.md:177`, `AGENTS.md:70`) |
| Falhar a instalação para item COSS com `cssVars` ou `css` | bloquearia `badge`, `button`, `field`, `menu` e `skeleton`, 5 dos 34 itens travados (medição de 2026-10-11) |
| Caminho B: o CLI grava só os próprios arquivos e imprime `npx shadcn add @coss/...` e o comando de dependências npm | instalação em vários passos, e o shadcn continua no fluxo do consumidor |

## Consequences

- **Gains:**
  - o pacote publicado deixa de declarar `shadcn` (`packages/registry/src/build-registry.ts:163`) e a árvore de `bun.lock:1713`;
  - somem os contornos de `docs/architecture/tc96-parttens.md:248-249` e de `packages/registry/src/check-compatibility.ts:30-33`;
  - CLI e scripts de sincronização passam a usar o mesmo código de busca e normalização COSS.
- **Costs:**
  - o tc96 passa a acompanhar o formato do registry do COSS; a validação estrita transforma mudança de formato em erro;
  - o consumidor sem um dos tokens declarados passa a ver um aviso em vez de uma edição automática do CSS;
  - token definido num arquivo importado pelo `tailwind.css` gera aviso falso;
  - registries com autenticação por `headers` deixam de ser suportados;
  - código próprio de gravação, prompt, diff, detecção de gerenciador e instalação npm em `packages/registry/src`;
  - `scripts/test-consumer-registry.ts` continua dependendo de coss.com;
  - docs a atualizar: `apps/docs/content/docs/installation.mdx`, `docs/architecture/installation-contract.md`, `docs/architecture/tc96-parttens.md`;
  - removidas as fixtures sem uso da prova antiga com o shadcn, `packages/registry/fixtures/consumer-monorepo/` e `packages/registry/fixtures/items/`: nenhum teste as referenciava e elas guardavam caminhos absolutos de macOS;
  - custo de teste: as invariantes abaixo são estáticas ou unitárias, exceto uma de integração com rede.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| `shadcn` não aparece nas dependências do repositório nem do pacote publicado | static | `grep -n '"shadcn"' package.json packages/registry/package.json packages/registry/src/build-registry.ts bun.lock` sem resultado |
| Nenhum código do CLI chama o shadcn | static | `grep -rn "shadcn" packages/registry/src --include=*.ts` sem `require.resolve('shadcn')` nem `spawnSync` de `shadcn` |
| CLI, `scripts/sync-coss.ts` e `scripts/check-coss.ts` importam o mesmo módulo COSS | static | `grep -n "import" scripts/sync-coss.ts scripts/check-coss.ts` aponta o módulo em `packages/registry/src` |
| Política de gravação: 3 estados do arquivo × terminal interativo, sem terminal, `--yes`, `--preserve-existing`; arquivo diferente nunca é sobrescrito sem "sim" | unit | `bun test packages/registry/src` com a decisão de gravação como função pura |
| Item COSS com mais de um arquivo, arquivo fora de `registry/default/ui/<item>.tsx`, `envVars`/`devDependencies`/`tailwind` não vazios, `registryDependency` fora de `@coss/` ou import `@/` restante falha; forma objeto de `registries['@coss']` falha | unit | `bun test packages/registry/src` com itens de fixture |
| Item COSS com `cssVars`/`css` instala sem falhar e avisa só os nomes ausentes do `tailwind.css`, agrupados em `:root`, `.dark`, `@theme` e regras css; sem `tailwind.css` ou ilegível, avisa todos | unit | `bun test packages/registry/src` com fixtures de `badge` e `skeleton` e um CSS temporário |
| O CSS do consumidor sai byte a byte igual da instalação | unit | `bun test packages/registry/src`: hash do arquivo de `tailwind.css` antes e depois, num diretório temporário |
| Gerenciador detectado por `packageManager` e por lockfile; pnpm com `pnpm-workspace.yaml` recebe `-w`; dependência instalada num `node_modules` acima do consumidor, mas não declarada no `package.json` raiz dele, entra no comando; mesmo minor exigido abaixo de 1.0 | unit | `bun test packages/registry/src` com diretórios temporários |
| Componentes COSS ausentes entram como arquivos virtuais na checagem anterior | unit | `bun test packages/registry/src` sobre `check-compatibility` |
| Instalação real num consumidor grava patterns e COSS, instala dependências e não grava `registries.@coss` no `components.json` | integration | `bun run test:consumer:registry` (`package.json:34`); integração porque só ela exercita coss.com e o gerenciador npm reais; inclui a checagem de tipos pós-instalação do `rich-text-editor` sem segunda cópia de `@platejs/core` |

## Lacunas em aberto

| Pergunta | Decide | Fecha em |
| --- | --- | --- |
| Suportar a forma objeto de `registries['@coss']` (`headers`) no futuro? | dono | quando um consumidor pedir |
| A detecção de tokens deve seguir os `@import` do `tailwind.css` para reduzir o falso positivo? | dono | quando um consumidor relatar aviso falso |
| `test:consumer:registry` (`package.json:34`) entra no gate `bun run check` (`package.json:31`), hoje fora dele, sendo a única prova de integração e dependente de coss.com? | dono, com `qa-engineer` | no plano desta mudança em `.specs/` |
