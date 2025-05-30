import { NextRequest, NextResponse } from "next/server";

const url = 'https://api-m.sandbox.paypal.com';
var access_token = await getAccessToken();

var jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USIsInBheWVyX2lkIjoiRFZKQkczRUpWMllNSiIsImlhdCI6MTc0Nzc0MzA2MH0.J_eklbH6MPrrhn6BNeWLEYVAkOYOe_zsPJHKd9BUajM'



async function getAccessToken() {
    let basis = 'http://192.168.178.34:3000'
    const res = await fetch(`${basis}/api/access_token`, {
        method: "POST",
        mode: "same-origin"
    })
    const data = await res.json()
    console.log(data)
    const access_token = data
    return access_token
}

//@ts-ignore
export async function POST(request: NextRequest) {
    console.log('CAPTURE STATRED')
    const { orderID } = await request.json();
    try {
        const data = await fetch(`${url}/v2/checkout/orders/${orderID}/capture`, {
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
            },
            method: 'POST',
            mode: 'same-origin',
            body: JSON.stringify({}),
        })
        const res = await data;
        return NextResponse.json(res);

    } catch (error) {
        console.log(error)
    }
}