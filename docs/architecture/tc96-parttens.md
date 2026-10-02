# Arquitetura do tc96-parttens

Status: as decisões de 2026-10-01 (UI base sem opinião, sem biblioteca npm) estão aplicadas no workspace. O CLI sai no npm como `@tc96/parttens`, na org `tc96`, a partir da 0.1.0.

## Objetivo e escopo

Reutilizar UI e padrões corrigidos entre projetos, sem incorporar regras de negócio. O TC96 anexado é a base; o Lemind é referência para melhorias. A primeira etapa reestrutura collection views e properties, mantendo também detail sheet e editable. Filter Builder está explicitamente fora desta versão, incluindo exports, registry, stories e documentação.

React 19, TypeScript, Tailwind CSS 4 e Base UI compõem a stack do consumidor. Bun é a ferramenta de desenvolvimento. Desktop e compatibilidade com SSR/hidratação estão no escopo; responsividade está fora. As collection views devem atender milhares de itens carregados, com virtualização onde necessária. Metas numéricas de desempenho ainda serão definidas por cenário.

Manutenção central, ausência de telemetria embutida e acessibilidade por teclado, foco e leitores de tela foram confirmadas como premissas.

## Organização e fronteiras

```text
apps/
  storybook/
  docs/
packages/
  ui/
  elements/
  parttens/
    src/
      collection-views/
        store/
        shared/
        types/
        views/
        composition/
      properties/
        store/
        shared/
        types/
        views/
        composition/
      detail-sheet/
      editable/
        store/
        shared/
        types/
        views/
        composition/
      index.ts
  utils/
  registry/
docs/
  architecture/
```

A landing será acrescentada quando houver escopo concreto. A grafia `parttens` acompanha o nome escolhido para o produto e o contrato público.

- `ui`: componentes COSS sem alterações, no papel da UI do consumidor.
- `elements`: componentes próprios do tc96 que não existem no COSS, como `Text`. Usam só os tokens do tema do consumidor.
- `parttens`: padrões, com componentes, hooks, tipos e testes próximos de cada padrão.
- `utils`: funções compartilhadas sem React ou dependências visuais.
- `registry`: manifestos, geração e ferramentas para instalação dos fontes.

## Estrutura interna dos patterns

`collection-views`, `properties` e `editable` organizam o código pelas responsabilidades de cada pattern. Em `collection-views`, `views/` identifica renderers de coleção; em `properties`, `display/` identifica padrões de apresentação. Os diretórios não representam páginas ou rotas de aplicação. Uma camada só recebe código quando há responsabilidade para ela.

`checklist/` foi acrescentado como primeiro pattern migrado do Lemind. Seu componente recebe itens e callbacks controlados pelo consumidor; criação, conclusão, edição, reordenação e exclusão não conhecem entidades nem persistência.

```text
<pattern>/
  store/         estado compartilhado e ações
  shared/        componentes e helpers usados por mais de um display
  types/         contratos compartilhados pelo pattern
  views/         renderers de coleção em collection-views
  display/       padrões de apresentação em properties
  composition/   composição de displays e componentes compartilhados
```

- `collection-views/views/` contém Calendar, Data Grid, Kanban e List. `store/` mantém o `CollectionProvider` e as preferências compartilhadas; `composition/` contém `CollectionViewOutlet`, que seleciona o renderer ativo; toolbar e paginação ficam em `shared/`.
- `properties/display/` contém os padrões de apresentação de propriedade, como Text, Date, Select e Person. `composition/` contém `AssignedProperty`, uma composição semântica de Person, e `PropertyCollection`; `shared/` reúne catálogo, superfícies e o shell comum de seleção única. Select e Person fornecem seu próprio conteúdo e suas opções ao shell. O diretório `store/` fica reservado, mas não há store global de properties: rascunhos de interação continuam locais a cada controle.
- `editable/composition/` contém o composto Editable e seus controles. `store/` abriga o contexto e o estado compartilhado entre as partes; helpers comuns ficam em `shared/`. A implementação atual usa React Context e hooks; a camada não obriga Zustand.
- `types/` nas três áreas expõe contratos organizados por pattern. Tipos específicos de um renderer ou display podem permanecer junto dele.

Cada área tem um barrel próprio. O CLI gera o barrel agregado no projeto do consumidor, só com os patterns instalados. O layout interno pode evoluir sem exigir que o consumidor importe caminhos privados.

