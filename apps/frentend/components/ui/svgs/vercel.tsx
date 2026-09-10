import React, { ComponentProps } from 'react';

export const Vercel = (props: ComponentProps<'svg'>) => (
    <svg
        viewBox="0 0 500 500"
        width="1em"
        height="1em"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        {...props}
    >
        <g fill="currentColor">
            <rect x="115" y="75" width="110" height="350" rx="55" ry="55" />
            <rect x="247.5" y="115" width="95" height="170" rx="47.5" ry="47.5" transform="rotate(-45 295 200)" />
            <rect x="247.5" y="215" width="95" height="170" rx="47.5" ry="47.5" transform="rotate(45 295 300)" />
        </g>
    </svg>
);

export const VercelFull = Vercel;
