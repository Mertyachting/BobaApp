'use client'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Script from 'next/script';
import { Circle } from 'lucide-react';
import branded from './../payloads/vanilla_branded.json'
import alipay from './../payloads/alipay.json'
import setupVaultToken from './../payloads/setup_vault_token.json'
import { useState } from 'react';

async function createOrder(payload: object) {
    console.log('CLICK')
    console.log(typeof (payload))
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

        const { id } = await respone.json();
        console.log(id)
        return { orderId: id };
    } catch (e) {
        console.log("create order failed " + e);

    }

}



export default function Page() {

    const queryClient = useQueryClient()
    const clientToken = queryClient.getQueryData(['sdkToken']);
    const [apm, setApms] = useState(false)
    const [vault, setVault] = useState(false)
    const [vaultPurchase, setVaultPurchase] = useState(false);
    const [layout, setLayout] = useState('');

    const sdk_token = async () => {
        const res = await fetch("api/new_access_token",
            { method: 'POST' }
        )
        const data = await res.json();
        return data.access_token;
    }

    const sdkTokens = useQuery({
        queryKey: ['sdkToken'],
        queryFn: sdk_token,
        staleTime: 9000
    })

    const user_data = async () => {
        const res = await fetch("api/user_agent",
            { method: 'GET' }
        )
        const data = await res.json();
        return data;
    }

    const userData = useQuery({
        queryKey: ['userAgent'],
        queryFn: user_data,
        staleTime: 9000
    })

    console.log()


    const shipping_body = {
        "intent": "CAPTURE",
        "payment_source": {
            "paypal": {
                "experience_context": {
                    "shipping_preference": "GET_FROM_FILE",
                    "user_action": "PAY_NOW",
                    "locale": "en-US",
                    "brand_name": "Your Name Here",
                    "return_url": "https://example.com/return",
                    "cancel_url": "https://example.com/cancel",
                    "order_update_callback_config": {
                        "callback_events": ["SHIPPING_ADDRESS"],
                        "callback_url": "https://webhooklistenerorco2024.onrender.com/callback/paypal"
                    }
                }
            }
        },
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "EUR",
                    "value": "105.00",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "EUR",
                            "value": "100.00"
                        },
                        "tax_total": {
                            "currency_code": "EUR",
                            "value": "5.00"
                        }
                    }
                },
                "items": [
                    {
                        "name": "A Premium Item",
                        "sku": "ABC12345",
                        "unit_amount": {
                            "currency_code": "EUR",
                            "value": "100.00"
                        },
                        "quantity": "1",
                        "category": "PHYSICAL_GOODS"
                    }
                ],
                "shipping": {
                    "options": [
                        {
                            "id": "1",
                            "type": "SHIPPING",
                            "label": "Free Shipping",
                            "selected": "True",
                            "amount": {
                                "currency_code": "EUR",
                                "value": "0.00"
                            }
                        },
                        {
                            "id": "2",
                            "type": "SHIPPING",
                            "label": "USPS Priority Shipping",
                            "selected": "False",
                            "amount": {
                                "currency_code": "EUR",
                                "value": "10.00"
                            }
                        },
                        {
                            "id": "3",
                            "amount": {
                                "currency_code": "EUR",
                                "value": "10.00"
                            },
                            "type": "SHIPPING",
                            "label": "1-Day Shipping",
                            "selected": "False"
                        }
                    ]
                },
                "invoice_id": "67e55127139b2",
                "description": "35345345345"
            }
        ]
    }
    const request_body = {

        "intent": "CAPTURE",
        "invoice_id": "XYZ12315223",
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
                /* commented out because of shipping callback
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
                */
                "custom_id": "HelloHomer"
            }
        ],
        "payment_source": {
            "paypal": {
                "email_address": "sb-srp47a45272330@personal.example.com",
                "experience_context": {
                    "cancel_url": "http://localhost:3000/jssdkv6",
                    "return_url": "http://localhost:3000/jssdkv6",
                    "shipping_preference": "GET_FROM_FILE",
                    "user_action": "PAY_NOW",
                    "order_update_callback_config": {
                        "callback_events": ["SHIPPING_ADDRESS"],
                        "callback_url": "https://webhooklistenerorco2024.onrender.com/callback/paypal"
                    },
                    "app_switch_context": {
                        "mobile_web": {
                            "return_flow": "AUTO",
                            "buyer_user_agent": userData.data?.network?.userAgent
                        }
                    }
                }
            }
        }
    }

    async function createSetupToken(payload: object) {
        console.log('CLICK setup token')
        console.log(typeof (payload))
        try {
            const respone = await fetch(`/api/setupVaultToken`, {
                method: "POST",
                mode: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify(payload),
            })

            const { id } = await respone.json();
            console.log(id)
            return { setupToken: id };
        } catch (e) {
            console.log("create order failed " + e);

        }
    }
    //@ts-expect-error abc
    async function createPaymentToken(vaultSetupToken) {
        try {
            const response = await fetch("/api/payment_token", {
                method: "POST",
                mode: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "payment_source": {
                        "token": {
                            "id": vaultSetupToken,
                            "type": "SETUP_TOKEN"
                        }
                    }
                }),
            });
            const data = await response.json();
            console.log(data)

            return data;
        }
        catch (e) {
            console.log("create order failed " + e);

        }
    }

    const apmHandler = () => {
        setApms(!apm)
    }

    const vaultHandler = () => {
        setVault(!vault)
    }

    const vaultPurchaseHandler = () => {
        setVaultPurchase(!vaultPurchase)
    }

    // Main orchestrator function
    const paypal_checkout = async () => {
        try {
            await clientToken;
            const sdkInstance = await initializePayPalSDK();
            const eligibleMethods = await getEligiblePaymentMethods(sdkInstance);
            await initiateMessages(sdkInstance)

            if (eligibleMethods.isPayPalEligible) {
                await setupPayPalButton(sdkInstance);
            }

            if (eligibleMethods.isVenmoEligible) {
                await setupVenmoButton(sdkInstance);
            }
            await setupApplePayButton(sdkInstance);
            await setupVaultButton(sdkInstance);

            if (eligibleMethods.isPayLaterEligible) {
                const paylaterPaymentMethodDetails =
                    eligibleMethods.payLaterDetails;
                setupPayLaterButton(sdkInstance, paylaterPaymentMethodDetails);
            }

            console.log("SDK initialized successfully:", sdkInstance);
        } catch (error) {
            console.error("Error initializing PayPal checkout:", error);
        }
    };



    // Initialize PayPal SDK
    const initializePayPalSDK = async () => {
        //@ts-expect-error loaded from the script not from the package
        return await window.paypal.createInstance({
            clientToken,
            components: [
                "paypal-payments",
                "venmo-payments",
                "paypal-messages",
                "applepay-payments",
                "googlepay-payments",
                "fastlane"
            ],
            locale: "en-US",
            testBuyerCountry: "US",
            pageType: "checkout",
            partnerAttributionId: "Xur_PPCP"
        });
    };

    // Check payment method eligibility
    //@ts-expect-error abc
    const getEligiblePaymentMethods = async (sdkInstance) => {

        if (vault) {
            const paymentMethods = await sdkInstance.findEligibleMethods(
                {
                    paymentFlow: "VAULT_WITHOUT_PAYMENT",
                    currencyCode: "USD"
                }
            );
            return {
                isPayPalEligible: paymentMethods.isEligible("paypal"),
                isPayLaterEligible: paymentMethods.isEligble("paylater"),
                isVenmoEligible: paymentMethods.isEligible("venmo"),
                payLaterDetails: paymentMethods.getDetails("paylater")
            };
        }
        else {
            const paymentMethods = await sdkInstance.findEligibleMethods();
            return {
                isPayPalEligible: paymentMethods.isEligible("paypal"),
                isVenmoEligible: paymentMethods.isEligible("venmo"),
                isPayLaterEligible: paymentMethods.isEligible("paylater"),
                payLaterDetails: paymentMethods.getDetails("paylater")
            };
        }

    };
    //@ts-expect-error abc
    const initiateMessages = async (sdkInstance) => {
        const messagesInstance = sdkInstance.createPayPalMessages();
        const messageElement = document.querySelector('paypal-message');
        await messagesInstance.fetchContent({
            amount: "300.00",
            currencyCode: "USD",
            layout: layout,
            //@ts-expect-error abc
            onReady: (content) => messageElement.setContent(content),
        });
    }



    // Create payment session event handlers
    const createPaymentEventHandlers = () => ({
        //@ts-expect-error abc
        onApprove: (data) => {
            console.log("Payment approved:", data);
        },
        //@ts-expect-error abc
        onShippingAddressChange: (data) => {
            console.log("Shipping address changed:", data);
        },
        //@ts-expect-error abc
        onShippingOptionsChange: (data) => {
            console.log("Shipping options updated:", data);
        },
        //@ts-expect-error abc
        onCancel: (data) => {
            console.warn("Payment canceled:", data);
        },
        //@ts-expect-error abc
        onError: (error) => {
            console.error("Error during checkout:", error);
        },
    });

    const paymentSessionOptions = {
        //@ts-expect-error abc
        async onApprove(data) {
            console.log("onApprove", data);
            const createPaymentTokenResponse = await createPaymentToken(
                data.vaultSetupToken,
            );
            console.log("Create payment token response: ", createPaymentTokenResponse);
        },
        //@ts-expect-error abc
        onCancel(data) {
            console.log("onCancel", data);
        },
        //@ts-expect-error abc
        onError(error) {
            console.log("onError", error);
        },
    };

    // Setup PayPal button and payment session
    //@ts-expect-error abc
    const setupPayPalButton = async (sdkInstance) => {

        const paymentSession = sdkInstance.createPayPalOneTimePaymentSession(
            createPaymentEventHandlers()
        );
        console.log("One-time payment session created successfully:", paymentSession);

        attachPayPalClickHandler(paymentSession);
    };
    //@ts-expect-error abc
    const setupVaultButton = async (sdkInstance) => {

        const paymentSession = sdkInstance.createPayPalSavePaymentSession(
            paymentSessionOptions,
        );
        console.log("Vault payment session created successfully:", paymentSession);
        attachVaultClickHandler(paymentSession);
    };
    //@ts-expect-error abc

    const attachVaultClickHandler = (paymentSession) => {
        const vaultButton = document.querySelector('#vault-button');

        const onClick = async () => {
            try {
                await paymentSession.start(
                    { presentationMode: "auto" },
                    createSetupToken(setupVaultToken)
                );
            }
            catch (error) {
                console.error("Error starting checkout flow:", error);
            }

        }

        vaultButton?.addEventListener("click", onClick);
    }

    // Handle PayPal button click
    //@ts-expect-error abc
    const attachPayPalClickHandler = (paymentSession) => {


        const brandedButtons = document.querySelector('#branded-buttons');

        const onClick = async () => {
            try {

                await paymentSession.start(
                    { presentationMode: "auto" },
                    createOrder(shipping_body)
                );

            } catch (error) {
                console.error("Error starting checkout flow:", error);
            }
        };
        // Add event listener to the appropriate container
        brandedButtons?.addEventListener("click", onClick);
    };

    // Setup Venmo button
    //@ts-expect-error abc
    const setupVenmoButton = async (sdkInstance) => {

        const paymentSessionOptions = {
            //@ts-expect-error abc
            async onApprove(data) {
                console.log("Payment approved:", data);
                try {
                    const orderData = await captureOrder({
                        orderId: data.orderId,
                    });
                    console.log("Payment captured successfully:", orderData);
                } catch (error) {
                    console.error("Payment capture failed:", error);
                }
            },
            //@ts-expect-error abc

            onCancel(data) {
                console.log("Payment cancelled:", data);

            },
            //@ts-expect-error abc
            onError(error) {
                console.error("Payment error:", error);

            },
        };

        const paymentSession = sdkInstance.createVenmoOneTimePaymentSession(
            paymentSessionOptions,
        );
        const venmoButton = document.querySelector("#venmo-button");

        const onClick = async () => {
            try {

                await paymentSession.start(
                    { presentationMode: "auto" },
                    createOrder(request_body)
                );

            } catch (error) {
                console.error("Error starting checkout flow:", error);
            }
        };
        venmoButton?.addEventListener("click", onClick);


    };
    //@ts-expect-error abc
    async function setupPayLaterButton(sdkInstance, paylaterPaymentMethodDetails) {
        const paylaterPaymentSession =
            sdkInstance.createPayLaterOneTimePaymentSession(paymentSessionOptions);

        const { productCode, countryCode } = paylaterPaymentMethodDetails;
        const paylaterButton = document.querySelector("#paylater-button");
        //@ts-expect-error abc
        paylaterButton.productCode = productCode;
        //@ts-expect-error abc
        paylaterButton.countryCode = countryCode;
        //@ts-expect-error abc
        paylaterButton.removeAttribute("hidden");
        //@ts-expect-error abc
        paylaterButton.addEventListener("click", async () => {
            try {
                await paylaterPaymentSession.start(
                    { presentationMode: "auto" },
                    createOrder(branded),
                );
            } catch (error) {
                console.error(error);
            }
        });
    }

    // Setup ApplePay Button
    //@ts-expect-error abc
    async function setupApplePayButton(sdkInstance) {
        console.log("Apple Pay Button Load")
        try {
            const paypalSdkApplePayPaymentSession =
                await sdkInstance.createApplePayOneTimePaymentSession();
            console.log("Apple Pay Button Load 1")

            const { merchantCapabilities, supportedNetworks } =
                await paypalSdkApplePayPaymentSession.config();

            console.log("Apple Pay Button Load config")

            //@ts-expect-error its not null
            document.getElementById("apple-pay-button").addEventListener("click", onClick);

            console.log('button')

            async function onClick() {
                const paymentRequest = {
                    countryCode: "US",
                    currencyCode: "USD",
                    merchantCapabilities,
                    supportedNetworks,
                    requiredBillingContactFields: [
                        "name",
                        "phone",
                        "email",
                        "postalAddress",
                    ],
                    requiredShippingContactFields: [],
                    total: {
                        label: "Demo (Card is not charged)",
                        amount: "100.00",
                        type: "final",
                    },
                };
                console.log("Apple Pay Button Load 2")
                console.log("Creating Apple Pay SDK session...");
                //@ts-expect-error abc
                const appleSdkApplePayPaymentSession = new ApplePaySession(
                    4,
                    paymentRequest,
                );
                //@ts-expect-error abc
                appleSdkApplePayPaymentSession.onvalidatemerchant = (event) => {
                    console.log("Validating Apple Pay merchant & domain...");
                    paypalSdkApplePayPaymentSession
                        .validateMerchant({
                            validationUrl: event.validationURL,
                        })
                        //@ts-expect-error abc
                        .then((payload) => {
                            appleSdkApplePayPaymentSession.completeMerchantValidation(
                                payload.merchantSession,
                            );
                            console.log("Completed merchant validation");
                        })
                        //@ts-expect-error abc
                        .catch((err) => {
                            console.log("Paypal validatemerchant error", err);
                            console.error(err);
                            appleSdkApplePayPaymentSession.abort();
                        });
                };

                appleSdkApplePayPaymentSession.onpaymentmethodselected = () => {
                    appleSdkApplePayPaymentSession.completePaymentMethodSelection({
                        newTotal: paymentRequest.total,
                    });
                    console.log("Completed payment method selection");
                };
                //@ts-expect-error abc
                appleSdkApplePayPaymentSession.onpaymentauthorized = async (event) => {
                    try {
                        console.log("Apple Pay authorized... \nCreating PayPal order...");
                        //@ts-expect-error abc
                        const createdOrder = await createOrder();
                        console.log(
                            "Confirming PayPal order with applepay payment source...",
                        );

                        await paypalSdkApplePayPaymentSession.confirmOrder({
                            //@ts-expect-error abc
                            orderId: createdOrder.orderId,
                            token: event.payment.token,
                            billingContact: event.payment.billingContact,
                            shippingContact: event.payment.shippingContact,
                        });

                        console.log(
                            `Capturing order ${JSON.stringify(createdOrder, null, 2)}...`,
                        );
                        //@ts-expect-error abc
                        const orderData = await captureOrder({
                            //@ts-expect-error abc
                            orderId: createdOrder.orderId,
                            fundingSource: "applepay",
                            headers: { "X-CSRF-TOKEN": "<%= csrfToken %>" },
                        });
                        console.log(JSON.stringify(orderData, null, 2));
                        console.log("Completed Apple Pay SDK session with STATUS_SUCCESS...");
                        appleSdkApplePayPaymentSession.completePayment({
                            //@ts-expect-error abc
                            status: window.ApplePaySession.STATUS_SUCCESS,
                        });
                    } catch (err) {
                        console.error(err);
                        appleSdkApplePayPaymentSession.completePayment({
                            //@ts-expect-error abc
                            status: window.ApplePaySession.STATUS_FAILURE,
                        });
                    }
                };

                appleSdkApplePayPaymentSession.oncancel = () => {
                    console.log("Apple Pay Canceled!");
                };

                appleSdkApplePayPaymentSession.begin();
            }
        } catch (error) {
            console.error(error);
        }
    }
    //@ts-expect-error abc
    const messagingCallback = (data) => {
        console.log('data is: ', data.config)
        setLayout(data.config)
        console.log(layout)
        paypal_checkout()

    }

    function messagingConfig() {
        //@ts-expect-error abc
        window.merchantConfigurators?.Messaging({
            styleOverrides: {
                button: 'buttonOverride',
                header: 'headerOverride'
            },
            config: {},
            locale: 'en-US',
            merchantIdentifier: process.env.NEXT_PUBLIC_MERCHANT_ID,
            partnerClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            partnerName: 'Xur',
            bnCode: 'Xur_PPCP',
            onSave: messagingCallback,
            placements: ['product', 'checkout', 'cart']
        });
    }


    return (
        <>
            {sdkTokens.isPending ? (
                <>
                    <div className="container">
                        <div className="notification is-primary loading-animation">
                            <h4 className='title is-4'>Loading SDK token <Circle /> </h4>
                        </div>
                    </div>
                </>)
                : <> </>
            }
            {sdkTokens.data ?

                <>
                    <Script
                        id='loadv6'
                        src='https://www.sandbox.paypal.com/web-sdk/v6/core'
                        onLoad={async () => {
                            await paypal_checkout();
                        }
                        }
                    >
                    </Script>

                    <Script id='applePay' src='https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js'>
                    </Script>

                    <Script
                        id='messagingConfigurator'
                        src='https://www.paypalobjects.com/merchant-library/merchant-configurator.js'
                        onLoad={() => messagingConfig()}
                        defer>

                    </Script>
                </>



                : <><h1>NO ACCESS TOKEN FOUND</h1></>}

            <div className="container">
                <h1 className='title is-2'>JSSDK V6 Test Page</h1>
                <div className="columns">

                    <div className="column">
                        <div>
                            <paypal-button id="branded-buttons" type="buynow" ></paypal-button>
                        </div>
                        <div id="paypal-message">
                            <paypal-message>
                            </paypal-message>
                        </div>

                    </div>

                    <div className="column">
                        <label id="apms" className="checkbox">
                            <input type="checkbox" checked={apm} onChange={apmHandler} />
                            Alternative Payment Methods
                        </label>
                        <div>
                            <label id="Vault without purchase" className="checkbox">
                                <input type="checkbox" checked={vault} onChange={vaultHandler} />
                                Vault without purchase
                            </label>
                        </div>
                        <div>
                            <label id="Vault with purchase" className="checkbox">
                                <input type="checkbox" checked={vaultPurchase} onChange={vaultPurchaseHandler} />
                                Vault with purchase
                            </label>
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <paypal-pay-later-button
                            id="paylater-button"
                            hidden
                        ></paypal-pay-later-button>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div  >
                            <paypal-button id="vault-button" type="subscribe"></paypal-button>
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <venmo-button id="venmo-button"></venmo-button>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div id="apple-apple-pay-button-container">
                            <apple-pay-button id="apple-pay-button" buttonstyle="black" type="buy" locale="en"></apple-pay-button>
                        </div>
                    </div>
                </div>
                {apm ?

                    <>
                        <div className="columns">
                            <div className="column">
                                <button className="button is-primary" onClick={() => createOrder(alipay)}>AliPay</button>
                            </div>
                        </div>
                    </>

                    : <>
                    </>}

                <div className="columns">
                    <div className="column has-background-light">
                        <div id="messaging-configurator"></div>
                    </div>
                </div>
            </div >
        </>
    )
}