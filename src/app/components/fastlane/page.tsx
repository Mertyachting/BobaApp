'use client'
import { useState, useEffect } from "react";
import { loadScript, PayPalNamespace } from "@paypal/paypal-js";
import { pool } from "@/app/api/db/route";



export default function Fastlane() {
    const [email, setEmail] = useState('');

    useEffect(() => {
        async function initPayPal() {
            try {
                const paypal = await loadScript({
                    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!, // Replace with your actual PayPal client ID.
                    merchantId: "7FVR66H2UYNVQ",
                    currency: "USD",
                    buyerCountry: "US",
                    components: "fastlane",
                    'data-sdk-client-token': "eyJraWQiOiJkMTA2ZTUwNjkzOWYxMWVlYjlkMTAyNDJhYzEyMDAwMiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnBheXBhbC5jb20iLCJzdWIiOiI0RVVQVVVXQlVMWktTIiwiYWNyIjpbImNsaWVudCJdLCJzY29wZSI6WyJCcmFpbnRyZWU6VmF1bHQiXSwib3B0aW9ucyI6e30sImF6IjoiY2NnMTguc2xjIiwiZXh0ZXJuYWxfaWQiOlsiUGF5UGFsOjRFVVBVVVdCVUxaS1MiLCJCcmFpbnRyZWU6aG1jY3Zuem5jdmM5am05biJdLCJleHAiOjE3NDQ2MzE5MTIsImlhdCI6MTc0NDYzMTAxMiwianRpIjoiVTJBQUt3RmxiYXJMcFZCcHhIQVdxVi10YlZxWEl3dVpQdVEyTWNZdFZQSzJEQ0RuNlFZY1ZYUnJJU005WjBESVJQazF1MmMtcnJnMEpWS1V5NlZySGpnUTByb1ZVd1JaMTN4dzd2VEVkREpyYTNfTURCQ2ZyWUo2YXFIbkE4bWciLCJjbGllbnRfaWQiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyJ9.6F2Yr1ggcNd4Gtv1NCW60kphjDUiZ4R8lu9wG-0zUIMD3sOOGr1aiGBWBw8yeJed-mDjXNTpfeb3DcLWo5BLrA"
                });

                if (!paypal || typeof paypal.Fastlane !== "function") {
                    console.error("PayPal Buttons are not available.");
                    return;
                }
                const fastlane = paypal?.Fastlane({
                    FastlanePaymentComponent, // used for quick start integration
                    FastlaneCardComponent, // used for flexible integration
                    FastlaneWatermarkComponent
                    // For more details about available options parameters, see the Reference section.
                });
                const { identity, profile } = fastlane;
                fastlane.setLocale("en_us");
            } catch (error) {
                console.log(error);
            }

        };
        initPayPal();
    }, []);
    async function CheckMail() {
        const {
            customerContextId
        } = await window.paypal?.identity.lookupCustomerByEmail(email);

        console.log(`Here is the ${customerContextId}`)

        //this variable  will turn to True if user authenticates successfully with OTP
        //will remain False by default

        let renderFastlaneMemberExperience = false;

        if (customerContextId) {
            // Email is associated with a Fastlane member or a PayPal member,
            // send customerContextId to trigger the authentication flow.
            const {
                authenticationState,
                profileData
            } = await identity.triggerAuthenticationFlow(customerContextId);

            if (authenticationState === "succeeded") {
                // Fastlane member successfully authenticated themselves
                // profileData contains their profile details 

                renderFastlaneMemberExperience = true;

                const name = profileData.name;
                const shippingAddress = profileData.shippingAddress;
                const card = profileData.card;
            } else {
                // Member failed or canceled authentication. Treat them as a guest payer
                renderFastlaneMemberExperience = false;
            }
        } else {
            // No profile found with this email address. This is a guest payer
            renderFastlaneMemberExperience = false;
        }
    }


    // Convenience parameters for calling later on






    return (
        <>
            <div className="control has-icons-left has-icons-right" style={{ width: '500px', padding: '40px' }}>
                <input className="input" type="email" placeholder="Email" onChange={event => setEmail(event.target.value)} />
                <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                </span>
                <span className="icon is-small is-right">
                    <i className="fas fa-check"></i>

                </span>
            </div >
            <h1>{email}</h1>
            <button className="button" onClick={CheckMail}>Checkmail</button>
            <div id="paypal-button-container" />
            <div id="payment-container"></div>
            <button id="submit-button">Submit Order</button>
        </>
    )
}

/*

            <Script
                src="https://www.paypal.com/sdk/js?client-id=AY3zVGgvIzykIVDw_G9ZDNoHmiDbMYYC5m1qdrT_5_8ZtAVFNtNNbv4XKfXRGVEmSPSpa30uGM1AnfkO&components=buttons,fastlane&buyer-country=US"
                data-sdk-client-token="eyJraWQiOiJkMTA2ZTUwNjkzOWYxMWVlYjlkMTAyNDJhYzEyMDAwMiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnBheXBhbC5jb20iLCJzdWIiOiI0RVVQVVVXQlVMWktTIiwiYWNyIjpbImNsaWVudCJdLCJzY29wZSI6WyJCcmFpbnRyZWU6VmF1bHQiXSwib3B0aW9ucyI6e30sImF6IjoiY2NnMTguc2xjIiwiZXh0ZXJuYWxfaWQiOlsiUGF5UGFsOjRFVVBVVVdCVUxaS1MiLCJCcmFpbnRyZWU6aG1jY3Zuem5jdmM5am05biJdLCJleHAiOjE3NDQxMDU4MzcsImlhdCI6MTc0NDEwNDkzNywianRpIjoiVTJBQUpRU0VCUmhQRl9VeVg0UzlNWjBLVk05SUUtMElMWG1yVnRia3hyeUpjemJ0M19iWnVMTlNhcGx2NmJtRnFEWkUtTXg3MDhOeEtoQzB3WXFuaXlvRzU3UmxaSVl4aDlhNEhSQmhVamxJQm5BaV91bHJLcG1pRi1pMDFOT0EiLCJjbGllbnRfaWQiOiJBWTN6Vkdndkl6eWtJVkR3X0c5WkROb0htaURiTVlZQzVtMXFkclRfNV84WnRBVkZOdE5OYnY0WEtmWFJHVkVtU1BTcGEzMHVHTTFBbmZrTyJ9.834r-SEvjgH4MiJg12icKRDReryYcZEEuYAy1BNfR4qTlt9XtC19WMCIb4HCMElsVtHLLS79ZliY96BhFLI07g"
                onReady={() => {
                    window.paypal?.Buttons().render("#paypal-button-container");
                    


                   
                }
                }
            />
*/