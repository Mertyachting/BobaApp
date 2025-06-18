import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/app/helpers/helpers";


const url = 'https://api-m.sandbox.paypal.com';
const partner_id = process.env.PARTNER_ID



export async function GET(req: NextRequest) {
    let tracking_id = await req.nextUrl.searchParams
    console.log('FUCKING TRACKINMG ID ' + tracking_id)

    const access_token = await getAccessToken();
    const full_url = `${url}/v1/customer/partners/${partner_id}/merchant-integrations?tracking_id=${tracking_id}`
    console.log(full_url)
    try {
        const data = await fetch(full_url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            }

        )
        const res = await data;
        return NextResponse.json(res)

    } catch (error) {
        NextResponse.json({ error })

    }

}