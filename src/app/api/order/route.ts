import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { POST as accessToken } from '../access_token/route'

export function generateUUID(): string {
    return uuidv4()
}





var access_token = await getAccessToken();

var jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USIsInBheWVyX2lkIjoiRFZKQkczRUpWMllNSiIsImlhdCI6MTc0Nzc0MzA2MH0.J_eklbH6MPrrhn6BNeWLEYVAkOYOe_zsPJHKd9BUajM'



async function getAccessToken() {
    const res = await accessToken()
    const data = await res.json()
    const access_token = data
    console.log(accessToken)
    return access_token
}

//@ts-ignore
export async function POST(req: NextRequest) {
    console.log(accessToken)
    // use the cart information passed from the front-end to calculate the purchase unit details
    const reqBody = await req.json();
    const base = 'https://api-m.sandbox.paypal.com'
    const url = `${base}/v2/checkout/orders`;

    try {
        const response = await fetch(url,
            {
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                    // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                    // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                    // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
                    //"PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}',
                    // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
                    "PayPal-Partner-Attribution-Id": "Xúr-PPCP",
                    "PayPal-Auth-Assertion": jwtToken,
                    "PayPal-Request-Id": generateUUID()
                },
                method: "POST",
                body: JSON.stringify(reqBody),
            });
        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json('error: ' + e);

    }

}
