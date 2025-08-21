"use client";

import React from "react";

import { usePayPalButtons } from "@paypal/react-paypal-js";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import MasterSword from '../../../public/images/CoffeeBeans.png'
import Image from 'next/image';
import Script from "next/script";

export function generateUUID(): string {
    return uuidv4()
}

const base = 'http://192.168.178.34:3000';


/*
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : 'test';
const merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID ? process.env.NEXT_PUBLIC_MERCHANT_ID : 'test';
*/

export default function AppSwitch() {

    let IsReadyToPayRequest = { allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'] }

    function onGooglePayLoaded() {
        //@ts-expect-error ...
        const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });

        paymentsClient.isReadyToPay(IsReadyToPayRequest).then(function (response) {
            console.log(response.result)
            if (response.result) {
                addGooglePayButton();
            }
            //@ts-expect-error ...
        }).catch(function (err) {
            console.error(err);
        });
    }

    function addGooglePayButton() {
        console.log("G-Pay Button function initiated")
        const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
        const button = paymentsClient.createButton({
            onClick: console.log("CLICKER") /* To be defined later */,
            allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD']
        });
        document.getElementById('googlepay').appendChild(button);
    }



    const payload = {
        "intent": "CAPTURE",
        "invoice_id": generateUUID(),
        "purchase_units": [
            {
                "reference_id": "homer",
                "amount": {
                    "currency_code": "USD",
                    "value": "299.99",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": "290.99"
                        },
                        "tax_total": {
                            "currency_code": "USD",
                            "value": 9.00
                        }
                    }
                },
                "items": [
                    {
                        "name": "Beyond Coffee",
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "290.99"
                        },
                        "sku": "1000",
                        "tax": {
                            "currency_code": "USD",
                            "value": "9.00"
                        }
                    },
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
                "custom_id": "MasterSword"
            }
        ],
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "brand_name": "EXAMPLE INC",
                    "cancel_url": "https://qlpp.vercel.app/success",
                    "landing_page": "LOGIN",
                    "locale": "en-US",
                    "return_url": "https://qlpp.vercel.app/success",
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
            const respone = await fetch(`/api/order`, {
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

    //@ts-expect-error...
    async function onApprove(data) {

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

    const { Buttons, isLoaded, hasReturned, resume } = usePayPalButtons({
        appSwitchWhenAvailable: true,
        createOrder,
        onApprove,

        style: {
            tagline: false,
            layout: 'horizontal'
        },

    });

    useEffect(() => {
        if (isLoaded && hasReturned()) {
            resume();
        }
    }, [resume, isLoaded, hasReturned]);

    return (
        <>
            <Script
                id="G-Pay"
                src="https://pay.google.com/gp/p/js/pay.js"
                onLoad={() => onGooglePayLoaded()}
            >
            </Script>
            <div className="container">
                <div className="container">
                    <div className="column is-mobile">
                        <h1 className="title is-2">Test APPSWITCH</h1>
                        <div className="container is-mobile">
                            <div className="columns is-multiline">
                                <div className='column is-half'>
                                    <div className='column is narrow' id="payment-container"></div>
                                </div>
                                <div className="column is-half">
                                    <div className="box">
                                        <article className="media">
                                            <div className="media-left">
                                                <figure className="image is-128x128">
                                                    <Image src={MasterSword} alt='product image showing the Master Sword from Zelda TOTK' width={100} height={128}></Image>
                                                </figure>
                                            </div>
                                            <div className="media-content">
                                                <div className="content">
                                                    <h3 className='title is-3'>Order Summary</h3>
                                                    <p>
                                                        <strong>Beyond Coffee</strong>
                                                        <br />
                                                        <strong>1 item</strong>
                                                        <br />
                                                        <strong>$299.99</strong>
                                                    </p>
                                                </div>
                                                <nav className="level is-mobile">
                                                    <div className="level-left">
                                                        <a className="level-item" aria-label="reply">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-reply" aria-hidden="true"></i>
                                                            </span>
                                                        </a>
                                                        <a className="level-item" aria-label="retweet">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-retweet" aria-hidden="true"></i>
                                                            </span>
                                                        </a>
                                                        <a className="level-item" aria-label="like">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-heart" aria-hidden="true"></i>
                                                            </span>
                                                        </a>
                                                    </div>
                                                </nav>
                                            </div>
                                        </article>
                                    </div>

                                    {isLoaded ?
                                        <>
                                            <Buttons></Buttons>



                                        </>

                                        : null}

                                    <div id="googlepay"></div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>

            </div >
        </>
    );
};