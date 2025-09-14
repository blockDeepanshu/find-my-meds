export type RxStatus =
  | "UPLOADED"
  | "PROCESSING"
  | "READY"
  | "NEEDS_REVIEW"
  | "FAILED";

export interface MedicationItem {
  rawName: string;
  genericName?: string | null;
  brandName?: string | null;
  strength?: string | null;
  form?: string | null;
  route?: string | null;
  frequency?: string | null;
  duration?: string | null;
  notes?: string | null;
  confidence?: number | null;
  buyUrl?: string | null;
}

export interface PrescriptionDoc {
  _id?: any;
  fileUrl: string;
  status: RxStatus;
  ocrText?: string | null;
  items: MedicationItem[];
  overallConfidence?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
