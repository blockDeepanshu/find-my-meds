// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getDb } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/jwt";

export const runtime = "nodejs"; // ensure Node runtime (not edge) for formData + Blob SDK

export async function POST(req: Request) {
  // Check authentication
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "No file received" }, { status: 400 });

  // Upload to Vercel Blob
  const arrayBuffer = await file.arrayBuffer();
  const token = process.env.BLOB_READ_WRITE_TOKEN; // needed locally; on Vercel it's auto
  const filename = `rx/${crypto.randomUUID()}-${file.name}`;
  const { url } = await put(filename, Buffer.from(arrayBuffer), {
    access: "public",
    token,
  });

  // Create DB record with userId
  const db = await getDb();
  const now = new Date();
  const doc = {
    userId: new ObjectId(user.userId),
    fileUrl: url,
    status: "PROCESSING",
    ocrText: null,
    items: [] as any[],
    overallConfidence: null,
    createdAt: now,
    updatedAt: now,
  };

  const res = await db.collection("prescriptions").insertOne(doc);
  const id = (res.insertedId as ObjectId).toString();

  return NextResponse.json({ prescriptionId: id });
}
