/**
 * Optional Cloudflare Pages Function.
 *
 * Use this when you want the Web3Forms access key to stay off the client.
 * Set WEB3FORMS_ACCESS_KEY in the Cloudflare project environment, and set
 * NEXT_PUBLIC_FORM_ENDPOINT=/api/contact for the production build.
 */

export async function onRequestPost(context) {
  const accessKey = context.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return Response.json(
      { ok: false, error: "Form provider is not configured." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid form payload." }, { status: 400 });
  }

  if (typeof body?.company === "string" && body.company.trim()) {
    return Response.json({ ok: true });
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      access_key: accessKey,
    }),
  });

  if (!response.ok) {
    return Response.json({ ok: false, error: "The message could not be sent." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
