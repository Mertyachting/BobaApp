'use client'

import React from 'react';

import Script from 'next/script';
import { useState } from 'react';
import MasterSword from '../../../public/images/CoffeeBeans.png'
import Image from 'next/image';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Circle } from 'lucide-react';









declare global {
    interface Window {
        //@ts-expect-error its hard coded
        lookupEmailProfile;
        //@ts-expect-error its hard coded
        submitButton;
    }
}


interface BillingAddo {
    addressLine1: string,
    addressLine2: string,
    adminArea1: string,
    adminArea2: string;
    postalCode: string,
    countryCode: string
    phone: Phone;
};

interface Phone {
    nationalNumber: string;
    countryCode: string;
};



export default function FastLane() {


    const sdk_token = async () =>
        fetch("api/sdktoken", { method: 'POST' })
            .then((response) => response.json());



    const [email, setEmail] = useState('kite@lute.biz');
    const [payDisable, setPayDisable] = useState(true);
    const [billing, setBilling] = useState({});

    //@ts-expect-error its hard coded 
    let identity, FastlanePaymentComponent, FastlaneWatermarkComponent;
    //@ts-expect-error its hard coded
    let paymentComponent;
    /*
    let addressSummary;
    let shippingAddressForm;
    let isShippingRequired;
    let isDisabled;
    let checkoutForm;

    let name;
    let deviceData;
    let paymentToken;
    let shippingAddress;
    let memberAuthenticatedSuccessfully = false;
    */

    function callSubmitButton() {
        window.submitButton();
    }

    const {
        data,
        isPending,
        error,
    } = useQuery({
        queryKey: ["sdk_tokens"],
        queryFn: async () => sdk_token()
    });

    if (isPending) return (
        <div className="container">
            <div className="notification is-primary">
                <Circle />
                <h4 className='title is-4'>Loading ...</h4>
            </div>
        </div>)

    if (error) return 'An error has occurred: ' + error.message

    return (

        <>
            <Script
                src="https://www.paypal.com/sdk/js?client-id=ASYzXjYB-I1obLcTb3uBd-VJnP1eCrJgykR30_RUpOFsUXQEwHYsooIERfuWCfwDXL9BdH94uwGJi5zQ&merchant-id=DVJBG3EJV2YMJ&buyer-country=US&currency=USD&components=buttons,fastlane"
                strategy="lazyOnload"
                data-sdk-client-token={data.access_token}
                onLoad={async () => {
                    ({ identity, FastlanePaymentComponent, FastlaneWatermarkComponent } =
                        //@ts-expect-error its hard coded
                        await window.paypal.Fastlane({
                            // shippingAddressOptions: {
                            //   allowedLocations: ['US:TX', 'US:CA', 'MX', 'CA:AB', 'CA:ON'],
                            // },
                            // cardOptions: {
                            //   allowedBrands: ['VISA', 'MASTER_CARD'],
                            // },
                            styles: { root: { backgroundColor: '#faf8f5' } }
                        }));

                    console.log('here 1')

                    paymentComponent = await FastlanePaymentComponent();

                    const watermarkComponent = await FastlaneWatermarkComponent({
                        includeAdditionalInfo: true,
                    });

                    watermarkComponent.render('#watermark-container');

                    window.lookupEmailProfile = async function lookupEmailProfile(mail: string, billing_address: BillingAddo) {

                        console.log('THE BUTTON WAS CLICKED!')
                        // Checks if email is empty or in a invalid format
                        const emailOne = mail;

                        console.log("The email is" + emailOne)

                        const isEmailValid = emailOne.length > 1 ? emailOne : null;

                        if (!isEmailValid) {
                            alert('please enter a valid email')
                            return;
                        }

                        console.log(isEmailValid)

                        //@ts-expect-error its hard coded
                        const { customerContextId } = await identity.lookupCustomerByEmail(
                            emailOne,
                        );

                        let renderFastlaneMemberExperience = false;
                        const {
                            authenticationState,
                            profileData
                            //@ts-expect-error its hard coded
                        } = await identity.triggerAuthenticationFlow(customerContextId);

                        if (authenticationState === "succeeded") {
                            console.log('MEMBER SUCCESS')
                            setPayDisable(false)
                            // Fastlane member successfully authenticated themselves
                            // profileData contains their profile details 

                            renderFastlaneMemberExperience = true;
                            /*
                                                        const name = profileData.name;
                                                        const shippingAddress = profileData.shippingAddress;
                                                        const card = profileData.card;
                                                        */

                            console.log(authenticationState)
                            //billing_address = setBilling_address(profileData.card);
                            billing_address = profileData.card.paymentSource.card.billingAddress

                            setBilling(billing_address)
                            console.log(profileData.card.paymentSource.card.billingAddress)

                        } else {
                            // Member failed or canceled authentication. Treat them as a guest payer
                            setPayDisable(false)
                            return renderFastlaneMemberExperience

                        }
                        //@ts-expect-error its hard coded
                        const fastlanePaymentComponent = await paymentComponent;

                        await fastlanePaymentComponent.render("#payment-container");
                    }

                    window.submitButton = async function () {
                        //@ts-expect-error its hard coded
                        const fastlanePaymentComponent = await paymentComponent;

                        // event listener when the user clicks to place the order

                        const { id } = await fastlanePaymentComponent.getPaymentToken();
                        console.log('THE ID IS ' + id)
                        const payload = {
                            "intent": "CAPTURE",
                            "payment_source": {
                                "card": {
                                    "single_use_token": id,
                                    "experience_context": {
                                        "return_url": "http://192.168.178.34:3000/success"
                                    }
                                }
                            },
                            "purchase_units": [
                                {
                                    "amount": {
                                        "currency_code": "USD",
                                        "value": "309.99",
                                        "breakdown": {
                                            "item_total": {
                                                "currency_code": "USD",
                                                "value": "299.99"
                                            },
                                            "shipping": {
                                                "currency_code": "USD",
                                                "value": "10.00"
                                            }
                                        }
                                    },
                                    "items": [
                                        {
                                            "name": "Beyond Coffee",
                                            "description": "PayPal Special branded Coffee",
                                            "sku": "sku01",
                                            "unit_amount": {
                                                "currency_code": "USD",
                                                "value": "299.99"
                                            },
                                            "quantity": "1",
                                            "category": "PHYSICAL_GOODS",
                                            "image_url": "https://example.com/static/images/items/1/kona_coffee_beans.jpg",
                                            "url": "https://example.com/items/1/kona_coffee_beans",
                                        }
                                    ],
                                    "shipping": {
                                        "type": "SHIPPING",
                                        "name": {
                                            "full_name": "Steve Mobbs"
                                        },
                                        "address": {
                                            "address_line_1": "585 Moreno Ave",
                                            "admin_area_2": "Los Angeles",
                                            "admin_area_1": "CA", //must be sent in 2-letter format
                                            "postal_code": "90049",
                                            "country_code": "US"
                                        },
                                        "phone_number": {
                                            "country_code": "1",
                                            "national_number": "5555555555"
                                        }
                                    }
                                }
                            ]
                        }

                        if (await id) {
                            const res = await fetch('api/order', {
                                'method': 'POST',
                                'body': JSON.stringify(payload)
                            })

                            if (res.status === 200) {
                                /*
                                const billing_address = await res.json();
                                console.log('THE ID IS ' + JSON.stringify(billing_address.payment_source.card.bin_details))
                                */
                                redirect('/success')
                            }


                            return NextResponse.json(res);
                        }
                        else (console.log('no ID found'))
                            ;
                    }
                }
                }
                onError={(e) => {
                    console.error('Script failed to load', e)
                }}
            />
            <link rel="preload" href="https://www.paypalobjects.com/fastlane-v1/assets/fastlane-with-tooltip_en_sm_light.0808.svg" as="image" type="image/avif" />
            <link rel="preload" href="https://www.paypalobjects.com/fastlane-v1/assets/fastlane_en_sm_light" />

            <div
                className="container is mobile"
            >
                <h1 className='title is-1 pt-6 pb-3'>FastLane Checkout Experience</h1>
                <div className="columns is-gapless mt-5 mb-0">
                    <div
                        className="column is-2"
                    >
                        <input className="input" type="email" placeholder={email} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div
                        className="column"
                    >
                        <button className="button is-link" onClick={() => window.lookupEmailProfile(email, billing)}>check mail</button>
                    </div>
                </div>
                <div className='columns'>
                    <div className="column is-offset-2" id="watermark-container">
                    </div>
                </div>

            </div >
            <div className="container is-mobile">
                <div className="columns is-multiline">
                    <div className='column is-half'>
                        <div className='column is narrow' id="payment-container"></div>
                        {billing ?
                            <>
                                <div className="columns">
                                    <div className="box">
                                        <h1 className='title is-4'>Billing Address</h1>
                                        <ul>
                                            <b>
                                                <li>Street: {billing.addressLine1}</li>
                                                <li>{billing.addressLine2}</li>
                                                <li>State: {billing.adminArea1}</li>
                                                <li>Area: {billing.adminArea2}</li>
                                                <li>Country Code: {billing.countryCode}</li>
                                                <li>Postal Code: {billing.postalCode}</li>
                                            </b>
                                        </ul>
                                    </div>
                                </div>
                            </>

                            : <div></div>}
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
                        <button className="button is-link is-large is-fullwidth" id="submit-button" onClick={callSubmitButton} disabled={payDisable}>Pay</button>
                    </div>

                </div>
            </div>

        </>
    );

}