import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { RxPatchSchema } from "@/lib/schema";
import { getCurrentUser } from "@/lib/jwt";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  const doc = await db
    .collection("prescriptions")
    .findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId)
    });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Normalize _id to string
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}

// Update items/status (from Results page edits)

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    .updateOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId)
    }, { $set: update });

  const doc = await db
    .collection("prescriptions")
    .findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user.userId)
    });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...doc, _id: doc._id.toString() });
}
