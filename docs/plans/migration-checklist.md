# Checklist de migração

- [x] Workspaces internos `ui`, `parttens`, `utils` e `registry`.
- [x] API agregada `tc96/parttens` e fachadas legadas `components`/`blocks`.
- [x] Filter Builder excluído do novo produto.
- [x] Grupos preparados pelo consumidor em List e CollectionViewOutlet.
- [x] Registry compatível com o schema do shadcn.
- [x] CLI fino `tc96-parttens add` delegando ao shadcn.
- [x] Preservação de arquivos existentes no fluxo automatizado.
- [x] Consumidor npm compilado e renderizado no servidor.
- [x] Storybook e docs configurados como apps.
- [ ] Nome npm definitivo confirmado no registry público.
- [ ] Metas de desempenho por view definidas com dados de consumidores reais.
- [ ] Teste completo de hidratação em TanStack Start/Next.js executado em seus respectivos consumidores.

Os três itens abertos são dependências externas ou decisões de release; não são inferidos pelo pacote.

## Patterns do Lemind

- [x] Checklist: fonte adaptada para `@tc96/ui`, export público, item de registry, story e testes de interação.
- [ ] Validar a instalação do checklist em um consumidor COSS externo e a hidratação em uma aplicação real.

O checklist original permanece em `lemind/packages/patterns/src/checklist.tsx`; a cópia do TC96 passa a evoluir neste repositório.
