
'use client'

import React, { useState, useEffect } from "react";
import { Check, TriangleAlert } from "lucide-react";
import Script from "next/script";
import { NextResponse } from "next/server";
import { useQuery } from "@tanstack/react-query";



export default function Onboarding() {
    //useEffect(() => { getOnboardingData() })

    useEffect(() => {
        // expose the callback globally
        window.onboardedCallback = async (authCode, sharedId) => {
            setAuthCode(authCode)
            setShareID(sharedId)
            try {
                await fetch('/api/webhook', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ authCode, sharedId }),
                });
            } catch (err) {
                alert('Something went wrong');
            }
        };

        // optional: tidy up when the component unmounts
        return () => delete window.onboardedCallback;
    }, []);

    const [email, setEmail] = useState('sb-89a43m40169106@business.example.com');
    const [email_not_verified, setEmailNotVerified] = useState(false);
    const [payment_not_receivable, setPaymentNotReceivable] = useState(false);
    const [offboarding, setOffboarding] = useState(false);
    const [onboarding, setOnboarding] = useState(true)
    const [venmo, setVenmo] = useState(true)
    const [payLater, setPayLater] = useState(true)
    const [cc, setCC] = useState(true)
    const [appswitch, setAppSwitch] = useState(true)
    const [action_url, setActionUrl] = useState('')
    const [authCode, setAuthCode] = useState<string | null>(null)
    const [sharedId, setShareID] = useState<string | null>(null)
    const [sellerAccessToken, setSellerAccessToken] = useState<string | null>(null)


    const body = {
        "email": email,
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
        "tracking_id": email

    }

    const bodyFirstParty = {
        "email": email,
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
                "operation": "API_INTEGRATION",
                "api_integration_preference": {
                    "rest_api_integration": {
                        "integration_method": "PAYPAL",
                        "integration_type": "FIRST_PARTY",
                        "first_party_details": {
                            "features": [
                                "PAYMENT",
                                "REFUND",
                                "ACCESS_MERCHANT_INFORMATION",
                                "VAULT",
                                "BILLING_AGREEMENT"
                            ],
                            "seller_nonce": 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                        }
                    }
                }

            }
        ],
        "products": [
            "PPCP",
            "ADVANCED_VAULTING"
        ],
        "capabilities": [
            "PAYPAL_WALLET_VAULTING_ADVANCED"
        ],
        "tracking_id": email,
        "partner_config_override": {
            "return_url": "http://192.168.178.34:3000/success",
            "return_url_description": "onboarding page"
        }

    }

    function unverifyMail() {
        return setEmailNotVerified(true)
    }

    function paymentUnreceivable() {
        return setPaymentNotReceivable(true)
    }

    async function GenerateOnboardingLink() {
        const onboardingLink = await fetch(`api/partnerreferral`, {
            method: "POST",
            mode: "same-origin",
            body: JSON.stringify(
                body
            )

        })
        const data = await onboardingLink.json()
        return window.open(data.data.links[1].href);
    }

    async function GenerateFirstPartyLink() {
        const onboardingLink = await fetch(`api/partnerreferral`, {
            method: "POST",
            mode: "same-origin",
            body: JSON.stringify(
                bodyFirstParty
            )

        })
        const data = await onboardingLink.json()
        console.log(data)
        setActionUrl(data.data.links[1].href);
    }

    const seller_token = useQuery({
        queryKey: [authCode ? authCode : '', sharedId ? sharedId : ''],
        queryFn: async () => {
            const basicAuth = Buffer.from(`${sharedId}:`).toString('base64');
            const res = await fetch(
                'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${basicAuth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: authCode ? authCode : 'nothing',
                        code_verifier: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    }).toString(),
                },
            )
            const data = await res.json();
            setSellerAccessToken(data.access_token)
            return data;
        },
        enabled: !!sharedId
    })

    console.log(sellerAccessToken)
    /*
        const client_credentials = useQuery({
            queryKey: [sellerAccessToken],
            queryFn: async () => {
                const basicAuth = Buffer.from(`${sellerAccessToken}:`).toString('base64');
                const res = await fetch(
                    "https://api-m.sandbox.paypal.com/v1/customer/partners/VDTA7YXQ5BTKE/merchant-integrations/credentials", {
                    method: 'POST',
                    headers: {
                        Authorization: basicAuth
                    },
                }
                )
                const data = await res.json();
                return data;
            },
            enabled: !!sellerAccessToken
        })
            */

    /*
    async function onboardedCallback(authCode, sharedId) {

        try {
            const data = await fetch('/api/webhook', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    authCode: authCode,
                    sharedId: sharedId
                })
            })
            NextResponse.json(data);
        } catch (error) {
            alert(error)

        }
    }
*/

    /*
        async function getOnboardingData() {
            try {
                const res = await fetch(`api/partnerreferral/GET_onboarding_data?tracking_id=${email}`,
                    {
                        method: 'GET'
                    }
                )
                const data = await NextResponse.json(res);
                console.log(data)
                return data;
    
            } catch (error) {
                console.log(error)
    
            }
        }
            */

    return (
        <>

            {
                offboarding ?
                    <>
                        <div className="notification is-warning is-light">
                            <button className="delete"></button>
                            <p>
                                Disconnecting your PayPal account will prevent you from offering PayPal services and products on your website. Do you wish to continue?
                            </p>
                            <button className="button is-danger" onClick={() => setOnboarding(false)}>Continue</button>
                        </div>
                    </>
                    : ''
            }

            <div className="conatiner p-4 is-vcentered">
                <div className="box">
                    <div className="columns">
                        <div className="column is-half">
                            <div className="control has-icons-left has-icons-right">
                                <input className="input is-medium" type="email" placeholder={email} value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <button className="button is-black pt2" onClick={GenerateOnboardingLink} disabled={onboarding}>
                            Enable PayPal
                        </button>
                        <div className="column">
                            <button className="button is-black pt2" onClick={GenerateFirstPartyLink}>Generate First Party Onboarding Link</button>
                        </div>
                        <div className="column">
                            <a className="button is-black pt2" target="_blank" data-paypal-onboard-complete="onboardedCallback" href={`${action_url}&displayMode=minibrowser`} data-paypal-button="true">First Party Onboarding</a>
                        </div>

                        <div className="column">
                            <button className="button is-black pt2" onClick={() => setOffboarding(true)}>
                                Disable PayPal
                            </button>
                        </div>
                    </div>



                    <div className="columns">

                        <div className="column">
                            <h1 className="title is-6">{authCode}</h1>
                            <h1 className="title is-6">{sharedId}</h1>


                        </div>

                        <div className="column">
                            <div className="icon-text">
                                <h1 className="title is-6">Email is verified: </h1>

                                {
                                    email_not_verified ?
                                        <>
                                            <div className="icon has-text-danger">
                                                <TriangleAlert />
                                            </div>
                                            <div className="content">
                                                <p className="has-background-danger has-text-white has-text-weight-semibold">
                                                    Attention: Please confirm your email address on https://www.paypal.com/businessprofile/settings in order to receive payments! You currently cannot receive payments.
                                                </p>
                                            </div>
                                        </>
                                        :
                                        <div className="icon has-text-success">
                                            <i><Check /></i>
                                        </div>
                                }

                            </div>
                        </div>

                        <div className="column">
                            <button className="button is-danger" onClick={unverifyMail}>Mock Email is not verified</button>
                        </div>


                    </div>
                    <div className="columns">
                        <div className="column">
                            <div className="icon-text">
                                <h1 className="title is-6">Can receive payments:</h1>
                                {payment_not_receivable ?
                                    <>
                                        <div className="icon has-text-danger">
                                            <TriangleAlert />
                                        </div>
                                        <div className="content">
                                            <p className="has-background-danger has-text-white has-text-weight-semibold">
                                                Attention: You currently cannot receive payments due to restriction on your PayPal account. Please reach out to PayPal Customer Support or connect to https://www.paypal.com for more information.
                                            </p>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="icon has-text-success">
                                            <i><Check /></i>
                                        </div>
                                    </>



                                }

                            </div>
                        </div>
                        <div className="column">
                            <button className="button is-danger" onClick={paymentUnreceivable}>Mock Payment is not receivable</button>
                        </div>

                    </div>

                    <div className="columns">
                        <div className="column">
                            <h1 className="title is-5">Payment Options</h1>
                        </div>

                    </div>
                    <div className="columns">
                        <div className="column">

                            <button className="button is-success" onClick={() => setPayLater(false)} disabled={!payLater}>
                                PayLater
                            </button>
                        </div>

                        <div className="column">
                            <button className="button is-success" onClick={() => setVenmo(false)} disabled={!venmo}>
                                Venmo
                            </button>
                        </div>
                        <div className="column">
                            <button className="button is-success" onClick={() => setCC(false)} disabled={!cc}>
                                Credit Card
                            </button>
                        </div>
                        <div className="column">
                            <button className="button is-success" onClick={() => setAppSwitch(false)} disabled={!appswitch}>
                                AppSwitch
                            </button>
                        </div>
                    </div>

                </div>
            </div>


            <Script
                src="https://www.sandbox.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js"
                id="paypal-js"
            />
        </>
    )
}