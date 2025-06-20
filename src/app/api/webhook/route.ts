// /app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Store multiple webhook events
// let webhooks: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // webhooks.unshift({ id: Date.now(), ...body }); // Add new webhook at the beginning
        console.log('Webhook received:', body);
        return NextResponse.json({ message: 'Received' }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
