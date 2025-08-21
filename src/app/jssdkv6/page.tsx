'use client'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Script from 'next/script';
import { Circle } from 'lucide-react';
import branded from './../payloads/vanilla_branded.json'
import alipay from './../payloads/alipay.json'
import setupVaultToken from './../payloads/setup_vault_token.json'
import vaultWithPurchase from './../payloads/vault_purchase.json'
import { useState, useEffect, useRef } from 'react';

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

    // Add refs to track button containers and cleanup
    const brandedButtonsRef = useRef(null);
    const vaultButtonRef = useRef(null);
    const paymentSessionRef = useRef(null);
    const sdkInstanceRef = useRef(null);

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

    // Cleanup function to remove buttons and event listeners
    const cleanupButtons = () => {
        // Remove all existing buttons
        if (brandedButtonsRef.current) {
            brandedButtonsRef.current.innerHTML = '';
            // Remove event listeners by cloning the node
            const newNode = brandedButtonsRef.current.cloneNode(true);
            brandedButtonsRef.current.parentNode?.replaceChild(newNode, brandedButtonsRef.current);
            brandedButtonsRef.current = newNode;
        }

        if (vaultButtonRef.current) {
            vaultButtonRef.current.innerHTML = '';
            // Remove event listeners by cloning the node
            const newNode = vaultButtonRef.current.cloneNode(true);
            vaultButtonRef.current.parentNode?.replaceChild(newNode, vaultButtonRef.current);
            vaultButtonRef.current = newNode;
        }

        // Clear payment session reference
        paymentSessionRef.current = null;
    };

    const apmHandler = () => {
        setApms(!apm)
    }

    const vaultHandler = () => {
        setVault(!vault)
    }

    const vaultPurchaseHandler = () => {
        setVaultPurchase(!vaultPurchase)
    }

    // Effect to reload buttons when checkbox states change
    useEffect(() => {
        if (sdkInstanceRef.current && clientToken) {
            cleanupButtons();
            setTimeout(() => {
                paypal_checkout();
            }, 100); // Small delay to ensure cleanup is complete
        }
    }, [vault, vaultPurchase]); // Reload when these states change

    // Main orchestrator function
    const paypal_checkout = async () => {
        try {
            await clientToken;
            const sdkInstance = await initializePayPalSDK();
            sdkInstanceRef.current = sdkInstance;
            const eligibleMethods = await getEligiblePaymentMethods(sdkInstance);
            const messagesForPayLater = await initiateMessages(sdkInstance)

            if (eligibleMethods.isPayPalEligible) {
                await setupPayPalButton(sdkInstance);
            }

            if (eligibleMethods.isVenmoEligible) {
                await setupVenmoButton(sdkInstance);
            }
            await setupApplePayButton(sdkInstance)

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

    const initiateMessages = async (sdkInstance) => {
        const messagesInstance = sdkInstance.createPayPalMessages();
        const messageElement = document.querySelector('paypal-message');
        const content = await messagesInstance.fetchContent({
            amount: "300.00",
            currencyCode: "USD",
            onReady: (content) => messageElement.setContent(content),
        });
        function triggerAmountUpdate(amount) {
            content.update({ amount });
        }
    }



    // Create payment session event handlers
    const createPaymentEventHandlers = () => ({
        onApprove: (data) => {
            console.log("Payment approved:", data);
        },
        onShippingAddressChange: (data) => {
            console.log("Shipping address changed:", data);
        },
        onShippingOptionsChange: (data) => {
            console.log("Shipping options updated:", data);
        },
        onCancel: (data) => {
            console.warn("Payment canceled:", data);
        },
        onError: (error) => {
            console.error("Error during checkout:", error);
        },
    });

    const paymentSessionOptions = {
        async onApprove(data) {
            console.log("onApprove", data);
            const createPaymentTokenResponse = await createPaymentToken(
                data.vaultSetupToken,
            );
            console.log("Create payment token response: ", createPaymentTokenResponse);
        },
        onCancel(data) {
            console.log("onCancel", data);
        },
        onError(error) {
            console.log("onError", error);
        },
    };

    // Setup PayPal button and payment session
    const setupPayPalButton = async (sdkInstance) => {
        const paypalButton = document.createElement("paypal-button");

        if (vault) {
            vaultButtonRef.current?.append(paypalButton);
        } else {
            brandedButtonsRef.current?.append(paypalButton);
        }

        let paymentSession;
        if (vault) {
            paymentSession = sdkInstance.createPayPalSavePaymentSession(
                paymentSessionOptions,
            );
            console.log("Vault payment session created successfully:", paymentSession);
        } else {
            paymentSession = sdkInstance.createPayPalOneTimePaymentSession(
                createPaymentEventHandlers()
            );
            console.log("One-time payment session created successfully:", paymentSession);
        }

        paymentSessionRef.current = paymentSession;
        attachPayPalClickHandler(paymentSession);
    };

    // Handle PayPal button click
    const attachPayPalClickHandler = (paymentSession) => {
        const onClick = async () => {
            try {
                if (vault) {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createSetupToken(setupVaultToken)
                    );
                } else if (vaultPurchase) {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createOrder(vaultWithPurchase)
                    );
                } else {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createOrder(branded)
                    );
                }
            } catch (error) {
                console.error("Error starting checkout flow:", error);
            }
        };

        // Add event listener to the appropriate container
        if (vault) {
            vaultButtonRef.current?.addEventListener("click", onClick);
        } else {
            brandedButtonsRef.current?.addEventListener("click", onClick);
        }
    };

    // Setup Venmo button
    const setupVenmoButton = async (sdkInstance) => {
        const venmoButton = document.createElement("venmo-button");
        brandedButtonsRef.current?.append(venmoButton);
    };

    async function setupPayLaterButton(sdkInstance, paylaterPaymentMethodDetails) {
        const paylaterPaymentSession =
            sdkInstance.createPayLaterOneTimePaymentSession(paymentSessionOptions);

        const { productCode, countryCode } = paylaterPaymentMethodDetails;
        const paylaterButton = document.querySelector("#paylater-button");

        paylaterButton.productCode = productCode;
        paylaterButton.countryCode = countryCode;
        paylaterButton.removeAttribute("hidden");

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
                let appleSdkApplePayPaymentSession = new ApplePaySession(
                    4,
                    paymentRequest,
                );

                appleSdkApplePayPaymentSession.onvalidatemerchant = (event) => {
                    console.log("Validating Apple Pay merchant & domain...");
                    paypalSdkApplePayPaymentSession
                        .validateMerchant({
                            validationUrl: event.validationURL,
                        })
                        .then((payload) => {
                            appleSdkApplePayPaymentSession.completeMerchantValidation(
                                payload.merchantSession,
                            );
                            console.log("Completed merchant validation");
                        })
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

                appleSdkApplePayPaymentSession.onpaymentauthorized = async (event) => {
                    try {
                        console.log("Apple Pay authorized... \nCreating PayPal order...");
                        const createdOrder = await createOrder();
                        console.log(
                            "Confirming PayPal order with applepay payment source...",
                        );

                        await paypalSdkApplePayPaymentSession.confirmOrder({
                            orderId: createdOrder.orderId,
                            token: event.payment.token,
                            billingContact: event.payment.billingContact,
                            shippingContact: event.payment.shippingContact,
                        });

                        console.log(
                            `Capturing order ${JSON.stringify(createdOrder, null, 2)}...`,
                        );
                        const orderData = await captureOrder({
                            orderId: createdOrder.orderId,
                            fundingSource: "applepay",
                            headers: { "X-CSRF-TOKEN": "<%= csrfToken %>" },
                        });
                        console.log(JSON.stringify(orderData, null, 2));
                        console.log("Completed Apple Pay SDK session with STATUS_SUCCESS...");
                        appleSdkApplePayPaymentSession.completePayment({
                            status: window.ApplePaySession.STATUS_SUCCESS,
                        });
                    } catch (err) {
                        console.error(err);
                        appleSdkApplePayPaymentSession.completePayment({
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
                </>



                : <><h1>NO ACCESS TOKEN FOUND</h1></>}

            <div className="container">
                <h1 className='title is-2'>JSSDK V6 Test Page</h1>
                <div className="columns">

                    <div className="column">
                        <div >
                            <paypal-button id="branded-buttons" ref={brandedButtonsRef} type="buynow" ></paypal-button>
                        </div>
                        <div id="paypal-message">
                            <paypal-message></paypal-message>
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
                            <paypal-button id="vault-button" ref={vaultButtonRef} type="subscribe" ></paypal-button>
                        </div>
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


            </div>



        </>
    )
}