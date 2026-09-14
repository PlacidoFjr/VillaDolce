import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  Inbox,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { downloadFeedbackStory } from "@/lib/feedbackArtwork";
import {
  getAdminFeedbacks,
  getFeedbackAdminSession,
  isFeedbackAdminConfigured,
  setFeedbackApproval,
  signInFeedbackAdmin,
  signOutFeedbackAdmin,
  type AdminFeedbackEntry,
  type FeedbackAdminSession,
} from "@/lib/feedbackStore";

type FeedbackAdminPageProps = {
  onNavigate: (path: string) => void;
};

type AdminFilter = "pending" | "published" | "all";

const adminFilters: Array<{ id: AdminFilter; label: string }> = [
  { id: "pending", label: "Pendentes" },
  { id: "published", label: "Publicados" },
  { id: "all", label: "Todos" },
];

export function FeedbackAdminPage({ onNavigate }: FeedbackAdminPageProps) {
  const [session, setSession] = useState<FeedbackAdminSession | null>(null);
  const [feedbacks, setFeedbacks] = useState<AdminFeedbackEntry[]>([]);
  const [filter, setFilter] = useState<AdminFilter>("pending");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visibleFeedbacks = useMemo(() => {
    if (filter === "pending") return feedbacks.filter((feedback) => !feedback.approved);
    if (filter === "published") return feedbacks.filter((feedback) => feedback.approved);
    return feedbacks;
  }, [feedbacks, filter]);

  const pendingCount = feedbacks.filter((feedback) => !feedback.approved).length;
  const publishedCount = feedbacks.length - pendingCount;

  async function loadFeedbacks() {
    try {
      setIsLoading(true);
      setError("");
      setFeedbacks(await getAdminFeedbacks());
    } catch (loadError) {
      setError((loadError as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void getFeedbackAdminSession().then((storedSession) => {
      setSession(storedSession);
      setIsCheckingSession(false);
      if (storedSession) void loadFeedbacks();
    });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      const nextSession = await signInFeedbackAdmin(email.trim(), password);
      setSession(nextSession);
      setPassword("");
      await loadFeedbacks();
    } catch (loginError) {
      await signOutFeedbackAdmin();
      setSession(null);
      setError((loginError as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await signOutFeedbackAdmin();
    setSession(null);
    setFeedbacks([]);
    setError("");
  }

  async function updateApproval(feedback: AdminFeedbackEntry, approved: boolean) {
    try {
      setUpdatingId(feedback.id);
      setError("");
      const updated = await setFeedbackApproval(feedback.id, approved);
      setFeedbacks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (updateError) {
      setError((updateError as Error).message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="feedback-page admin-page">
      <header className="feedback-header">
        <button className="feedback-brand" type="button" onClick={() => onNavigate("/")}>
          <img src="/assets/logo-villa-dolce.jpeg" alt="Villa Dolce Ateliê" />
          <span>
            <strong>Villa <em>Dolce</em></strong>
            <small>Administração</small>
          </span>
        </button>
        <button className="feedback-back" type="button" onClick={() => onNavigate("/feedbacks")}>
          <ArrowLeft aria-hidden="true" size={17} />
          <span>Ir para o mural</span>
        </button>
      </header>

      {isCheckingSession ? (
        <main className="admin-centered"><RefreshCw className="admin-spinner" aria-label="Verificando sessão" /></main>
      ) : !session ? (
        <main className="admin-login-shell">
          <section className="admin-login-copy">
            <p className="eyebrow">Área reservada</p>
            <h1>Curadoria do Mural de Carinho.</h1>
            <p>Aprove os depoimentos que irão ao mural e prepare as artes para publicar no Instagram.</p>
          </section>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <span className="admin-login-icon"><ShieldCheck aria-hidden="true" size={26} /></span>
            <h2>Entrar no painel</h2>
            <label>
              E-mail
              <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              Senha
              <input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            {!isFeedbackAdminConfigured && <p className="admin-error">A conexão com o Supabase ainda não foi configurada.</p>}
            <button className="button primary full" type="submit" disabled={isLoading || !isFeedbackAdminConfigured}>
              {isLoading ? "Entrando..." : "Entrar com segurança"}
            </button>
          </form>
        </main>
      ) : (
        <main className="admin-dashboard">
          <section className="admin-heading">
            <div>
              <p className="eyebrow">Moderação</p>
              <h1>Feedbacks recebidos</h1>
              <p>Revise cada mensagem antes de publicá-la no Mural de Carinho.</p>
            </div>
            <button className="button ghost" type="button" onClick={() => void handleLogout()}>
              <LogOut aria-hidden="true" size={17} /> Sair
            </button>
          </section>

          <section className="admin-summary" aria-label="Resumo dos feedbacks">
            <div><Inbox aria-hidden="true" size={20} /><span><strong>{pendingCount}</strong> pendentes</span></div>
            <div><Eye aria-hidden="true" size={20} /><span><strong>{publishedCount}</strong> publicados</span></div>
            <button type="button" aria-label="Atualizar feedbacks" title="Atualizar feedbacks" onClick={() => void loadFeedbacks()} disabled={isLoading}>
              <RefreshCw aria-hidden="true" size={18} />
            </button>
          </section>

          <div className="admin-filter" aria-label="Filtrar feedbacks">
            {adminFilters.map((item) => (
              <button key={item.id} type="button" className={filter === item.id ? "is-active" : ""} onClick={() => setFilter(item.id)}>
                {item.label}
              </button>
            ))}
          </div>

          {error && <p className="admin-error admin-error-banner" role="alert">{error}</p>}

          {isLoading && feedbacks.length === 0 ? (
            <div className="admin-empty"><RefreshCw className="admin-spinner" aria-hidden="true" /><p>Carregando feedbacks...</p></div>
          ) : visibleFeedbacks.length === 0 ? (
            <div className="admin-empty"><CheckCircle2 aria-hidden="true" size={30} /><h2>Nada por aqui agora.</h2><p>Não há feedbacks nesta categoria.</p></div>
          ) : (
            <section className="admin-feedback-list" aria-live="polite">
              {visibleFeedbacks.map((feedback) => (
                <article className="admin-feedback-card" key={feedback.id}>
                  <div className="admin-feedback-meta">
                    <span className={feedback.approved ? "is-published" : "is-pending"}>
                      {feedback.approved ? "Publicado" : "Aguardando revisão"}
                    </span>
                    <time dateTime={feedback.created_at}>{formatFeedbackDate(feedback.created_at)}</time>
                  </div>
                  <div className="admin-feedback-person">
                    <span className="feedback-avatar" aria-hidden="true">{feedback.name.trim().charAt(0).toUpperCase()}</span>
                    <div><strong>{feedback.name}</strong><small>{feedback.product}</small></div>
                  </div>
                  <div className="feedback-stars" aria-label={`${feedback.rating} de 5 estrelas`}>{"★".repeat(feedback.rating)}</div>
                  <blockquote>“{feedback.message}”</blockquote>
                  <div className="admin-feedback-actions">
                    {feedback.approved ? (
                      <button className="button ghost" type="button" disabled={updatingId === feedback.id} onClick={() => void updateApproval(feedback, false)}>
                        <EyeOff aria-hidden="true" size={17} /> Retirar do mural
                      </button>
                    ) : (
                      <button className="button primary" type="button" disabled={updatingId === feedback.id} onClick={() => void updateApproval(feedback, true)}>
                        <CheckCircle2 aria-hidden="true" size={17} /> Publicar no mural
                      </button>
                    )}
                    <button className="button secondary" type="button" onClick={() => void downloadFeedbackStory(feedback).catch((downloadError) => setError((downloadError as Error).message))}>
                      <Download aria-hidden="true" size={17} /> Salvar Story
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      )}
    </div>
  );
}

function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
