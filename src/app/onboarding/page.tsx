
'use client'

import React from "react";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import { Check, TriangleAlert } from "lucide-react";






export default function onboarding() {
    useEffect(() => { getOnboardingData(email) }, [])

    let [email, setEmail] = useState('sb-89a43m40169106@business.example.com');
    let [email_not_verified, setEmailNotVerified] = useState(false);
    let [payment_not_receivable, setPaymentNotReceivable] = useState(false);
    let [offboarding, setOffboarding] = useState(false);
    let [onboarding, setOnboarding] = useState(true)
    let [venmo, setVenmo] = useState(true)
    let [payLater, setPayLater] = useState(true)
    let [cc, setCC] = useState(true)
    let [appswitch, setAppSwitch] = useState(true)


    function startOffboarding() {

    }

    function unverifyMail() {
        return email_not_verified = true;
    }

    function paymentUnreceivable() {
        return payment_not_receivable = true;
    }

    async function GenerateOnboardingLink() {
        const onboardingLink = await fetch(`api/partnerreferral`, {
            method: "POST",
            mode: "same-origin",
            body: JSON.stringify({
                email: email
            })

        })
        const data = await onboardingLink.json()
        return window.open(data.data.links[1].href);
    }

    async function getOnboardingData(mail: String) {
        mail = email;
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
                            <button className="button is-black pt2" onClick={() => setOffboarding(true)}>
                                Disable PayPal
                            </button>
                        </div>
                    </div>

                    <div className="columns">

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
                            <button className="button is-danger" onClick={() => setEmailNotVerified(true)}>Mock Email is not verified</button>
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
                            <button className="button is-danger" onClick={() => setPaymentNotReceivable(true)}>Mock Payment is not receivable</button>
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



        </>
    )
}