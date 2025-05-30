"use client";

import React from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js/src";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
    return uuidv4()
}





const base = 'http://192.168.178.34:3000';

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : 'test';
const merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID ? process.env.NEXT_PUBLIC_MERCHANT_ID : 'test';



export default function AppSwitch() {
    const initialOptions = {
        clientId: client_id,
        currency: "USD",
        intent: "capture",
        merchantId: merchant_id,
        buyerCountry: 'US',
        components: ['buttons', 'fastlane'],
        'data-partner-attribution-id': "Boba"
    };

    const payload = {
        "intent": "CAPTURE",
        "invoice_id": generateUUID(),
        "purchase_units": [
            {
                "reference_id": "homer",
                "amount": {
                    "currency_code": "USD",
                    "value": "245",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": "150.00"
                        },
                        "tax_total": {
                            "currency_code": "USD",
                            "value": 95.00
                        }
                    }
                },
                "items": [
                    {
                        "name": "Lost Episode of Homers Bachelor Party",
                        "quantity": "2",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "50.00"
                        },
                        "sku": "1000",
                        "tax": {
                            "currency_code": "USD",
                            "value": "38.00"
                        }
                    },
                    {
                        "name": "Special Edition Duff Whiskey",
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "50.00"
                        },
                        "sku": "20",
                        "tax": {
                            "currency_code": "USD",
                            "value": "19.00"
                        }
                    }
                ],
                "shipping": {
                    "address": {
                        "address_line_1": "Badensche Str. 24",
                        "admin_area_1": "Berlin",
                        "admin_area_2": "Berlin",
                        "country_code": "DE",
                        "postal_code": "10715"
                    },
                    "type": "SHIPPING"
                },
                "custom_id": "HelloHomer"
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "brand_name": "EXAMPLE INC",
                    "cancel_url": "http://192.168.178.34:3000/components/appswitch",
                    "landing_page": "LOGIN",
                    "locale": "en-US",
                    "return_url": "http://192.168.178.34:3000/components/appswitch",
                    "shipping_preference": "SET_PROVIDED_ADDRESS",
                    "user_action": "PAY_NOW",
                    "app_switch_preference": {
                        "launch_paypal_app": true
                    }
                }
            }
        }
    }



    async function createOrder() {
        console.log('CLICK')
        try {
            const respone = await fetch(`${base}/api/order`, {
                method: "POST",
                mode: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify(payload),
            })
            const data = await respone.json();
            if (data.id) {
                console.log("ODER UID IS THERE: " + data.id)
                return data.id;
            }
            else {
                const errorDetail = data?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${data.debug_id})`
                    : JSON.stringify(data);

                throw new Error(errorMessage);
            }
        } catch (e) {
            console.log("Failed to initiate " + e);

        }

    }

    //@ts-ignore
    async function onApprove(data) {

        console.log('onapprove is called.')


        await fetch(`${base}/api/capture`, {
            mode: 'same-origin',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        })



    }


    return (
        <>
            <h1 className="title is-1">THIS IS APPSWITCH</h1>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} appSwitchWhenAvailable={true} />
            </PayPalScriptProvider>

        </>

    );
};