O barrel agregado é o `index.ts` no diretório do alias de patterns. A fonte é o agregado do workspace, `packages/parttens/src/index.ts`, distribuído no registry como `aggregate.json`. O CLI mantém as diretivas e cada re-export cujo módulo está instalado, contando execuções anteriores, de modo que o apelido `Kanban` acompanha `collection-views`. Uma área compartilhada como `shared/` entra no item de cada pattern que usa algum arquivo dela, com o barrel da área; hoje só `collection-views` usa `shared/`. O arquivo gerado começa com um comentário que o identifica e é regravado a cada `add`; um `index.ts` escrito pelo consumidor é preservado com aviso. Por isso o agregado do workspace só pode conter diretivas e re-exports.

No Storybook, `Patterns/Collection Views/Overview` apresenta a mesma coleção em List, Kanban e Data Grid. As stories sob `Patterns/Collection Views/Views` documentam cada renderer isoladamente; `Shared Components` documenta toolbar e paginação. As stories de properties ficam em `Patterns/Properties/Display`; o agrupamento de properties fica em `Patterns/Properties/Groups`.

`parttens` depende de `ui`, `elements` e `utils`; `ui` e `elements` dependem de `utils`; `elements` não depende de `parttens`. Os três não dependem do registry. Dependências entre padrões são explícitas e não podem criar ciclos. Os fontes de UI têm uma implementação canônica, sem cópias mantidas por padrão.

