// app/success/page.tsx

import Link from 'next/link';
import React from 'react';

export default function Success() {
    return (
        <section className="hero is-success is-fullheight-with-navbar">
            <div className="hero-body">
                <div className="container has-text-centered">
                    {/* Big checkmark icon */}
                    <span className="icon is-large has-text-white mb-4">
                        <i className="fas fa-check-circle fa-5x"></i>
                    </span>

                    {/* Main heading */}
                    <h1 className="title is-2 has-text-white">
                        Payment Successful!
                    </h1>

                    {/* Subheading / description */}
                    <p className="subtitle is-5 has-text-white-ter mb-5">
                        Thank you for your purchase. Your transaction has been completed successfully.
                    </p>

                    {/* Action buttons */}
                    <div className="buttons is-centered">

                        <Link className="button is-link" href="/">
                            Go to Home

                        </Link>


                    </div>
                </div>
            </div>
        </section>
    );
}
