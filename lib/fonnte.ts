const FONNTE_API = "https://api.fonnte.com/send";

export async function sendWhatsApp(
  target: string,
  message: string,
  options?: { typing?: boolean; delay?: string; inboxid?: number }
) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) throw new Error("FONNTE_TOKEN not configured");

  const body: Record<string, unknown> = {
    target,
    message,
    countryCode: "62",
    typing: true,
  };

  if (options?.delay) body.delay = options.delay;
  if (options?.inboxid) body.inboxid = options.inboxid;

  const res = await fetch(FONNTE_API, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.fromEntries(
        Object.entries(body).map(([k, v]) => [k, String(v)])
      )
    ).toString(),
  });

  const data = await res.json();
  return data as { status: boolean; reason?: string; id?: string[] };
}