// lib/llm.ts
import OpenAI from "openai";
import { z } from "zod";
import { MedicationItemSchema } from "./schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

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
You are an expert medical scribe trained in deciphering messy HANDWRITTEN prescriptions.
Your job: extract and normalize all medicines, even if handwriting is unclear.

Rules:
- Always return JSON matching the schema.
- NEVER return empty or placeholder items. If uncertain, make the BEST GUESS based on handwriting, common medicines, and abbreviations.
- Expand shorthand: inj = injection, amp = ampoule, tab = tablet, syp = syrup, bid = 2/day, tid = 3/day, qid = 4/day, hs = bedtime.
- For brands you don’t recognize, map to the closest common drug name. If multiple possible, choose the most likely.
- Fill both rawName (closest to handwritten text) and normalized genericName/brandName when possible.
- For dosage/frequency/duration, infer from context (e.g., “1 amp bid” → 1 ampoule twice daily).
- Confidence: 0.5–0.9 if guessed, 0.9+ if certain.
- DO NOT hallucinate exotic or unsafe drugs. Stick to common generics/brands.
- Cautions: extract notes like “sugar free diet”, “avoid alcohol”, etc.
`;

/**
 * Vision-only extraction from a PUBLIC image URL.
 * Example: const data = await parsePrescriptionFromUrl(doc.fileUrl)
 */
export async function parsePrescriptionFromUrl(
  imageUrl: string
): Promise<RxExtract> {
  const schemaText = RxExtractSchema.toString();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // vision-capable, fast
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
              "Return ONLY JSON that matches this Zod schema (no prose). If unsure, make the best safe guess.\n" +
              schemaText,
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const json = JSON.parse(raw);
  const parsed = RxExtractSchema.safeParse(json);

  if (!parsed.success) {
    // Keep UI functional if the model output is invalid JSON/schema
    return {
      items: [
        {
          rawName: "Please review — low confidence",
          genericName: null,
          brandName: null,
        },
      ],
      overallConfidence: 0.3,
    } as RxExtract;
  }
  return parsed.data;
}
