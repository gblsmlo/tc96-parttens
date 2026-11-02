# Contrato de instalação

O CLI grava os arquivos, busca os componentes COSS e instala as dependências npm com código próprio em `packages/registry/src`, decidido em 2026-10-11 no [ADR 0001](../../.specs/adr/0001-instalador-proprio.md). Até essa data a escrita era delegada ao shadcn 4.21.0; a prova daquela época instalou dois itens locais, com uma dependência compartilhada, em `packages/patterns/src` e `packages/visual/src`, preservando os imports configurados.

Aliases precisam de entradas exatas no tsconfig além dos wildcards. Cada arquivo tem um target `~/<caminho>`, relativo à raiz do consumidor e calculado a partir do diretório que o alias resolve. Um target que sai do workspace é recusado antes de qualquer escrita.

Arquivo que não existe é criado, arquivo igual é mantido e arquivo diferente é preservado. Só um terminal interativo pergunta, arquivo por arquivo, e `--yes` desliga a pergunta; não há confirmação global nem `--overwrite`. `--dry-run`, `--view` e `--diff` não gravam. A pré-verificação de exports e tipos tem resultado separado da equivalência visual.

Os componentes de `ui` que faltam vêm do próprio pacote, em `registry/ui/<item>.json`, gerado de `packages/ui` e do seu manifesto; o CLI não acessa `coss.com` nem lê `registries.@coss` (decidido no [ADR 0008](../../.specs/adr/0008-ui-owned-source.md), 2026-11-01). O CLI segue as `registryDependencies` (`@ui/<item>`), pula os componentes que o consumidor já tem e reescreve os imports para `ui` e `utils`. Um componente fora do manifesto reprova a instalação. Tokens de tema são listados, nunca gravados no CSS do consumidor. Um item fora do formato reprova a instalação.

O comando usa Node. As dependências npm que faltam são instaladas com o gerenciador detectado pelo `packageManager` ou pelo lockfile. O registry dos patterns acompanha o artefato do CLI para não exigir hospedagem.