Nomes internos: `@tc96/ui`, `@tc96/parttens`, `@tc96/utils` e `@tc96/registry`. São pacotes privados do workspace. O produto publica só o CLI, como `@tc96/parttens` (comando `tc96-parttens`), com o registry embutido; não há biblioteca npm. O nome npm coincide com o do pacote privado `packages/parttens`, que nunca é publicado. `ui` e `utils` existem para desenvolvimento, Storybook e testes, no papel de projeto consumidor (ver [UI base sem opinião](#ui-base-sem-opinião)).

## API e compatibilidade

No projeto consumidor, os imports usam os aliases do próprio projeto:

```tsx
import { CollectionViewOutlet, TextProperty } from '@acme/patterns'
import { Button } from '@acme/ui/button'
import { cn } from '@acme/ui/lib/utils'
```

A entrada agregada continua sendo a experiência escolhida, agora como barrel gerado pelo CLI no alias de patterns do consumidor. Os especificadores `tc96/parttens`, `tc96/ui`, `tc96/utils`, `tc96/components` e `tc96/blocks` deixam de existir. Preservar nomes e props dos patterns, com a exceção explícita do Filter Builder. Entradas antigas do registry devem mapear para os padrões correspondentes quando ainda estiverem no escopo.

`collection-views` identifica o conjunto. Preservar nomes como `KanbanView`, `ListView`, `CalendarView` e `DataGrid`. Não renomear componentes apenas por uniformidade.

A preservação de API vale para os patterns. A camada de UI segue a seção [UI base sem opinião](#ui-base-sem-opinião).

O nome npm só importa para o CLI. Decidido em 2026-10-01: `@tc96/parttens`, na org `tc96`, com o comando `tc96-parttens` (`npx @tc96/parttens add ...`). A 0.1.0 saiu antes como `tc96-parttens`, sem escopo, e foi despublicada. O repositório continua privado, e o pacote npm é público: o tarball leva o registry com o fonte dos patterns, sob MIT. Por isso o manifesto não aponta para o GitHub, e o README publicado para antes da seção sobre o repositório.

## UI base sem opinião

Decidido em 2026-10-01. O tc96 reutiliza patterns em projetos que já usam COSS, com a menor sobrescrita de estilo possível. A UI base não é opinativa e usa os componentes COSS sem alterações.

- O COSS vence a API própria. Os patterns usam a API do COSS. Saem `size` `sm | md | lg`, `variant: 'primary'`, `buttonSizes`, `inputSizes` e o `control-radius`. O `Text`, que não existe no COSS, migra para `packages/elements`. O `tc96/ui` público é removido, sem re-export.
- O consumidor é dono dos componentes COSS. Os patterns declaram `registryDependencies` do COSS como `@coss/<item>`; o CLI deixa de fora as que o projeto já tem, e o shadcn instala as que faltam. O tc96 não distribui UI. Ver [Dependências do COSS](#dependências-do-coss).
- O `cn` também é do consumidor. Os imports de `@tc96/utils` são reescritos para o `aliases.utils` do `components.json` do consumidor, e o arquivo não é distribuído.
- Os patterns não redefinem tema. Tokens, `:root`, `.dark` e utilitários próprios pertencem ao consumidor.

`packages/ui` continua no workspace, privado, como a UI que um consumidor COSS teria. Ele é gerado por `bun run sync:coss`, que grava cada item do registry do COSS como publicado e só troca os aliases de import (`@/registry/default/...`) pelos do workspace, como o `shadcn add` faria. Nunca é editado à mão. O lock `packages/ui/coss.lock.json` registra, por item, a URL `coss.com/ui/r/<item>.json`, o hash do conteúdo publicado e o hash do arquivo gravado. O `check:coss` compara cada arquivo com o lock, e o `check:coss --remote` compara com o registry. O diretório fica fora do Biome. Os patterns só importam `@tc96/ui/<item>` presente no lock.

Situação em 2026-10-01: os 27 itens de `packages/ui/src` são o COSS sem alterações. Antes, 8 deles divergiam (button, input, input-group, group, calendar, combobox, sheet e textarea) e havia cópias em `compat/`. O COSS fixa `@base-ui/react` 1.8.0 e usa `@daypicker/react` no calendar, e o workspace acompanha essas versões. Os quatro `styles/global.css` dos patterns não são importados.

Sem biblioteca npm, decidido em 2026-10-01. Um pacote compilado não consegue importar o COSS do consumidor sem embutir uma cópia própria ou depender de um caminho que não resolve. Por isso o tc96 é distribuído só como fontes. A atualização passa a ser `tc96-parttens add --diff` com incorporação manual. Reabrir esta decisão só se surgir como requisito um consumidor sem COSS. O build da biblioteca foi removido; o `verify-public-api` confere os barrels dos patterns e o agregado `packages/parttens/src/index.ts` contra `public-api-exports.json`, e o `pack:check` confere só o CLI.

Locale do calendar, resolvido no planejamento: o calendar do COSS fala inglês por padrão, como o rótulo dos patterns (`en-US`). Outro idioma entra por `calendarProps.locale`.

Faixa de datas do calendar, decidida em 2026-10-01: o intervalo selecionado usa o desenho do calendar do COSS sem alterações, com o miolo reto em `bg-accent` e as pontas arredondadas por fora. O degradê com pontas `rounded-full` do fork antigo não volta.

### Regra de sobrescrita

Decidida em 2026-10-01. Sobre um componente COSS com estilo, um pattern só passa classes de:

- layout e dimensão (`flex`, `gap-*`, `w-*`, `h-*`, `p-*`, posição);
- tipografia (`text-sm`, `font-medium`, `truncate`);
- neutralização: zerar o que o componente traz, com `transparent`, `none` ou `0` (`bg-transparent`, `shadow-none`, `border-0`, `rounded-none`), inclusive com `!` quando uma variante de estado do COSS ganharia;
- mostrar e esconder (`opacity-0` e `opacity-100`);
- o formato do `Skeleton`, que é o desenho do que ele substitui.

Cor, raio, borda e sombra novos ficam com o tema do consumidor. Quando o pattern precisa de outra aparência, usa uma variante ou um tamanho do COSS: o valor de uma propriedade é o `Badge` `secondary` e a ausência o `outline`; o botão de adicionar card é o `Button` `outline`. Aplicar o estilo de outro componente COSS (`badgeVariants` num `Button`) também é sobrescrita; o caminho é o próprio componente com `render`, como o `Badge` com `render={<button />}`.

Partes do COSS sem estilo (os primitivos do base-ui, `MenuTrigger`, `MenuRadioGroup`, `ComboboxTrigger`) não têm o que sobrescrever: estilizá-las é como estilizar um elemento do próprio pattern. O mesmo vale para o markup próprio, que usa os tokens do tema.

O `bun run overrides:check` (`scripts/check-overrides.ts`) aplica a regra e roda no `bun run check`. Ele lê o fonte de `packages/ui` para saber quais exports têm estilo e segue as constantes de classe locais e importadas. Exceção só em `scripts/override-exceptions.json`, com o motivo; o check também reprova exceção sem motivo ou sem uso. Hoje não há nenhuma.

## Comportamento e dados

A aplicação fornece os dados preparados e executa filtros, ordenação, paginação, agrupamento, persistência e mutações. Os padrões renderizam e emitem eventos. Estado visual transitório pode permanecer local. Permissões, API, vocabulário de produto e regras de domínio pertencem ao consumidor.

Exceção de compatibilidade aceita: preservar o agrupamento interno atual e acrescentar uma entrada para grupos preparados pelo consumidor. Quando esta entrada estiver presente, não executar a projeção interna. Os dois contratos compartilham a renderização. Inventariar outros comportamentos locais da API atual antes de propor mudanças incompatíveis.

## Distribuição e instalação

Há um modo só: instalação editável dos fontes.

### Estrutura do consumidor

Decidido em 2026-10-01. O consumidor monta um design system em camadas, no espírito do atomic design. O `components.json` fica na raiz do monorepo e é a única configuração; o `tc96.json` deixa de existir.

```text
components.json        aliases: ui, utils, elements, patterns
packages/
  ui/                  átomos: componentes COSS (aliases.ui)
  elements/            componentes próprios fora do COSS, como Text (aliases.elements)
  patterns/            organismos: patterns do tc96 (aliases.patterns)
apps/
  web/                 templates e páginas da aplicação
```

- `ui` e `utils` vêm dos aliases que o shadcn já define. O shadcn instala ali os componentes COSS.
- `elements` e `patterns` são aliases acrescentados ao mesmo objeto `aliases`. O shadcn 4.21 valida `aliases` com um `z.object` não estrito, que aceita e ignora chaves desconhecidas; o objeto de topo é estrito, por isso as chaves novas ficam dentro de `aliases`. O CLI do tc96 lê o arquivo bruto para obter esses dois aliases.
- Imports só descem de camada: `patterns` importa `elements`, `ui` e `utils`; `elements` importa `ui` e `utils`; `ui` não importa nenhuma das outras.
- Cada alias precisa de entrada exata e de wildcard nos `paths` do `tsconfig` da raiz, conforme o [contrato de instalação](installation-contract.md).

Situação em 2026-10-01: o CLI lê os quatro aliases do `components.json` e reprova, com a lista das chaves que faltam, quando algum está ausente. O destino de `elements` e `patterns` é o diretório que o wildcard de cada alias resolve no `tsconfig`. O build do registry não segue os imports de `@tc96/ui` e `@tc96/utils`, e o `assertDistributable` reprova qualquer item com arquivo de `ui/` ou `utils/` ou com `:root`, `.dark`, `@theme` ou `@utility`. Cada `@tc96/ui/<item>` importado vira `@coss/<item>` nas `registryDependencies` do item; o CLI também resolve o diretório do alias `ui` para saber quais o consumidor já tem.

### Dependências do COSS

Decidido em 2026-10-01, depois de medir o shadcn 4.21 no consumidor de exemplo, com os componentes COSS instalados e o `button.tsx` personalizado. Eram as decisões adiadas até o primeiro consumidor.

- **Forma:** `@coss/<item>`, a mesma que o próprio COSS usa entre os seus itens. Sem configuração, o shadcn resolve `@coss` pelo índice público e grava `registries.@coss` no `components.json`, mantendo `elements` e `patterns`. Um endereço que o consumidor configure para `@coss` é respeitado; a URL completa o ignoraria.
- **Reaproveitamento:** o CLI deixa de fora as dependências cujo `<ui>/<item>.tsx` já existe antes de chamar o shadcn. Medido: o shadcn pula arquivo igual, e não sobrescreve variável de tema que o consumidor alterou, mas pergunta antes de sobrescrever um componente personalizado, mesmo com `--yes`. Responder sim apaga a personalização; sem terminal, ele para na pergunta e sai com status 0 sem gravar os arquivos. A pergunta ainda pode aparecer quando um componente que falta depende de outro personalizado, como ao rodar `shadcn add @coss/<item>`. Um componente instalado numa versão antiga do COSS aparece na verificação de tipos depois da instalação.
- **Persistência dos aliases:** `shadcn add` mantém `elements` e `patterns`. `shadcn init --force` regrava o `components.json` do zero, sem essas chaves e com outro alias `ui`. O CLI avisa sem reaplicar: a mensagem lista as chaves que faltam e cita o `init --force`. Não há outra fonte para reaplicar os valores, e o `ui` alterado precisa de revisão do consumidor. `shadcn apply` não foi medido.

Contrato proposto do comando:

```sh
npx @tc96/parttens add collection-views properties
```

O CLI aceita vários padrões, resolve dependências compartilhadas uma vez e ajusta imports para os pacotes do consumidor. Os imports `@tc96/ui`, `@tc96/utils`, `@tc96/elements` e `@tc96/parttens` são reescritos para `aliases.ui`, `aliases.utils`, `aliases.elements` e `aliases.patterns` do consumidor. Exemplo: `@tc96/ui/button` se torna `@lemind/ui/button`.

Decisão confirmada: utilizar o instalador do shadcn. `tc96-parttens` será uma camada fina de configuração, seleção e verificações; não terá um segundo mecanismo de cópia e resolução de dependências. O registry será compatível com o schema do shadcn. Validar destinos em monorepo e aliases personalizados antes de finalizar esse adaptador. Bun não será exigido para executar o CLI via npm.

Preservar arquivos existentes por padrão; perguntar antes de sobrescrever. A primeira versão oferece comparação e orientação para incorporar correções manualmente, sem atualização ou mesclagem automática.

Proposta de verificação: conferir exports e compatibilidade dos contratos TypeScript, reportando limitações. Essa verificação não garante equivalência visual ou comportamental. Não anunciar compatibilidade completa somente com base no nome ou na existência de um arquivo.

## Acessibilidade dos patterns

Decidido em 2026-10-01, na triagem das violações do axe.

- **Arraste:** o dnd-kit transforma o ativador do arraste em botão, e um botão esconde o que contém da tecnologia assistiva. Por isso o ativador do card do kanban e do item do calendar é uma alça dedicada, um botão com ícone de grip ao lado do conteúdo, que aparece no hover e no foco. É ela que recebe o teclado e a tecnologia assistiva. O card continua um contêiner comum, com as ações acessíveis. No kanban, o ponteiro e o toque também pegam o card inteiro, exceto botões, campos e itens de menu dentro dele; o botão que abre o card só arrasta depois da distância mínima. Sem arraste, o calendar não tem alça.
- **Troca de coluna no kanban:** o React é o único dono do nó do card entre colunas. Na mesma coluna, o plugin de ordenação otimista do dnd-kit reordena o DOM sem render. Entre colunas o plugin é impedido e a troca passa pelo estado, porque um nó movido por fora do React quebrava a remoção (`removeChild`). O conteúdo do card fica memoizado: trocar de coluna só re-renderiza o invólucro dos cards cujo índice mudou, e o `renderCard` do consumidor roda só para o card movido.
- **Seletor de views:** `SelectedViewMenu` é um popover (`role="dialog"`), não um menu, porque reúne um campo de busca e, em cada view, um botão de opções, e um `role="menu"` não pode conter nenhum dos dois. Nomes e props continuam os mesmos, mas os filhos deixam de ser itens de menu: rótulo de grupo, separador e estado vazio são elementos comuns, como o `Separator` do COSS. Entre as views o teclado usa Tab, e as opções de cada view ficam num menu próprio. Escolher uma view, criar outra ou usar uma opção fecha o popover.
- **Popups e listas** dos patterns têm nome acessível, e mensagens de erro usam `text-destructive-foreground`, como o `Field` do COSS.

## Validação proposta

- Fronteiras: impedir imports em direção proibida, ciclos e UI duplicada por padrão. `packages/parttens` só importa `@tc96/ui/<item>` presente no lock COSS.
- UI: todo arquivo de `packages/ui/src` é igual ao snapshot COSS fixado. Um job separado procura versão nova no upstream.
- Registry: nenhum item distribui arquivo de UI, nem `:root`, `.dark`, `@theme` ou `@utility`. Todo `@tc96/ui/<item>` usado aparece em `registryDependencies`.
- Consumidor: num projeto COSS com alias e caminho fora do padrão e um botão marcado, instalar `collection-views properties`. O `tsc --noEmit` passa, a renderização contém o marcador e nenhum arquivo é escrito no caminho de UI. Implementado em `apps/example`, um consumidor com aliases `@acme/*` e patterns em `packages/organisms/src`. O `test:consumer:registry` instala todos os patterns e o `test:consumer:ssr` renderiza `collection-views` e `properties` no servidor; os dois copiam o exemplo para `.test-output`, instalam nele o COSS do lock com um marcador no `button.tsx` e reprovam se o CLI escrever em `packages/ui` ou deixar import `@tc96/*`.
- Registry/CLI: instalar padrões isolados e em conjunto com aliases personalizados; verificar dependências, conflitos e preservação de arquivos.
- Storybook: cobrir interação, teclado, foco, edição e arraste. Docs e Storybook consomem os pacotes do workspace. O framework é `@storybook/react-vite`, porque nenhuma story depende do `@tanstack/react-router`. O `bun run check` roda também o typecheck e o lint do Storybook.
- Acessibilidade: o addon de a11y roda o axe em cada story com `test: 'error'`, e uma violação reprova o `storybook:test`. Exceção só na própria story, com o motivo. Hoje são quatro, todas de contraste vindo do COSS sem alterações: os dias da semana e os dias fora do mês do calendar (3,14:1), nas stories `Trigger` e `CalendarLocale` do `DateRangeProperty`, o variant `destructive` do botão (3,8:1) e o exemplo de força de senha do COSS (3,65:1). Ver [Acessibilidade dos patterns](#acessibilidade-dos-patterns).
- SSR: validar renderização e hidratação num consumidor real com SSR, preservando fronteiras de componentes cliente. SSR não implica executar interações no servidor.
- Desempenho: medir cenários com milhares de itens por view, incluindo scroll, seleção e arraste; verificar virtualização sem fixar limites numéricos não acordados.

## Registro de decisões

| Decisão | Alternativa | Motivo |
| --- | --- | --- |
| Monorepo com pacotes internos por responsabilidade | Uma pasta pública única ou releases independentes | Apps e fronteiras claras sem multiplicar versões da biblioteca |
| API agregada como barrel gerado pelo CLI no alias do consumidor; antes `tc96/parttens`, substituída em 2026-10-01 | Imports públicos obrigatórios por padrão | Preferência do consumidor |
| Só fontes, sem biblioteca npm; antes "Fontes locais e biblioteca versionada", substituída em 2026-10-01 | Biblioteca com cópia COSS embutida, ou alias/peer fixo | Pacote compilado não importa o COSS do consumidor sem cópia paralela ou caminho que não resolve |
| Preservar API atual dos patterns; substituída para a UI em 2026-10-01 | Redesenhar todos os contratos | Evitar quebra para consumidores existentes |
| UI base é COSS sem alterações, com API COSS; `tc96/ui` removido | Manter a API própria de `tc96/ui` | Reutilizar patterns sobre o COSS do consumidor com a menor sobrescrita |
| Componentes COSS de posse do consumidor via `registryDependencies` | tc96 mantém cópia vendorizada | O tema e as personalizações do consumidor valem sem cópia paralela |
| `registryDependencies` como `@coss/<item>` | URL completa do item COSS | Mesma forma que o COSS usa; respeita o endereço de `@coss` configurado pelo consumidor |
| CLI deixa de fora os componentes COSS já instalados | Passar tudo e deixar o shadcn decidir | O shadcn pergunta antes de sobrescrever componente personalizado, mesmo com `--yes`, e para sem terminal |
| Avisar quando `elements` ou `patterns` somem do `components.json`, sem reaplicar | Guardar uma cópia dos aliases | Uma configuração só; o `init --force` também troca o `ui`, que o consumidor precisa revisar |
| `Text` e outros componentes fora do COSS em `packages/elements`, distribuídos pelo registry com destino configurável | Manter em `packages/ui` | `packages/ui` só contém COSS sem alterações |
| `components.json` na raiz como única configuração, com `aliases.elements` e `aliases.patterns`; `tc96.json` removido | Manter `tc96.json` para os destinos do tc96 | Uma configuração só, numa estrutura em camadas no consumidor |
| `cn` resolvido pelo `aliases.utils` do consumidor | Distribuir `@tc96/utils` | O COSS já instala `cn` no consumidor |
| Grupos preparados com agrupamento antigo preservado | Remover projeção interna | Separar operações novas sem quebrar comportamento atual |
| UI compartilhada e destino configurável | UI duplicada por padrão | Reaproveitar a base e as personalizações do consumidor |
| Correções locais manuais | Mesclagem automática | Escopo definido para a primeira versão |
| Instalador do shadcn com camada fina do produto | Instalador próprio | Reutilizar o mecanismo adotado pelo COSS |
| Sem Filter Builder nem responsividade | Todo o catálogo e mobile | Exclusões explícitas do usuário |

## Pontos ainda em revisão

- Aprovação da estratégia de validação e do limite da verificação de compatibilidade.
- Configuração e integração do CLI com shadcn, preservando o comando desejado e validando destinos em monorepo.
- Metas mensuráveis por view e matriz inicial de ambientes SSR/navegadores.
- Execução da migração conforme o [plano em revisão](../plans/2026-09-29-reestruturacao-tc96-parttens.md).
