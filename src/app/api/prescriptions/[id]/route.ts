import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { RxPatchSchema } from "@/lib/schema";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const db = await getDb();
  const doc = await db
    .collection("prescriptions")
    .findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Normalize _id to string
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}

// Update items/status (from Results page edits)

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  const parsed = RxPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const db = await getDb();
  const update: any = { updatedAt: new Date() };
  if (parsed.data.items) update.items = parsed.data.items;
  if (parsed.data.status) update.status = parsed.data.status;
  if (parsed.data.overallConfidence !== undefined)
    update.overallConfidence = parsed.data.overallConfidence;

  await db
    .collection("prescriptions")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  const doc = await db
    .collection("prescriptions")
    .findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}
