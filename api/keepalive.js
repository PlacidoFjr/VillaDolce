function requestHeader(request, name) {
  if (typeof request.headers?.get === "function") return request.headers.get(name) ?? "";
  return request.headers?.[name.toLowerCase()] ?? "";
}

function isAuthorizedCron(request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = requestHeader(request, "authorization");
  const userAgent = requestHeader(request, "user-agent");

  if (cronSecret) return authorization === `Bearer ${cronSecret}`;
  // User agents identify monitors; only CRON_SECRET authenticates requests.
  return userAgent.includes("vercel-cron/1.0") || userAgent === "VillaDolce-HealthCheck/1.0";
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAuthorizedCron(request)) {
    return response.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const configuredUrl = process.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!configuredUrl || !supabaseKey) {
    return response.status(500).json({ ok: false, error: "Supabase environment is not configured" });
  }

  const restUrl = configuredUrl.endsWith("/rest/v1")
    ? configuredUrl
    : `${configuredUrl}/rest/v1`;

  const startedAt = Date.now();
  const source = requestHeader(request, "user-agent") === "VillaDolce-HealthCheck/1.0"
    ? "github-health-check"
    : "vercel-cron";
  function logResult(ok, upstreamStatus, reason) {
    console[ok ? "info" : "error"](JSON.stringify({
      event: "supabase_keepalive",
      source,
      ok,
      upstreamStatus,
      reason,
      durationMs: Date.now() - startedAt,
      checkedAt: new Date().toISOString(),
    }));
  }

  try {
    const supabaseResponse = await fetch(`${restUrl}/feedbacks?select=id&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!supabaseResponse.ok) {
      logResult(false, supabaseResponse.status, "upstream_error");
      return response.status(502).json({
        ok: false,
        error: "Supabase keepalive failed",
        upstreamStatus: supabaseResponse.status,
      });
    }

    logResult(true, supabaseResponse.status, "healthy");
    return response.status(200).json({
      ok: true,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const reason = error?.name === "TimeoutError" ? "timeout" : "unreachable";
    logResult(false, null, reason);
    return response.status(502).json({ ok: false, error: "Supabase is unreachable" });
  }
}
