// app/api/process/[id]/route.ts
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";
import { parseFromImageUrl } from "@/lib/vision-parser";
import { buildCatalogQuery, buildBuyLinks } from "@/lib/links";
import { llmCatalogQueryFallback } from "@/lib/links-llm";
import { getCurrentUser } from "@/lib/jwt";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  const _id = new ObjectId(id);
  const doc = await db.collection("prescriptions").findOne({ 
    _id,
    userId: new ObjectId(user.userId)
  });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db
    .collection("prescriptions")
    .updateOne(
      { _id },
      { $set: { status: "PROCESSING", updatedAt: new Date() } }
    );

  try {
    const imageUrl = doc.fileUrl as string; // public blob URL

    // Optional guard: reject PDFs for now (vision models prefer images)
    if (imageUrl.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Please upload an image (JPG/PNG). PDF support coming soon." },
        { status: 400 }
      );
    }

    const extracted = await parseFromImageUrl(imageUrl);

    const itemsWithLinks = await Promise.all(
      (extracted.items ?? []).map(async (it) => {
        let q = buildCatalogQuery(it);
        if (!q || q.length < 3) {
          const maybe = await llmCatalogQueryFallback(it);
          if (maybe) q = maybe;
        }
        if (q) {
          const { primary } = buildBuyLinks(q);
          return { ...it, buyUrl: primary.url }; // fits your existing schema
        }
        return it;
      })
    );

    await db.collection("prescriptions").updateOne(
      { _id },
      {
        $set: {
          items: itemsWithLinks,
          overallConfidence: extracted.overallConfidence ?? null,
          status: extracted.items?.length ? "READY" : "NEEDS_REVIEW",
          updatedAt: new Date(),
        },
      }
    );

    const updated = await db.collection("prescriptions").findOne({ _id });
    return NextResponse.json({ ...updated, _id: updated!._id.toString() });
  } catch (err: any) {
    console.error("PROCESS ERROR:", err);
    await db
      .collection("prescriptions")
      .updateOne(
        { _id },
        { $set: { status: "FAILED", updatedAt: new Date() } }
      );
    return NextResponse.json(
      { error: "Processing failed", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
