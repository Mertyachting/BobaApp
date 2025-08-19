import { NextResponse } from "next/server";

export const dynamic = 'force-static'





function EncodeAuthorization(a: string, b: string) {
    return btoa(`${a}:${b}`);
}

export async function POST() {
    const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'

    // @ts-expect-error the client id and secret will be pulled from the .env as strings
    const auth = EncodeAuthorization(process.env.NEXT_PUBLIC_CLIENT_ID, process.env.SECRET_KEY);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                //'PayPal-Auth-Assertion': 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyIsInBheWVyX2lkIjoiNEVVUFVVV0JVTFpLUyJ9.'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'response_type': 'client_token',
                'domains[]': ''
            })
        })
        const data = await res.json();

        return NextResponse.json(data);
    }
    catch (e) {
        console.error(e)
        return NextResponse.json({ e });
    }
};