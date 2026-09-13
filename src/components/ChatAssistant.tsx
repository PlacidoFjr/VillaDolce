import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  MessageCircleHeart,
  RotateCcw,
  Send,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  answerChatAction,
  answerChatText,
  initialChatContent,
  type ChatAction,
  type ChatContent,
  type ChatSession,
} from "@/lib/chatEngine";
import { whatsappUrl } from "@/lib/utils";

type ChatAssistantProps = {
  onNavigate: (path: string) => void;
};

type ChatMessage = ChatContent & {
  id: string;
  role: "assistant" | "user";
};

type StoredChat = {
  messages: ChatMessage[];
  session: ChatSession;
};

const storageKey = "villa-dolce-chat-v1";

function createMessage(role: ChatMessage["role"], content: ChatContent): ChatMessage {
  return {
    ...content,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
  };
}

function freshConversation(): StoredChat {
  return {
    messages: [createMessage("assistant", initialChatContent())],
    session: {},
  };
}

function readStoredChat(): StoredChat {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return freshConversation();

    const parsed = JSON.parse(stored) as StoredChat;
    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) return freshConversation();
    return { messages: parsed.messages, session: parsed.session ?? {} };
  } catch {
    return freshConversation();
  }
}

export function ChatAssistant({ onNavigate }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => readStoredChat().messages);
  const [chatSession, setChatSession] = useState<ChatSession>(() => readStoredChat().session);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseTimer = useRef<number>();

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify({ messages, session: chatSession }));
  }, [messages, chatSession]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, isResponding, messages]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !window.matchMedia("(max-width: 620px)").matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      if (responseTimer.current) window.clearTimeout(responseTimer.current);
    };
  }, []);

  function resetChat() {
    if (responseTimer.current) window.clearTimeout(responseTimer.current);
    const fresh = freshConversation();
    setMessages(fresh.messages);
    setChatSession(fresh.session);
    setInput("");
    setIsResponding(false);
  }

  function deliverAnswer(answer: ReturnType<typeof answerChatText>) {
    setIsResponding(true);
    responseTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, createMessage("assistant", answer.content)]);
      setChatSession(answer.session);
      setIsResponding(false);
    }, 420);
  }

  function sendText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!value || isResponding) return;

    setMessages((current) => [...current, createMessage("user", { text: value })]);
    setInput("");
    deliverAnswer(answerChatText(value, chatSession));
  }

  function handleAction(action: ChatAction) {
    if (isResponding) return;

    if (action.type === "reset") {
      resetChat();
      return;
    }

    if (action.type === "navigate") {
      setIsOpen(false);
      onNavigate(action.value);
      return;
    }

    if (action.type === "whatsapp") {
      window.open(whatsappUrl(action.value), "_blank", "noopener,noreferrer");
      return;
    }

    setMessages((current) => [...current, createMessage("user", { text: action.label })]);
    deliverAnswer(answerChatAction(action.value, chatSession));
  }

  function openProduct(productId: string) {
    setIsOpen(false);
    onNavigate(`/catalogo#${productId}`);
  }

  return (
    <aside className={`chat-assistant${isOpen ? " is-open" : ""}`} aria-label="Assistente Villa Dolce">
      {isOpen && (
        <section className="chat-panel" id="villa-dolce-assistant" aria-label="Conversa com o assistente Villa Dolce">
          <header className="chat-header">
            <div className="chat-brand-mark" aria-hidden="true">
              <MessageCircleHeart size={20} strokeWidth={1.8} />
            </div>
            <div className="chat-header-copy">
              <strong>Assistente Villa Dolce</strong>
              <span><i aria-hidden="true" /> Atendimento virtual</span>
            </div>
            <button className="chat-icon-button" type="button" title="Recomeçar conversa" aria-label="Recomeçar conversa" onClick={resetChat}>
              <RotateCcw size={17} />
            </button>
            <button className="chat-icon-button" type="button" title="Fechar assistente" aria-label="Fechar assistente" onClick={() => setIsOpen(false)}>
              <X size={19} />
            </button>
          </header>

          <div className="chat-messages" ref={scrollRef} role="log" aria-live="polite" aria-relevant="additions">
            <div className="chat-introduction">
              <span>Villa Dolce Ateliê</span>
              <p>Respostas rápidas para ajudar em sua escolha.</p>
            </div>

            {messages.map((message) => (
              <article className={`chat-message ${message.role}`} key={message.id}>
                <div className="chat-bubble">{message.text}</div>

                {message.products?.map((product) => (
                  <div className="chat-product" key={product.id}>
                    <span><ShoppingBag size={15} aria-hidden="true" /> Sugestão Villa Dolce</span>
                    <strong>{product.title}</strong>
                    <p>{product.description}</p>
                    <div>
                      <button type="button" onClick={() => openProduct(product.id)}>
                        Ver no catálogo <ArrowUpRight size={14} aria-hidden="true" />
                      </button>
                      <a href={whatsappUrl(product.message)} target="_blank" rel="noopener noreferrer">
                        Consultar
                      </a>
                    </div>
                  </div>
                ))}

                {message.actions && message.role === "assistant" && (
                  <div className="chat-actions">
                    {message.actions.map((action, index) => (
                      <button
                        className={action.type === "whatsapp" ? "is-whatsapp" : ""}
                        key={`${action.type}-${action.value}-${index}`}
                        type="button"
                        onClick={() => handleAction(action)}
                      >
                        {action.label}
                        {action.type === "whatsapp" && <ArrowUpRight size={14} aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {isResponding && (
              <div className="chat-typing" aria-label="Assistente digitando">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="chat-composer" onSubmit={sendText}>
            <div className="chat-input-wrap">
              <input
                ref={inputRef}
                type="text"
                value={input}
                maxLength={220}
                aria-label="Escreva sua pergunta"
                placeholder="Digite sua dúvida..."
                onChange={(event) => setInput(event.target.value)}
              />
              {input.length > 0 && <small>{input.length}/220</small>}
            </div>
            <button type="submit" disabled={!input.trim() || isResponding} title="Enviar mensagem" aria-label="Enviar mensagem">
              <Send size={18} />
            </button>
            <p><Check size={13} aria-hidden="true" /> Respostas sobre catálogo, presentes e atendimento.</p>
          </form>
        </section>
      )}

      <button
        className="chat-launcher"
        type="button"
        aria-controls="villa-dolce-assistant"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar assistente Villa Dolce" : "Abrir assistente Villa Dolce"}
        title={isOpen ? "Fechar assistente" : "Posso ajudar?"}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={23} /> : <MessageCircleHeart size={25} />}
        {!isOpen && <span aria-hidden="true" />}
      </button>
    </aside>
  );
}
