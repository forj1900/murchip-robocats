const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequestPost({ request, env }) {
  if (!env.LEADS_DB) {
    return json({ ok: false, error: "Форма временно недоступна." }, 503);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) {
    return json({ ok: false, error: "Слишком большой запрос." }, 413);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Неверный формат запроса." }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Не удалось прочитать заявку." }, 400);
  }

  // Поле company скрыто от людей. Заполненное значение обычно означает робота.
  if (String(body.company || "").trim()) {
    return json({ ok: true });
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Проверьте адрес электронной почты." }, 400);
  }

  try {
    await env.LEADS_DB.prepare(
      `INSERT INTO leads (email, source)
       VALUES (?, 'website')
       ON CONFLICT(email) DO UPDATE SET
         last_submitted_at = CURRENT_TIMESTAMP,
         submission_count = submission_count + 1`,
    )
      .bind(email)
      .run();

    return json({ ok: true });
  } catch (error) {
    console.error("Failed to store lead", error);
    return json({ ok: false, error: "Не удалось сохранить заявку. Попробуйте ещё раз." }, 500);
  }
}
