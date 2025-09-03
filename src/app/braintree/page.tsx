'use client'
import FastLaneBT from '../components/fastlane-bt';


export default function Braintree() {
    /*
      const initialOptions = {
          clientId: client_id,
          currency: "USD",
          intent: "capture",
          merchantId: merchant_id,
          buyerCountry: 'US',
          'data-partner-attribution-id': "Boba",
          components: ['buttons', 'googlepay'],
          'enable-funding': 'venmo'
      };
  
  
  */
    return (
        <>
            <FastLaneBT />
        </>
    )
}