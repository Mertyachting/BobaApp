// components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const ProductCard: React.FC = () => {
    const [showBuyButton, setShowBuyButton] = useState<boolean>(false);

    const handleClick = () => {
        setShowBuyButton(true);
    };

    return (
        <div
            className="card"
            onClick={handleClick}
            style={{ width: 200, cursor: 'pointer' }}
        >
            <div className="card-image">
                <figure className="image is-4by3">
                    <Image
                        src="/images/product.webp"
                        alt="Product"
                        fill={true} />
                </figure>
            </div>
            <div className="card-content has-text-centered">
                <p className="title is-4">Amazing Product</p>
                <p className="subtitle is-6">$19.99</p>
                {showBuyButton && (
                    <button className="button is-primary">Buy Now</button>
                )}
            </div>
        </div>
    );
};



export default ProductCard;
