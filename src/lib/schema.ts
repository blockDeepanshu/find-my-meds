import { z } from "zod";

export const MedicationItemSchema = z.object({
  rawName: z.string().min(1, "Raw/label is required"),
  genericName: z.string().nullable().optional(),
  brandName: z.string().nullable().optional(),
  strength: z.string().nullable().optional(),
  form: z.string().nullable().optional(),
  route: z.string().nullable().optional(),
  frequency: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  buyUrl: z
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
});

export const RxPatchSchema = z.object({
  items: z.array(MedicationItemSchema).optional(),
  status: z
    .enum(["UPLOADED", "PROCESSING", "READY", "NEEDS_REVIEW", "FAILED"])
    .optional(),
  overallConfidence: z.number().min(0).max(1).nullable().optional(),
});
