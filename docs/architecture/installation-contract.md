# Contrato de instalação

Prova real executada com shadcn 4.21.0: dois itens locais, com uma dependência compartilhada, instalaram três arquivos em `packages/patterns/src` e `packages/visual/src`. Os imports configurados foram preservados.

Aliases precisam de entradas exatas no tsconfig além dos wildcards. `registry:file` com target `~/packages/...` permite destinos explícitos no monorepo. A camada do produto gera manifests temporários com imports e destinos configurados e delega a escrita ao shadcn. Não existe mecanismo alternativo de cópia.

O shadcn decide sobrescrita com prompts sem `--overwrite`. O produto não passa essa flag automaticamente nem usa confirmação global para conflitos. A pré-verificação de exports e tipos tem resultado separado da equivalência visual.

O comando usa Node/npm. O registry acompanha o artefato do CLI para não exigir hospedagem durante a validação local. A origem pode ser um registry HTTP no consumo direto pelo shadcn.
