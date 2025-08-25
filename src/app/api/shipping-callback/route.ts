// app/api/shipping-callback/route.ts

import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Received server-side callback:', body);
        return NextResponse.json(
            {
                id: body.id,
                shipping_options: body.shipping_options,
                shpping_address: body.shipping_address,
                purchase_units: [
                    {
                        amount: body.purchase_units[0].amount
                    }
                ]
            }
        );
    } catch (error) {
        // Handle error, invalid payload, etc.
        console.log(error)
        return NextResponse.json(error);
    }
}
