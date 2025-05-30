// app/layout.tsx
import './globals.css';
import 'bulma/css/bulma.min.css';
import PayPalProvider from './paypalProvider';
import Image from 'next/image'

import logo from "/public/images/Boba_Fett_icon_128x128.png"

export const metadata = {
  title: 'My Next.js App',
  description: 'A sample app with a product card and 3D model using react-three-fiber.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <title>The Amazing PayPal Partner App</title>
        <nav className="navbar is-link" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              {/* <Image src={logo} alt="picture of a helmet with a payments logo on it" fill={true}>
              </Image>  */}
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item" href="./onboarding">
                Onboarding
              </a>

              <a className="navbar-item" href='/'>
                FastLane
              </a>
              <a className="navbar-item" href='./components/appswitch'>
                AppSwitch
              </a>

            </div>
          </div>
        </nav>
        {children}

      </body>
    </html>
  );
}
