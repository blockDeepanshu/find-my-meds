import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Ask LLM for the best single-line shopping query for this item.
 * Keep deterministic fields if they already exist.
 */
export async function llmCatalogQueryFallback(
  item: any
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const text = JSON.stringify({
    rawName: item.rawName ?? null,
    genericName: item.genericName ?? null,
    brandName: item.brandName ?? null,
    strength: item.strength ?? null,
    form: item.form ?? null,
  });

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You create concise e-pharmacy search queries.",
      },
      {
        role: "user",
        content:
          `Given this parsed medicine JSON, output a SINGLE short query for shopping (no quotes, no extra words). Prefer generic + strength + form; else best brand.\n` +
          text,
      },
    ],
  });

  const q = res.choices[0]?.message?.content?.trim();
  if (!q) return null;
  // sanitize to one line
  return q.replace(/\s+/g, " ");
}
