import { NextResponse } from "next/server";


var auth = '';
var jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USIsInBheWVyX2lkIjoiRFZKQkczRUpWMllNSiIsImlhdCI6MTc0Nzc0MzA2MH0.J_eklbH6MPrrhn6BNeWLEYVAkOYOe_zsPJHKd9BUajM'
function EncodeAuthorization(a: String, b: String) {
    auth = btoa(`${a}:${b}`);
}


export async function POST() {
    let url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'

    // @ts-ignore
    EncodeAuthorization(process.env.NEXT_PUBLIC_CLIENT_ID, process.env.SECRET_KEY);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
                'PayPal-Auth-Assertion': jwtToken
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'response_type': 'client_token',
                'intent': 'sdk_init'
            })
        })
        const data = await res.json();
        const access_token = data.access_token;

        return NextResponse.json(access_token);
    }
    catch (e) {
        return NextResponse.json({ e });
    }
};