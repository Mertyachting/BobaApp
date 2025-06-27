import PayPalProvider from "../paypalprovider"

export default function FastlaneLayout({ children }: { children: React.ReactNode }) {
    console.log("LAYOUT LOADED")
    return (
        <PayPalProvider>
            {children}
        </PayPalProvider>
    )
}