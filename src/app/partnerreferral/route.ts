import { pool } from "../api/db/route";


export async function POST() {
    let url = 'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals'
    // const [access_token] = await pool.query('SELECT accesstoken FROM credentials ORDER BY time DESC LIMIT 1;');

    //@ts-ignore
    const accessToken = "A21AAJ32LijmP02E1NLqfZdC_P0WPYO_1yfWmmkCk_QKwfD55-6Bfpll6HhLawJD1WUhWrZsYfCNw8HiA2q7vV7-iBWdvb5_g";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                //'PayPal-Auth-Assertion': 'eyJhbGciOiJub25lIn0.eyJpc3MiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyIsInBheWVyX2lkIjoiNEVVUFVVV0JVTFpLUyJ9.'
            },
            body: JSON.stringify({
                "business_entity": {
                    "addresses": [
                        {
                            "country_code": "US",
                            "type": "WORK"
                        }
                    ]
                },
                "legal_consents": [
                    {
                        "granted": true,
                        "type": "SHARE_DATA_CONSENT"
                    }
                ],
                "operations": [
                    {
                        "api_integration_preference": {
                            "rest_api_integration": {
                                "integration_method": "PAYPAL",
                                "integration_type": "THIRD_PARTY",
                                "third_party_details": {
                                    "features": [
                                        "PAYMENT",
                                        "REFUND",
                                        "ACCESS_MERCHANT_INFORMATION",
                                        "VAULT",
                                        "BILLING_AGREEMENT"
                                    ]
                                }
                            }
                        },
                        "operation": "API_INTEGRATION"
                    }
                ],
                "products": [
                    "PPCP",
                    "ADVANCED_VAULTING"
                ],
                "capabilities": [
                    "PAYPAL_WALLET_VAULTING_ADVANCED"
                ],
                "tracking_id": "XYZ"

            })
        })
        const data = await res.json();
        return Response.json({ data });
    }
    catch (error) {
        return Response.json({ message: error });
    }
};
