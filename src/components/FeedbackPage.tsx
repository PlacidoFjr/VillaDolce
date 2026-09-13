import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Download, Heart, MessageCircleHeart, QrCode, Share2, Star, X } from "lucide-react";
import { catalogItems } from "@/data/catalog";
import { downloadFeedbackStory } from "@/lib/feedbackArtwork";
import {
  createFeedback,
  getApprovedFeedbacks,
  isFeedbackDemoMode,
  type FeedbackEntry,
} from "@/lib/feedbackStore";

type FeedbackPageProps = {
  onNavigate: (path: string) => void;
};

const emptyForm = {
  name: "",
  product: "",
  rating: 0,
  message: "",
  consent: false,
  website: "",
};

export function FeedbackPage({ onNavigate }: FeedbackPageProps) {
  const [activeView, setActiveView] = useState<"form" | "wall">("form");
  const [form, setForm] = useState(emptyForm);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [loadError, setLoadError] = useState(false);
  const [shareNotice, setShareNotice] = useState("");

  const products = useMemo(
    () => [...new Set(catalogItems.map((item) => item.title))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [],
  );
  const feedbackUrl = typeof window === "undefined" ? "" : `${window.location.origin}/feedbacks`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=20&color=3b2114&bgcolor=fffaf3&data=${encodeURIComponent(feedbackUrl)}`;

  async function loadFeedbacks() {
    try {
      setLoadError(false);
      setFeedbacks(await getApprovedFeedbacks());
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    void loadFeedbacks();
  }, []);

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website || form.rating === 0 || !form.consent) return;

    try {
      setStatus("sending");
      const created = await createFeedback({
        name: form.name.trim(),
        product: form.product,
        rating: form.rating,
        message: form.message.trim(),
        consent: form.consent,
      });

      if (created) setFeedbacks((current) => [created, ...current]);
      setForm(emptyForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  async function shareFeedback(feedback: FeedbackEntry) {
    const text = `“${feedback.message}” — ${feedback.name}, sobre ${feedback.product}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mural de Carinho | Villa Dolce", text, url: feedbackUrl });
      } else {
        await navigator.clipboard.writeText(`${text}\n${feedbackUrl}`);
        setShareNotice("Texto copiado para compartilhar.");
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") setShareNotice("Não foi possível compartilhar agora.");
    }
  }

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <button className="feedback-brand" type="button" onClick={() => onNavigate("/")}>
          <img src="/assets/logo-villa-dolce.jpeg" alt="Villa Dolce Ateliê" />
          <span>
            <strong>Villa <em>Dolce</em></strong>
            <small>Ateliê</small>
          </span>
        </button>
        <button className="feedback-back" type="button" onClick={() => onNavigate("/")}>
          <ArrowLeft aria-hidden="true" size={17} />
          Voltar ao site
        </button>
      </header>

      <main className="feedback-main">
        <section className="feedback-intro">
          <p className="eyebrow">Mural de Carinho</p>
          <h1>Seu carinho também faz parte da nossa história.</h1>
          <p>Conte como foi receber uma criação Villa Dolce e ajude outras pessoas a escolherem um presente cheio de afeto.</p>
          <div className="feedback-tabs" role="tablist" aria-label="Navegação do mural">
            <button
              type="button"
              role="tab"
              aria-selected={activeView === "form"}
              className={activeView === "form" ? "is-active" : ""}
              onClick={() => setActiveView("form")}
            >
              <MessageCircleHeart aria-hidden="true" size={18} />
              Deixar feedback
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === "wall"}
              className={activeView === "wall" ? "is-active" : ""}
              onClick={() => setActiveView("wall")}
            >
              <Heart aria-hidden="true" size={18} />
              Ver mural
            </button>
          </div>
        </section>

        {activeView === "form" ? (
          <section className="feedback-form-section" aria-label="Enviar feedback">
            <div className="feedback-form-copy">
              <p className="eyebrow">Sua experiência</p>
              <h2>Como foi o seu momento Villa Dolce?</h2>
              <p>Leva menos de dois minutos. Seu depoimento será publicado somente depois de uma revisão cuidadosa.</p>
              <div className="feedback-promise">
                <Check aria-hidden="true" size={18} />
                <span>Seu sobrenome não é necessário e seus dados não serão usados para publicidade.</span>
              </div>
            </div>

            {status === "success" ? (
              <div className="feedback-success" role="status">
                <span><Heart aria-hidden="true" size={30} /></span>
                <p className="eyebrow">Recebido com carinho</p>
                <h2>Obrigada por compartilhar esse momento.</h2>
                <p>
                  {isFeedbackDemoMode
                    ? "Seu feedback já está disponível no mural desta demonstração."
                    : "Seu feedback será publicado no mural depois da aprovação da Villa Dolce."}
                </p>
                <div className="feedback-success-actions">
                  <button className="button primary" type="button" onClick={() => setActiveView("wall")}>Ver o mural</button>
                  <button className="button ghost" type="button" onClick={() => setStatus("idle")}>Enviar outro</button>
                </div>
              </div>
            ) : (
              <form className="feedback-form" onSubmit={submitFeedback}>
                <label>
                  Como podemos chamar você?
                  <input
                    required
                    maxLength={50}
                    value={form.name}
                    placeholder="Seu primeiro nome"
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                </label>

                <label>
                  Qual foi a sua escolha?
                  <select
                    required
                    value={form.product}
                    onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((product) => <option key={product}>{product}</option>)}
                    <option>Outro pedido personalizado</option>
                  </select>
                </label>

                <fieldset className="rating-field">
                  <legend>Como você avalia sua experiência?</legend>
                  <div className="rating-buttons" aria-label={`${form.rating || 0} de 5 estrelas`}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        aria-label={`${rating} ${rating === 1 ? "estrela" : "estrelas"}`}
                        className={rating <= form.rating ? "is-active" : ""}
                        onClick={() => setForm((current) => ({ ...current, rating }))}
                      >
                        <Star aria-hidden="true" size={29} />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label>
                  Conte como foi
                  <textarea
                    required
                    minLength={20}
                    maxLength={400}
                    rows={6}
                    value={form.message}
                    placeholder="O que você mais gostou no pedido, na apresentação ou no atendimento?"
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  />
                  <small>{form.message.length}/400</small>
                </label>

                <label className="feedback-consent">
                  <input
                    required
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>Autorizo a publicação deste feedback no Mural de Carinho da Villa Dolce.</span>
                </label>

                <label className="feedback-honeypot" aria-hidden="true">
                  Não preencher
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} />
                </label>

                {form.rating === 0 && <p className="feedback-form-hint">Selecione de 1 a 5 estrelas para enviar.</p>}
                {status === "error" && <p className="feedback-error" role="alert">Não foi possível enviar agora. Tente novamente em instantes.</p>}
                <button className="button primary full" type="submit" disabled={status === "sending" || form.rating === 0}>
                  {status === "sending" ? "Enviando..." : "Enviar meu carinho"}
                </button>
              </form>
            )}
          </section>
        ) : (
          <section className="feedback-wall-section" aria-label="Mural de feedbacks">
            <div className="feedback-wall-heading">
              <div>
                <p className="eyebrow">Histórias compartilhadas</p>
                <h2>Carinho que chegou e ficou.</h2>
              </div>
              <button className="button secondary" type="button" onClick={() => setActiveView("form")}>Deixar meu feedback</button>
            </div>

            {loadError ? (
              <div className="feedback-empty"><p>Não foi possível carregar o mural agora. Tente novamente mais tarde.</p></div>
            ) : feedbacks.length === 0 ? (
              <div className="feedback-empty">
                <Heart aria-hidden="true" size={30} />
                <h3>Este mural está esperando a primeira história.</h3>
                <p>Depois da aprovação, os feedbacks enviados aparecem aqui.</p>
                <button className="button primary" type="button" onClick={() => setActiveView("form")}>Escrever o primeiro</button>
              </div>
            ) : (
              <div className="feedback-wall-grid">
                {feedbacks.map((feedback) => (
                  <article className="feedback-card" key={feedback.id}>
                    <div className="feedback-card-top">
                      <span className="feedback-avatar" aria-hidden="true">{feedback.name.trim().charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{feedback.name}</strong>
                        <small>{feedback.product}</small>
                      </div>
                    </div>
                    <div className="feedback-stars" aria-label={`${feedback.rating} de 5 estrelas`}>{"★".repeat(feedback.rating)}</div>
                    <blockquote>“{feedback.message}”</blockquote>
                    <div className="feedback-card-actions">
                      <button type="button" onClick={() => setSelectedFeedback(feedback)}><Share2 aria-hidden="true" size={16} /> Criar arte</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="feedback-qr-section">
          <div className="feedback-qr-copy">
            <QrCode aria-hidden="true" size={26} />
            <p className="eyebrow">Compartilhe o carinho</p>
            <h2>Um convite delicado em cada pedido.</h2>
            <p>Use este QR Code nos cartões, etiquetas e embalagens para levar cada cliente diretamente ao formulário.</p>
            <a className="button secondary" href={qrImageUrl} target="_blank" rel="noopener noreferrer">Abrir QR Code</a>
          </div>
          <div className="feedback-qr-card">
            <img src={qrImageUrl} alt={`QR Code para ${feedbackUrl}`} />
            <strong>Conte como foi sua experiência</strong>
            <span>Escaneie e deixe seu carinho.</span>
          </div>
        </section>
      </main>

      <footer className="feedback-footer">
        <strong>Villa <em>Dolce</em> Ateliê</strong>
        <span>Vera Cruz e Salvador, BA</span>
      </footer>

      {isFeedbackDemoMode && <div className="feedback-demo-notice">Modo de demonstração: os envios ficam salvos somente neste navegador.</div>}

      {selectedFeedback && (
        <div className="feedback-modal" role="dialog" aria-modal="true" aria-label="Arte do feedback">
          <button className="feedback-modal-backdrop" type="button" aria-label="Fechar prévia" onClick={() => setSelectedFeedback(null)} />
          <div className="feedback-modal-panel">
            <div className="feedback-modal-header">
              <div><p className="eyebrow">Pronto para postar</p><h2>Arte para Story</h2></div>
              <button className="feedback-modal-close" type="button" aria-label="Fechar" onClick={() => setSelectedFeedback(null)}><X size={20} /></button>
            </div>
            <div className="feedback-story-preview">
              <img src="/assets/logo-villa-dolce.jpeg" alt="" />
              <small>Mural de Carinho</small>
              <h3>Feedback que amamos</h3>
              <div>
                <span>{"★".repeat(selectedFeedback.rating)}</span>
                <blockquote>“{selectedFeedback.message}”</blockquote>
                <strong>{selectedFeedback.name}</strong>
                <small>{selectedFeedback.product}</small>
              </div>
              <footer><strong>Villa Dolce Ateliê</strong><span>@villadolceatelie</span></footer>
            </div>
            {shareNotice && <p className="feedback-share-notice" role="status">{shareNotice}</p>}
            <div className="feedback-modal-actions">
              <button className="button primary" type="button" onClick={() => void downloadFeedbackStory(selectedFeedback)}><Download size={17} /> Baixar PNG</button>
              <button className="button secondary" type="button" onClick={() => void shareFeedback(selectedFeedback)}><Share2 size={17} /> Compartilhar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
