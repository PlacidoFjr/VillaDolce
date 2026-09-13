export type FeedbackEntry = {
  id: string;
  name: string;
  rating: number;
  product: string;
  message: string;
  created_at: string;
};

export type NewFeedback = Omit<FeedbackEntry, "id" | "created_at"> & {
  consent: boolean;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const localStorageKey = "villa-dolce-feedbacks";

export const isFeedbackDemoMode = !supabaseUrl || !supabaseKey;

function requestHeaders(includeJson = false): HeadersInit {
  const headers: HeadersInit = {
    apikey: supabaseKey ?? "",
    Authorization: `Bearer ${supabaseKey ?? ""}`,
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function readLocalFeedbacks(): FeedbackEntry[] {
  try {
    const stored = window.localStorage.getItem(localStorageKey);
    return stored ? (JSON.parse(stored) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

export async function getApprovedFeedbacks(): Promise<FeedbackEntry[]> {
  if (isFeedbackDemoMode) {
    return readLocalFeedbacks();
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/feedbacks?select=id,name,rating,product,message,created_at&approved=eq.true&order=created_at.desc`,
    { headers: requestHeaders() },
  );

  if (!response.ok) {
    throw new Error("Não foi possível carregar o mural agora.");
  }

  return (await response.json()) as FeedbackEntry[];
}

export async function createFeedback(feedback: NewFeedback): Promise<FeedbackEntry | null> {
  if (isFeedbackDemoMode) {
    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      name: feedback.name,
      rating: feedback.rating,
      product: feedback.product,
      message: feedback.message,
      created_at: new Date().toISOString(),
    };
    const current = readLocalFeedbacks();
    window.localStorage.setItem(localStorageKey, JSON.stringify([entry, ...current]));
    return entry;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/feedbacks`, {
    method: "POST",
    headers: {
      ...requestHeaders(true),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: feedback.name,
      rating: feedback.rating,
      product: feedback.product,
      message: feedback.message,
      consent: feedback.consent,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível enviar seu feedback. Tente novamente em instantes.");
  }

  return null;
}
