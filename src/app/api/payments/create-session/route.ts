import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/jwt';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // No need to parse JSON body since we're not expecting any data
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Upload Credits Pack',
              description: '20 prescription uploads',
            },
            unit_amount: 10000, // ₹100 in paise (smallest currency unit)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        userId: user.userId,
        email: user.email,
        uploadCredits: '20',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Payment session error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session', details: error.message },
      { status: 500 }
    );
  }
}
