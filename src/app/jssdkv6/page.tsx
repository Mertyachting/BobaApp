'use client'
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Script from 'next/script';
import { Circle } from 'lucide-react';
import branded from './../payloads/vanilla_branded.json'
import alipay from './../payloads/alipay.json'
import setupVaultToken from './../payloads/setup_vault_token.json'
import vaultWithPurchase from './../payloads/vault_purchase.json'
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

    const apmHandler = () => {
        setApms(!apm)
    }
    const vaultHandler = () => {
        setVault(!vault)
        paypal_checkout()
    }

    const vaultPurchaseHandler = () => {
        setVaultPurchase(!vaultPurchase)
    }

    /*
    const paypal_checkout = async () => {
        await clientToken;
        try {
            //@ts-expect-error loaded from the script not from the package
            const sdkInstance = await window.paypal.createInstance({
                clientToken,
                components: ["paypal-payments", "venmo-payments"], // Specify the components you need
                locale: "en-US",
                pageType: "checkout",
            });
            // Check funding eligibility
            const paymentMethods = await sdkInstance.findEligibleMethods();
            const isPayPalEligible = paymentMethods.isEligible("paypal");
            const isVenmoEligible = paymentMethods.isEligible("venmo");
            // Conditionally render the PayPal button
            if (isPayPalEligible) {
                const paypalButton = document.createElement("paypal-button");
                document.querySelector("#branded-buttons").append(paypalButton);
                // Create a PayPal checkout session with event handlers
                const paypalOneTimePaymentSession =
                    sdkInstance.createPayPalOneTimePaymentSession({
                        onApprove: (data) => {
                            // Handle successful payment approval
                            console.log("Payment approved:", data);
                        },
                        onShippingAddressChange: (data) => {
                            // Handle shipping address changes
                            console.log("Shipping address changed:", data);
                        },
                        onShippingOptionsChange: (data) => {
                            // Handle updates to shipping options
                            console.log("Shipping options updated:", data);
                        },
                        onCancel: (data) => {
                            // Handle payment cancellation
                            console.warn("Payment canceled:", data);
                        },
                        onError: (error) => {
                            // Handle errors during the checkout process
                            console.error("Error during checkout:", error);
                        },

                    });
                console.log(
                    "Payment session created successfully:",
                    paypalOneTimePaymentSession
                );
                // Handle checkout flow on button click
                async function onClick() {
                    try {
                        // Attempt to start the checkout flow using a popup
                        await paypalOneTimePaymentSession.start(
                            { presentationMode: "auto" },
                            createOrder(branded)


                        );
                    } catch (error) {
                        console.error("Error starting checkout flow:", error);
                    }
                }
                // Bind the click handler to your button (example ID: "paypal-button")
                document
                    .getElementById("branded-buttons")
                    ?.addEventListener("click", onClick);
            }
            if (isVenmoEligible) {
                const paypalButton = document.createElement("venmo-button");
                document.querySelector("#branded-buttons").append(paypalButton);


            }
            console.log("SDK initialized successfully:", sdkInstance);
        } catch (error) {
            console.error("Error initializing SDK:", error);
        }

    }
        */

    // Main orchestrator function
    const paypal_checkout = async () => {
        try {
            await clientToken;
            const sdkInstance = await initializePayPalSDK();
            const eligibleMethods = await getEligiblePaymentMethods(sdkInstance);

            if (eligibleMethods.isPayPalEligible) {
                await setupPayPalButton(sdkInstance);
            }

            if (eligibleMethods.isVenmoEligible) {
                setupVenmoButton();
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
            components: ["paypal-payments", "venmo-payments"],
            locale: "en-US",
            pageType: "checkout",
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
                isVenmoEligible: paymentMethods.isEligible("venmo")
            };
        }
        else {
            const paymentMethods = await sdkInstance.findEligibleMethods();
            return {
                isPayPalEligible: paymentMethods.isEligible("paypal"),
                isVenmoEligible: paymentMethods.isEligible("venmo")
            };
        }

    };

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
            document.querySelector("#vault-button")?.append(paypalButton);
        }
        else {
            document.querySelector("#branded-buttons")?.append(paypalButton);
        }

        if (vault) {
            const paypalPaymentSession = sdkInstance.createPayPalSavePaymentSession(
                paymentSessionOptions,
            );

            console.log("Payment session created successfully:", paypalPaymentSession);

            attachPayPalClickHandler(paypalPaymentSession);

        } else {
            const paymentSession = sdkInstance.createPayPalOneTimePaymentSession(
                createPaymentEventHandlers()
            );

            console.log("Payment session created successfully:", paymentSession);

            attachPayPalClickHandler(paymentSession);
        }
    };

    // Handle PayPal button click
    const attachPayPalClickHandler = (paymentSession) => {
        if (vault) {
            const onClick = async () => {
                try {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createSetupToken(setupVaultToken)
                    );
                } catch (error) {
                    console.error("Error starting checkout flow:", error);
                }
            };
            document
                .getElementById("vault-button")
                ?.addEventListener("click", onClick);
        }
        else if (vaultPurchase) {
            const onClick = async () => {
                try {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createOrder(vaultWithPurchase)
                    );
                } catch (error) {
                    console.error("Error starting checkout flow:", error);
                }
            };
            document
                .getElementById("branded-buttons")
                ?.addEventListener("click", onClick);
        }
        else {
            const onClick = async () => {
                try {
                    await paymentSession.start(
                        { presentationMode: "auto" },
                        createOrder(branded)
                    );
                } catch (error) {
                    console.error("Error starting checkout flow:", error);
                }
            };
            document
                .getElementById("branded-buttons")
                ?.addEventListener("click", onClick);

        }



    };

    // Setup Venmo button
    const setupVenmoButton = () => {
        const venmoButton = document.createElement("venmo-button");
        document.querySelector("#branded-buttons")?.append(venmoButton);
    };


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
            {sdkTokens.data ? <Script
                id='loadv6'
                src='https://www.sandbox.paypal.com/web-sdk/v6/core'
                onLoad={async () => {
                    await paypal_checkout();
                }
                }
            >

            </Script> : <><h1>NO ACCESS TOKEN FOUND</h1></>}

            <div className="container">
                <h1 className='title is-2'>JSSDK V6 Test Page</h1>
                <div className="columns">

                    <div className="column">
                        <div id="branded-buttons">
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

                    <div className="columns">
                        <div className="column">
                            <div id="vault-button"></div>
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