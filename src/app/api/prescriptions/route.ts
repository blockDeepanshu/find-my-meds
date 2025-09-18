import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/jwt"
import { getDb } from "@/lib/mongo"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const prescriptions = await db
      .collection("prescriptions")
      .find({ userId: new ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .toArray()

    // Transform the data to include computed fields
    const transformedPrescriptions = prescriptions.map((prescription) => ({
      ...prescription,
      _id: prescription._id.toString(),
      userId: prescription.userId.toString(),
      medicineCount: prescription.items?.length || 0,
      createdAt: prescription.createdAt || new Date(),
    }))

    return NextResponse.json(transformedPrescriptions)
  } catch (error) {
    console.error("Error fetching prescriptions:", error)
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    )
  }
}
