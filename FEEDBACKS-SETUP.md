# Mural de Carinho

A rota pública do mural é `/feedbacks`. Ela funciona em modo de demonstração sem configuração e salva os envios apenas no navegador atual.

## Ativar os feedbacks reais

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute o conteúdo de `supabase/feedbacks.sql`.
3. Copie `.env.example` para `.env.local` durante o desenvolvimento.
4. Preencha `VITE_SUPABASE_URL` com a URL pública do projeto (por exemplo, `https://SEU-PROJETO.supabase.co`) e `VITE_SUPABASE_ANON_KEY` com a chave pública/publishable. O site também aceita a Data API URL terminada em `/rest/v1`.
5. Cadastre essas mesmas variáveis no projeto da Vercel e faça um novo deploy.

Os novos feedbacks entram com `approved = false`. Para publicar um depoimento, abra a tabela `feedbacks` no Table Editor do Supabase, revise o conteúdo e altere `approved` para `true`.

## Ativar o painel administrativo

1. No SQL Editor do Supabase, execute `supabase/feedback-admin.sql`.
2. Acesse **Authentication > Users** e crie o usuário administrador com e-mail e senha.
3. Copie o **User UID** desse usuário.
4. Execute no SQL Editor, trocando o valor pelo UID copiado:

```sql
insert into public.feedback_admins (user_id)
values ('COLE-O-USER-UID-AQUI')
on conflict (user_id) do nothing;
```

Depois disso, acesse `/admin/feedbacks`. O painel permite aprovar ou retirar depoimentos do mural e baixar a arte de cada feedback em PNG para o Instagram. A sessão é encerrada ao fechar a aba do navegador.

O QR Code usado nas embalagens deve apontar para `https://SEU-DOMINIO/feedbacks`. Ele não é exibido dentro da página, pois será aplicado diretamente nos materiais da Villa Dolce.
