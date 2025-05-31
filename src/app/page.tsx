// app/page.tsx
'use client'
import React from 'react';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

var sdkToken = await getSDKToken();

async function getSDKToken() {
  const res = await fetch("http://192.168.178.34:3000//api", {
    method: "POST",
    mode: "same-origin"
  })
  const data = await res.json()
  const access_token = data
  return access_token
}

declare global {
  interface Window {
    //@ts-ignore
    lookupEmailProfile;
    //@ts-ignore
    submitButton;
  }
}





export default function Home() {
  var [email, setEmail] = useState('');

  //@ts-ignore
  let identity, profile, FastlanePaymentComponent, FastlaneWatermarkComponent;
  //@ts-ignore
  let paymentComponent;

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





  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASYzXjYB-I1obLcTb3uBd-VJnP1eCrJgykR30_RUpOFsUXQEwHYsooIERfuWCfwDXL9BdH94uwGJi5zQ&merchant-id=DVJBG3EJV2YMJ&buyer-country=US&currency=USD&components=buttons,fastlane"
        data-sdk-client-token={sdkToken}
        onLoad={async () => {
          console.log(email);

          ({ identity, profile, FastlanePaymentComponent, FastlaneWatermarkComponent } =
            //@ts-ignore
            await window.paypal.Fastlane({
              // shippingAddressOptions: {
              //   allowedLocations: ['US:TX', 'US:CA', 'MX', 'CA:AB', 'CA:ON'],
              // },
              // cardOptions: {
              //   allowedBrands: ['VISA', 'MASTER_CARD'],
              // },
              styles: { root: { backgroundColor: '#faf8f5' } }
            }));

          paymentComponent = await FastlanePaymentComponent();

          const watermarkComponent = await FastlaneWatermarkComponent({
            includeAdditionalInfo: true,
          });

          watermarkComponent.render('#watermark-container');

          window.lookupEmailProfile = async function lookupEmailProfile(mail: String) {

            console.log('THE BUTTON WAS CLICKED!')
            // Checks if email is empty or in a invalid format
            let emailOne = mail;

            console.log(emailOne)

            const isEmailValid = emailOne.length > 1 ? emailOne : null;

            if (!isEmailValid) {
              return;
            }

            console.log(isEmailValid)

            //@ts-ignore
            const { customerContextId } = await identity.lookupCustomerByEmail(
              emailOne,
            );

            let renderFastlaneMemberExperience = false;
            const {
              authenticationState,
              profileData
              //@ts-ignore
            } = await identity.triggerAuthenticationFlow(customerContextId);

            console.log(authenticationState)

            if (authenticationState === "succeeded") {
              console.log('MEMBER SUCESS')
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
            //@ts-ignore
            //@ts-ignore
            const fastlanePaymentComponent = await paymentComponent;

            await fastlanePaymentComponent.render("#payment-container");
          }

          window.submitButton = async function () {
            const shippingAddress = {
              firstName: "Jen",
              lastName: "Smith",
              company: "Braintree",
              streetAddress: "1 E 1st St",
              extendedAddress: "5th Floor",
              locality: "Bartlett",
              region: "IL", // must be sent in 2-letter format
              postalCode: "60103",
              countryCodeAlpha2: "US",
              phoneNumber: "14155551212"
            }

            const options = {
              fields: {
                phoneNumber: {
                  // Example of how to prefill the phone number field in the FastlanePaymentComponent
                  prefill: "4026607986"
                }
              },
              styles: {
                root: {   //specify styles here
                  backgroundColorPrimary: "#ffffff"
                }
              }
            };
            //@ts-ignore
            const fastlanePaymentComponent = await paymentComponent;

            //@ts-ignore



            // event listener when the user clicks to place the order
            const submitButton: HTMLElement = document.getElementById("submit-button");

            submitButton.addEventListener("click", async () => {
              const { id } = await fastlanePaymentComponent.getPaymentToken();
              console.log('THE ID IS' + id)

              let payload = {
                "intent": "CAPTURE",
                "payment_source": {
                  "card": {
                    "single_use_token": id
                  }
                },
                "purchase_units": [
                  {
                    "amount": {
                      "currency_code": "USD",
                      "value": "50.00",
                      "breakdown": {
                        "item_total": {
                          "currency_code": "USD",
                          "value": "40.00"
                        },
                        "shipping": {
                          "currency_code": "USD",
                          "value": "10.00"
                        }
                      }
                    },
                    "items": [
                      {
                        "name": "Coffee",
                        "description": "1 lb Kona Island Beans",
                        "sku": "sku03",
                        "unit_amount": {
                          "currency_code": "USD",
                          "value": "40.00"
                        },
                        "quantity": "1",
                        "category": "PHYSICAL_GOODS",
                        "image_url": "https://example.com/static/images/items/1/kona_coffee_beans.jpg",
                        "url": "https://example.com/items/1/kona_coffee_beans",
                        "upc": {
                          "type": "UPC-A",
                          "code": "987654321015"
                        }
                      }
                    ],
                    "shipping": {
                      "type": "SHIPPING",
                      "name": {
                        "full_name": "Lawrence David"
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

              const res = await fetch('api/order', {
                'method': 'POST',
                'body': JSON.stringify(payload)
              })

              return res;
            });

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
        className="container"
        style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="columns is-vcentered">
          <div
            className="column is-half"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <ProductCard />
          </div>
          <div
            className="column is-half"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <input className="input" type="email" placeholder="Enter email here" onChange={(e) => setEmail(e.target.value)} />
            <button className="button is-link" onClick={() => window.lookupEmailProfile(email)}>check mail</button>
            <button className="button is-link is-dark" id="submit-button" onClick={window.submitButton}>Pay</button>
          </div>
          <div className='columns is-mobile'>
            <div className="column">
              <div id="watermark-container"></div>
            </div>
          </div>

        </div>


      </div>
      <div>
        <div id="payment-container"></div>
      </div>



    </>


  );
}
