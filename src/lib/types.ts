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

export interface UserDoc {
  _id?: any;
  email: string;
  password?: string;  // Optional because some queries might not include it
  name?: string;      // Optional because some queries might not include it
  // upload quota & usage
  freeUploadsRemaining: number;      // start at 2
  paidUploadsRemaining: number;      // starts at 0; +20 per successful pack purchase
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionDoc {
  _id?: any;
  userId: any; // ObjectId reference to user
  fileUrl: string;
  status: RxStatus;
  ocrText?: string | null;
  items: MedicationItem[];
  overallConfidence?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
