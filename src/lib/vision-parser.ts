// lib/vision-parser.ts
import OpenAI from "openai";
import { z } from "zod";
import { MedicationItemSchema } from "./schema";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const RxExtractSchema = z.object({
  patient: z
    .object({
      name: z.string().nullable().optional(),
      age: z.string().nullable().optional(),
    })
    .optional(),
  doctor: z
    .object({
      name: z.string().nullable().optional(),
      regNo: z.string().nullable().optional(),
    })
    .optional(),
  items: z
    .array(MedicationItemSchema)
    .min(1, "At least one medicine is required"),
  cautions: z.array(z.string()).optional(),
  overallConfidence: z.number().min(0).max(1).optional(),
});

export type RxExtract = z.infer<typeof RxExtractSchema>;

const SYSTEM = `
You are an expert medical scribe trained to decipher MESSY HANDWRITTEN prescriptions.
Goal: extract and normalize all medicines even if handwriting is unclear.

Rules:
- Output ONLY JSON matching the schema; no prose.
- Do not leave items empty. If uncertain, make the BEST SAFE GUESS based on common generics/brands and Rx abbreviations.
- Expand shorthand: inj=injection, amp=ampoule, tab=tablet, syp=syrup, cap=capsule,
  OD=once daily, BD=BID=twice daily, TID=3/day, QID=4/day, HS=at bedtime, SOS/PRN=as needed.
- Fill both rawName (closest to handwriting) and genericName/brandName when possible.
- Infer strength/form/frequency/duration when hinted (e.g. "1 amp BD" → 1 ampoule twice daily).
- Confidence: use 0.5–0.9 for guesses, 0.9+ when certain.
- Avoid exotic/unsafe drugs; prefer common India-available generics/brands.
- Extract simple cautions/notes like "sugar free diet", "after food".
`;

export async function parseFromImageUrl(imageUrl: string): Promise<RxExtract> {
  if (!process.env.OPENAI_API_KEY) {
    // Keep app responsive even if key missing
    return {
      items: [
        {
          rawName: "OpenAI key missing – please configure",
          genericName: null,
          brandName: null,
        },
      ],
      overallConfidence: 0.0,
    } as RxExtract;
  }

  const schemaText = RxExtractSchema.toString();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // fast, vision-capable
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Return ONLY JSON that matches this Zod schema. If uncertain, output your best safe guess (no empty items):\n" +
              schemaText,
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
      // (Optional) Few-shot: add 1–2 tiny examples here later to improve robustness.
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  let parsed = RxExtractSchema.safeParse(JSON.parse(raw));

  // If the model still refuses, retry once with a more direct nudge
  if (!parsed.success) {
    const retry = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "You must NOT return an empty items array. Output your BEST SAFE GUESS.\n" +
                "Return ONLY JSON per this schema:\n" +
                schemaText,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });
    const raw2 = retry.choices[0]?.message?.content || "{}";
    parsed = RxExtractSchema.safeParse(JSON.parse(raw2));
  }

  if (!parsed.success) {
    // Last-resort fallback so UI stays usable
    return {
      items: [
        {
          rawName: "Unclear handwriting — please edit",
          genericName: null,
          brandName: null,
        },
      ],
      overallConfidence: 0.3,
    } as RxExtract;
  }

  // If model returned items but forgot overallConfidence, derive a simple heuristic
  const data = parsed.data;
  if (data.overallConfidence == null) {
    const avg =
      data.items
        .map((i) => (typeof i.confidence === "number" ? i.confidence : 0.7))
        .reduce((a, b) => a + b, 0) / Math.max(1, data.items.length);
    data.overallConfidence = Math.min(0.95, Math.max(0.4, avg));
  }
  return data;
}
