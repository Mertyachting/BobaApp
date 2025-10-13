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
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
       
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'response_type': 'client_token',
                'domains[]': 'ql-pp.cc'
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