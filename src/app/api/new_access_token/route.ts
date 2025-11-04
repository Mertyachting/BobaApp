import { NextResponse } from "next/server";
import { encodeAuthorization } from "@/app/helpers/helpers";

export async function POST() {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
    const auth = encodeAuthorization();
    console.log(auth)

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'authorization':`Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'PayPal-Auth-Assertion': `eyJhbGciOiJub25lIn0.eyJpc3MiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USIsInBheWVyX2lkIjoiRFZKQkczRUpWMllNSiJ9.`,
                'partner-attribution-id': 'setup-token-request-001'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'response_type': 'client_token',
                'domains[]': 'ql-pp.cc'
            })
        })
        console.log(res)
        const data = await res.json();
        console.log(data)
        
        return NextResponse.json(data);
    }
    catch (e) {
        console.error(e)
        return NextResponse.json({ e });
    }
};