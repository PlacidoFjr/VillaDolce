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

## Manter o projeto Supabase ativo

O deploy da Vercel registra um cron job que chama `/api/keepalive` diariamente às `03:17 UTC`. A função faz somente uma leitura mínima da tabela `feedbacks` (`select=id&limit=1`), gerando atividade real no banco sem modificar registros. Isso reduz o risco de pausa, mas não garante disponibilidade no plano gratuito do Supabase.

O cron usa as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` já configuradas na Vercel. Sem `CRON_SECRET`, o endpoint reconhece os agentes `vercel-cron/1.0` e `VillaDolce-HealthCheck/1.0`. Agentes identificam a origem declarada, mas podem ser imitados; a autenticação efetiva depende do segredo.

Como proteção adicional, é possível criar uma variável secreta `CRON_SECRET` na Vercel com pelo menos 16 caracteres. Quando ela existe, a função passa a exigir automaticamente o cabeçalho `Authorization` enviado pela própria Vercel.

Depois do deploy, o agendamento pode ser conferido em **Vercel > Project Settings > Cron Jobs**. Falhas de execução aparecem em **View Logs**.

### Verificação independente no GitHub

O workflow `.github/workflows/feedback-health.yml` verifica a conexão de produção a cada seis horas, às `00:43`, `06:43`, `12:43` e `18:43 UTC`. Também executa quando o monitor é alterado na `main` e permite execução manual em **GitHub > Actions > Feedback health check > Run workflow**.

Cada execução valida o JSON de saúde, faz novas tentativas em falhas transitórias e registra sucesso ou falha no GitHub Actions. O endpoint limita a consulta ao Supabase a dez segundos e registra origem, resultado e duração nos logs da Vercel, sem chaves ou dados dos clientes.

Se `CRON_SECRET` estiver configurado na Vercel, adicione o mesmo valor em **GitHub > Settings > Secrets and variables > Actions > New repository secret**, com o nome `CRON_SECRET`. Nunca coloque o valor no código ou na documentação.

Runners padrão do GitHub Actions são gratuitos em repositórios públicos. O GitHub pode atrasar execuções e desativa agendamentos de repositórios públicos após 60 dias sem atividade; nesse caso, reative o workflow na aba Actions. O cron da Vercel permanece como alternativa independente. Falhas ficam visíveis no histórico, e notificações dependem das preferências da conta no GitHub.

Nenhum monitor reativa automaticamente um projeto já pausado. Se isso acontecer, use **Resume project** no Supabase. A garantia de não pausar por inatividade requer plano pago, conforme a documentação do provedor.
