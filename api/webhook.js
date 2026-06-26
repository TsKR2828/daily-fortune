import crypto from "crypto";

export const config = { api: { bodyParser: false } };

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verify(body, signature, secret) {
  const digest = crypto
    .createHmac("SHA256", secret)
    .update(body)
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature),
  );
}

async function reply(replyToken, messages) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await readBody(req);
  const signature = req.headers["x-line-signature"];

  if (!signature || !verify(rawBody, signature, process.env.CHANNEL_SECRET)) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  const { events } = JSON.parse(rawBody.toString("utf-8"));

  await Promise.all(
    events
      .filter((e) => e.type === "message" && e.message.type === "text")
      .map((e) =>
        reply(e.replyToken, [{ type: "text", text: e.message.text }]),
      ),
  );

  return res.status(200).json({ ok: true });
}
