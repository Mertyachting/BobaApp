// app/layout.tsx
import 'bulma/css/bulma.min.css';
import './globals.css';
import Image from 'next/image'


import logo from "../../public/images/Boba_Fett_icon_128x128.png"
import Link from 'next/link';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Metadata } from 'next';



const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : 'test';
const merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID ? process.env.NEXT_PUBLIC_MERCHANT_ID : 'test';


export const metadata: Metadata = {
  title: 'LOOT CAVE',
  description: 'Test App for PayPal SDK',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const initialOptions = {
    clientId: client_id,
    currency: "USD",
    intent: "capture",
    merchantId: merchant_id,
    buyerCountry: 'US',
    'data-partner-attribution-id': "Boba"
  };

  return (
    <html lang="en">
      <body>
        <title>The Amazing PayPal Partner App</title>
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" href="/">
              <Image src={logo} alt="picture of a helmet with a payments logo on it" width={64} height={64}>

              </Image>
              <h1 className='title is-3' >THE LOOT CAVE</h1>
            </Link>


            <div id="navbar" className="navbar-menu">
              <div className="navbar-start">
                <a className="navbar-item" href="./onboarding">
                  Onboarding
                </a>

                <a className="navbar-item" href='/'>
                  FastLane
                </a>
                <a className="navbar-item" href='/appswitch'>
                  AppSwitch
                </a>
              </div>
            </div>
          </div>
        </nav>
        <PayPalScriptProvider options={initialOptions}>
          {children}
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
