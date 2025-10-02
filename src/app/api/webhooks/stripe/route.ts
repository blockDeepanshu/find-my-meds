import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { addPaidUploads } from '@/lib/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      console.error('Body length:', body.length);
      console.error('Signature present:', !!signature);
      console.error('Webhook secret set:', !!webhookSecret);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle successful payments
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const uploadCredits = parseInt(session.metadata?.uploadCredits || '20');
      
      if (!userId) {
        console.error('No userId in session metadata');
        return NextResponse.json(
          { error: 'No userId in session metadata' },
          { status: 400 }
        );
      }

      try {
        // Add paid uploads to user account
        await addPaidUploads(userId, uploadCredits);
      } catch (error) {
        console.error('❌ Failed to add credits to user:', error);
        return NextResponse.json(
          { error: 'Failed to add credits to user' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

// Disable body parsing to handle raw webhooks
export const runtime = 'nodejs';
