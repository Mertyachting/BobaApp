'use client'

import { processEnv } from "@next/env"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js/src"
import { Children } from "react"

var client_id: string = process.env.NEXT_PUBLIC_CLIENT_ID ? process.env.NEXT_PUBLIC_CLIENT_ID : 'test';
var merchant_id: string = 'DVJBG3EJV2YMJ';
var data_sdk_token: string = "eyJraWQiOiJkMTA2ZTUwNjkzOWYxMWVlYjlkMTAyNDJhYzEyMDAwMiIsInR5cCI6IkpXVCIsImFsZyI6IkVTMjU2In0.eyJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94LnBheXBhbC5jb20iLCJzdWIiOiJWRFRBN1lYUTVCVEtFIiwiYWNyIjpbImNsaWVudCJdLCJzY29wZSI6WyJCcmFpbnRyZWU6VmF1bHQiXSwib3B0aW9ucyI6e30sImF6IjoiY2NnMTguc2xjIiwiZXh0ZXJuYWxfaWQiOlsiUGF5UGFsOkRWSkJHM0VKVjJZTUoiLCJCcmFpbnRyZWU6a3Q0bnh4cDNocGcyazNjZyJdLCJleHAiOjE3NDc4MzE0MjMsImlhdCI6MTc0NzgzMDUyMywianRpIjoiVTJBQUxsNlVTVXNSaldfbDEyUHVseGQ4dmNmZzg4dHp3Y1dkemp4OVN0LUVVcHN2Qm1PcWQ5SGNvaG5LbEhGRTBrRFZKYXJvMDJKZ1RWeGxxXzN2VWtXU3pSRzV5X1ZPR2JwTVBtM0s1SVl5UW9pTDdCWlhFdGxGMm9wazdhRGciLCJjbGllbnRfaWQiOiJBU1l6WGpZQi1JMW9iTGNUYjN1QmQtVkpuUDFlQ3JKZ3lrUjMwX1JVcE9Gc1VYUUV3SFlzb29JRVJmdVdDZndEWEw5QmRIOTR1d0dKaTV6USJ9.O8WRfdgYv6JFfRcxNwSwVyOnKyOxDw6_f1Rpse1MED3l18WnvKYGiaUA-QHmwwhc8BS-9NkDiPaDhdvM61JHig"
//@ts-ignore
export default function PayPalProvider({ children }) {
    return (
        <>
            <PayPalScriptProvider options={{
                clientId: client_id,
                merchantId: merchant_id,
                components: ['fastlane', 'buttons'],
            }}>
                <PayPalButtons style={{ layout: "horizontal" }
                } >
                    {children}
                </PayPalButtons >
            </PayPalScriptProvider >
        </>

    )
}