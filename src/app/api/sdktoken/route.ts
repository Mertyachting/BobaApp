import { encodeAuthorization } from "@/app/helpers/helpers";
import { NextResponse } from "next/server";




export async function POST() {

    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USIsInBheWVyX2lkIjoiRFZKQkczRUpWMllNSiIsImlhdCI6MTc0Nzc0MzA2MH0.J_eklbH6MPrrhn6BNeWLEYVAkOYOe_zsPJHKd9BUajM'

    try {
        const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
        const payload = {
            "grant_type": "client_credentials",
            'response_type': 'client_token',
            'intent': 'sdk_init'
        };
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodeAuthorization()}`,
                'PayPal-Auth-Assertion': jwtToken
            },
            body: new URLSearchParams(payload)
        })
        const data = await res.json();
        return NextResponse.json(data);
    }
    catch (e) {
        return NextResponse.json({ e });
    }
};

