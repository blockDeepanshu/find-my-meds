import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/jwt';
import { getUserQuotaStatus } from '@/lib/user';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quotaStatus = await getUserQuotaStatus(user.userId);
    return NextResponse.json({ quotaStatus });
  } catch (error) {
    console.error('Quota status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
