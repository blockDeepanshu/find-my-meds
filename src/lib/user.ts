import { ObjectId } from 'mongodb';
import { getDb } from './mongo';
import { UserDoc } from './types';

export async function ensureUser(userId: string, email: string): Promise<UserDoc> {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');
  
  // Try to find existing user
  let user = await users.findOne({ _id: new ObjectId(userId) });
  
  if (!user) {
    // Create new user with default quotas
    const now = new Date();
    const newUser: UserDoc = {
      _id: new ObjectId(userId),
      email,
      freeUploadsRemaining: 2,
      paidUploadsRemaining: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await users.insertOne(newUser);
    // Fetch the inserted user to get the correct type
    user = await users.findOne({ _id: new ObjectId(userId) });
  }
  
  return user!;
}

export async function getUser(userId: string): Promise<UserDoc | null> {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');
  return users.findOne({ _id: new ObjectId(userId) });
}

export async function getUserQuotaStatus(userId: string): Promise<{
  freeUploadsRemaining: number;
  paidUploadsRemaining: number;
  totalUploadsRemaining: number;
  canUpload: boolean;
}> {
  const user = await getUser(userId);
  
  if (!user) {
    return {
      freeUploadsRemaining: 2,
      paidUploadsRemaining: 0,
      totalUploadsRemaining: 2,
      canUpload: true,
    };
  }
  
  // Handle users that might be missing quota fields (legacy users)
  const freeUploads = user.freeUploadsRemaining ?? 2;  // Default to 2 if missing
  const paidUploads = user.paidUploadsRemaining ?? 0;  // Default to 0 if missing
  
  // If quota fields are missing, update the user document
  if (user.freeUploadsRemaining === undefined || user.paidUploadsRemaining === undefined) {
    const db = await getDb();
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          freeUploadsRemaining: freeUploads,
          paidUploadsRemaining: paidUploads,
          updatedAt: new Date(),
        }
      }
    );
  }
  
  const totalRemaining = freeUploads + paidUploads;
  
  return {
    freeUploadsRemaining: freeUploads,
    paidUploadsRemaining: paidUploads,
    totalUploadsRemaining: totalRemaining,
    canUpload: totalRemaining > 0,
  };
}

export async function consumeUpload(userId: string, email: string): Promise<{
  success: boolean;
  remainingUploads: number;
  usedFree: boolean;
}> {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');
  
  // Ensure user exists
  await ensureUser(userId, email);
  
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error('Failed to create or find user');
  }
  
  // Check if user has any uploads remaining (handle missing fields)
  const freeRemaining = user.freeUploadsRemaining ?? 2;
  const paidRemaining = user.paidUploadsRemaining ?? 0;
  const totalRemaining = freeRemaining + paidRemaining;
  if (totalRemaining <= 0) {
    return {
      success: false,
      remainingUploads: 0,
      usedFree: false,
    };
  }
  
  // Consume upload (prioritize free uploads)
  let usedFree = false;
  let newFreeRemaining = freeRemaining;
  let newPaidRemaining = paidRemaining;
  
  if (freeRemaining > 0) {
    newFreeRemaining = freeRemaining - 1;
    usedFree = true;
  } else {
    newPaidRemaining = paidRemaining - 1;
  }
  
  // Update user in database
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        freeUploadsRemaining: newFreeRemaining,
        paidUploadsRemaining: newPaidRemaining,
        updatedAt: new Date(),
      },
    }
  );
  
  return {
    success: true,
    remainingUploads: newFreeRemaining + newPaidRemaining,
    usedFree,
  };
}

export async function addPaidUploads(userId: string, uploadCount: number = 20): Promise<void> {
  const db = await getDb();
  const users = db.collection<UserDoc>('users');
  
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $inc: { paidUploadsRemaining: uploadCount },
      $set: { updatedAt: new Date() },
    },
    { upsert: false }
  );
}
