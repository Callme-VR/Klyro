import React, { ComponentProps } from 'react';

const Supabase = (props: ComponentProps<'svg'>) => (
    <svg
        {...props}
        viewBox="0 0 109 113"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M63.7076 110.284C60.9481 113.884 55.0804 111.939 55.0804 107.382V58.7508H97.6695C106.877 58.7508 111.965 69.4187 106.126 77.0366L63.7076 110.284Z"
            fill="url(#paint0_linear)"
        />
        <path
            d="M45.197 2.37877C47.9565 -1.2212 53.8242 0.72382 53.8242 5.28068V53.9119H11.2351C2.02766 53.9119 -3.06037 43.244 -0.22137 35.6261L45.197 2.37877Z"
            fill="#3ECF8E"
        />
        <defs>
            <linearGradient
                id="paint0_linear"
                x1="55.0804"
                y1="58.7508"
                x2="91.1345"
                y2="108.971"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#249361" />
                <stop offset="1" stopColor="#3ECF8E" />
            </linearGradient>
        </defs>
    </svg>
);

const SupabaseFull = (props: ComponentProps<'svg'>) => (
    <svg
        {...props}
        viewBox="0 0 581 113"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M63.7076 110.284C60.9481 113.884 55.0804 111.939 55.0804 107.382V58.7508H97.6695C106.877 58.7508 111.965 69.4187 106.126 77.0366L63.7076 110.284Z"
            fill="url(#paint0_linear_full)"
        />
        <path
            d="M45.197 2.37877C47.9565 -1.2212 53.8242 0.72382 53.8242 5.28068V53.9119H11.2351C2.02766 53.9119 -3.06037 43.244 -0.22137 35.6261L45.197 2.37877Z"
            fill="#3ECF8E"
        />
        <defs>
            <linearGradient
                id="paint0_linear_full"
                x1="55.0804"
                y1="58.7508"
                x2="91.1345"
                y2="108.971"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#249361" />
                <stop offset="1" stopColor="#3ECF8E" />
            </linearGradient>
        </defs>
    </svg>
);

export { Supabase, SupabaseFull };
