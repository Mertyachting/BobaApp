'use client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AppSwitch from '../components/appswitch';
import { usePathname } from 'next/navigation';


const client_id = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : 'test';
const merchant_id = process.env.NEXT_PUBLIC_MERCHANT_ID ? process.env.NEXT_PUBLIC_MERCHANT_ID : 'test';

export default function Checkout() {
    const initialOptions = {
        clientId: client_id,
        currency: "USD",
        intent: "capture",
        merchantId: merchant_id,
        buyerCountry: 'US',
        'data-partner-attribution-id': "Boba",
        components: ['buttons', 'googlepay'],
        'enable-funding': ['venmo', 'paylater']
    };

    const pathname = usePathname()

    const needsV5Provider = () => {
        return pathname === '/' || pathname === '/checkout'; // your v5 pages
    };

    if (needsV5Provider()) {
        <PayPalScriptProvider
            key={pathname}
            options={initialOptions}>
            <AppSwitch />
        </PayPalScriptProvider>
    }

    return (
        <>
            <AppSwitch />

        </>
    )
}