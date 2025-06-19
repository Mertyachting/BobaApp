// app/layout.tsx
import 'bulma/css/bulma.min.css';
import './globals.css';
import Image from 'next/image'

import Link from 'next/link';

import { Metadata } from 'next';
import Providers from './providers';


const email = 'sb-89a43m40169106@business.example.com'


export const metadata: Metadata = {
  title: 'PP Beyond',
  description: 'Test App for PayPal SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body>
        <title>PayPal Beyond</title>
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" href="/">
              <Image src="/images/Monogram-OneColor-PayPal-RGB-White.png" alt="picture of a helmet with a payments logo on it" width={20} height={64} style={{ width: 20, height: 64 }}>
              </Image>
              <h5 className='title is-5'> Beyond</h5>
            </Link>

          </div>


          <div id="navMenu" className="navbar-menu is-active">
            <div className="navbar-start">
              <Link className="navbar-item" href="./onboarding">
                Onboarding
              </Link>

              <Link className="navbar-item" href='/fastlane'>
                FastLane
              </Link>
              <Link className="navbar-item" href='/checkout'>
                AppSwitch
              </Link>
            </div>
          </div>

          <div className="navbar-end">
            <div className='navbar-item'>
              <button className='button'>{email}</button>
            </div>
          </div>
        </nav>
        <Providers>
          {children}
        </Providers>


      </body>
    </html >
  );

}
