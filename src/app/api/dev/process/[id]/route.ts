import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const doc = await db
    .collection("prescriptions")
    .findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Simulated OCR/LLM result
  const items = [
    {
      rawName: "Augmentin 625",
      genericName: "Amoxicillin + Clavulanate",
      brandName: "Augmentin 625",
      strength: "625 mg",
      form: "tablet",
      frequency: "BID",
      duration: "5 days",
      notes: "After food",
      confidence: 0.86,
      buyUrl: "",
    },
    {
      rawName: "Crocin 500",
      genericName: "Paracetamol",
      brandName: "Crocin 500",
      strength: "500 mg",
      form: "tablet",
      frequency: "TID",
      duration: "3 days",
      notes: "If fever > 100°F",
      confidence: 0.9,
      buyUrl: "",
    },
  ];

  await db.collection("prescriptions").updateOne(
    { _id: new ObjectId(params.id) },
    {
      $set: {
        items,
        status: "READY",
        overallConfidence: 0.85,
        updatedAt: new Date(),
      },
    }
  );

  const updated = await db
    .collection("prescriptions")
    .findOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ ...updated, _id: updated!._id.toString() });
}
