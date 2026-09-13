export type FeedbackEntry = {
  id: string;
  name: string;
  rating: number;
  product: string;
  message: string;
  created_at: string;
};

export type AdminFeedbackEntry = FeedbackEntry & {
  consent: boolean;
  approved: boolean;
};

export type FeedbackAdminSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  userId: string;
};

export type NewFeedback = Omit<FeedbackEntry, "id" | "created_at"> & {
  consent: boolean;
};

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
const supabaseProjectUrl = configuredSupabaseUrl?.replace(/\/rest\/v1$/, "");
const supabaseRestUrl = configuredSupabaseUrl
  ? configuredSupabaseUrl.endsWith("/rest/v1")
    ? configuredSupabaseUrl
    : `${configuredSupabaseUrl}/rest/v1`
  : undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const localStorageKey = "villa-dolce-feedbacks";
const adminSessionKey = "villa-dolce-feedback-admin-session";

export const isFeedbackDemoMode = !supabaseRestUrl || !supabaseKey;
export const isFeedbackAdminConfigured = Boolean(supabaseProjectUrl && supabaseRestUrl && supabaseKey);

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

function adminRequestHeaders(accessToken: string, includeJson = false): HeadersInit {
  return {
    apikey: supabaseKey ?? "",
    Authorization: `Bearer ${accessToken}`,
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
  };
}

function saveAdminSession(session: FeedbackAdminSession | null) {
  if (session) {
    window.sessionStorage.setItem(adminSessionKey, JSON.stringify(session));
  } else {
    window.sessionStorage.removeItem(adminSessionKey);
  }
}

function readAdminSession(): FeedbackAdminSession | null {
  try {
    const stored = window.sessionStorage.getItem(adminSessionKey);
    return stored ? (JSON.parse(stored) as FeedbackAdminSession) : null;
  } catch {
    return null;
  }
}

type SupabaseAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email?: string;
  };
};

function mapAuthSession(response: SupabaseAuthResponse): FeedbackAdminSession {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: Date.now() + response.expires_in * 1000,
    email: response.user.email ?? "Administrador",
    userId: response.user.id,
  };
}

async function requestAuthSession(
  grantType: "password" | "refresh_token",
  body: Record<string, string>,
): Promise<FeedbackAdminSession> {
  if (!supabaseProjectUrl || !supabaseKey) {
    throw new Error("A conexão com o Supabase ainda não foi configurada.");
  }

  const response = await fetch(`${supabaseProjectUrl}/auth/v1/token?grant_type=${grantType}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(grantType === "password" ? "E-mail ou senha inválidos." : "Sua sessão expirou.");
  }

  const session = mapAuthSession((await response.json()) as SupabaseAuthResponse);
  saveAdminSession(session);
  return session;
}

export async function signInFeedbackAdmin(email: string, password: string) {
  return requestAuthSession("password", { email, password });
}

export async function getFeedbackAdminSession(): Promise<FeedbackAdminSession | null> {
  const session = readAdminSession();
  if (!session) return null;
  if (session.expiresAt > Date.now() + 60_000) return session;

  try {
    return await requestAuthSession("refresh_token", { refresh_token: session.refreshToken });
  } catch {
    saveAdminSession(null);
    return null;
  }
}

export async function signOutFeedbackAdmin() {
  const session = readAdminSession();
  saveAdminSession(null);

  if (!session || !supabaseProjectUrl || !supabaseKey) return;

  await fetch(`${supabaseProjectUrl}/auth/v1/logout`, {
    method: "POST",
    headers: adminRequestHeaders(session.accessToken),
  }).catch(() => undefined);
}

async function requireFeedbackAdmin(): Promise<FeedbackAdminSession> {
  const session = await getFeedbackAdminSession();
  if (!session || !supabaseRestUrl) throw new Error("Faça login novamente para continuar.");

  const membershipResponse = await fetch(
    `${supabaseRestUrl}/feedback_admins?select=user_id&user_id=eq.${encodeURIComponent(session.userId)}`,
    { headers: adminRequestHeaders(session.accessToken) },
  );

  if (!membershipResponse.ok) throw new Error("Não foi possível confirmar o acesso administrativo.");

  const memberships = (await membershipResponse.json()) as Array<{ user_id: string }>;
  if (memberships.length === 0) throw new Error("Esta conta não está autorizada a administrar os feedbacks.");

  return session;
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
    `${supabaseRestUrl}/feedbacks?select=id,name,rating,product,message,created_at&approved=eq.true&order=created_at.desc`,
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

  const response = await fetch(`${supabaseRestUrl}/feedbacks`, {
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

export async function getAdminFeedbacks(): Promise<AdminFeedbackEntry[]> {
  const session = await requireFeedbackAdmin();
  const response = await fetch(
    `${supabaseRestUrl}/feedbacks?select=id,name,rating,product,message,consent,approved,created_at&order=created_at.desc`,
    { headers: adminRequestHeaders(session.accessToken) },
  );

  if (!response.ok) throw new Error("Não foi possível carregar os feedbacks para revisão.");
  return (await response.json()) as AdminFeedbackEntry[];
}

export async function setFeedbackApproval(id: string, approved: boolean): Promise<AdminFeedbackEntry> {
  const session = await requireFeedbackAdmin();
  const response = await fetch(`${supabaseRestUrl}/feedbacks?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...adminRequestHeaders(session.accessToken, true),
      Prefer: "return=representation",
    },
    body: JSON.stringify({ approved }),
  });

  if (!response.ok) throw new Error("Não foi possível atualizar a publicação deste feedback.");

  const updated = (await response.json()) as AdminFeedbackEntry[];
  if (!updated[0]) throw new Error("O feedback não foi encontrado.");
  return updated[0];
}
