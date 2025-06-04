// app/page.tsx
'use client'
import React from 'react';

import Script from 'next/script';
import { useState, useEffect } from 'react';
import MasterSword from '../../public/images/TotK_Master_Sword_Fused_Icon_2.png'
import Image from 'next/image';
import { NextResponse } from 'next/server';


var sdkToken = await getSDKToken();

async function getSDKToken() {
  const res = await fetch('/api/sdktoken', {
    method: "POST"
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
  var [email, setEmail] = useState('kite@lute.biz');
  var [payDisable, setPayDisable] = useState(true);

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

  function callSubmitButton() {
    return window.submitButton();
  }

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
              alert('please enter a valid email')
              return;
            }

            console.log(isEmailValid)

            //@ts-ignore
            const { customerContextId } = await NextResponse.json(identity.lookupCustomerByEmail(
              emailOne,
            ));

            let renderFastlaneMemberExperience = false;
            const {
              authenticationState,
              profileData
              //@ts-ignore
            } = await identity.triggerAuthenticationFlow(customerContextId);

            console.log(authenticationState)

            if (authenticationState === "succeeded") {
              console.log('MEMBER SUCESS')
              setPayDisable(false)
              // Fastlane member successfully authenticated themselves
              // profileData contains their profile details 

              renderFastlaneMemberExperience = true;

              const name = profileData.name;
              const shippingAddress = profileData.shippingAddress;
              const card = profileData.card;
            } else {
              // Member failed or canceled authentication. Treat them as a guest payer
              renderFastlaneMemberExperience = false;
              setPayDisable(false)
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
              console.log('THE ID IS ' + id)

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
                        "name": "Master Sword",
                        "description": "A charged Master Sword",
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
                  alert('Payment Sucess. token id: ' + id)
                }
                return res;
              }
              else (console.log('no ID found'))



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
        className="container is mobile"
      >
        <div className="columns is-gapless mt-5 mb-0">
          <div
            className="column is-2"
          >
            <input className="input" type="email" placeholder={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div
            className="column"
          >
            <button className="button is-link" onClick={() => window.lookupEmailProfile(email)}>check mail</button>
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
          </div>
          <div className="column is-half">
            <div className="box">
              <article className="media">
                <div className="media-left">
                  <figure className="image is-128x128">
                    <Image src={MasterSword} alt='product image showing the Master Sword from Zelda TOTK' fill={true}></Image>
                  </figure>
                </div>
                <div className="media-content">
                  <div className="content">
                    <h3 className='title is-3'>Order Summary</h3>
                    <p>
                      <strong>Master Sword</strong>
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
