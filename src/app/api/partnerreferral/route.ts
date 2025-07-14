import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/app/helpers/helpers";



export async function POST(req: NextRequest) {
    const url = 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals'
    // const [access_token] = await pool.query('SELECT accesstoken FROM credentials ORDER BY time DESC LIMIT 1;');
    const body = await req.json()



    const accessToken = await getAccessToken();
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                //'PayPal-Auth-Assertion': 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyIsInBheWVyX2lkIjoiNEVVUFVVV0JVTFpLUyJ9.'
            },
            body: JSON.stringify(body)
        })
        const data = await res.json();
        return NextResponse.json({ data });
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ message: error });
    }
};
