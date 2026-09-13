# Mural de Carinho

A rota pública do mural é `/feedbacks`. Ela funciona em modo de demonstração sem configuração e salva os envios apenas no navegador atual.

## Ativar os feedbacks reais

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute o conteúdo de `supabase/feedbacks.sql`.
3. Copie `.env.example` para `.env.local` durante o desenvolvimento.
4. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os dados públicos do projeto.
5. Cadastre essas mesmas variáveis no projeto da Vercel e faça um novo deploy.

Os novos feedbacks entram com `approved = false`. Para publicar um depoimento, abra a tabela `feedbacks` no Table Editor do Supabase, revise o conteúdo e altere `approved` para `true`.

O QR Code é gerado automaticamente com o domínio atual. Portanto, no site publicado ele apontará para a URL pública da própria Vercel ou para o domínio personalizado.
