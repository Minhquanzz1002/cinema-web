import React, { CSSProperties, PropsWithChildren } from 'react';

import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export type LinkProps = NextLinkProps & PropsWithChildren & {
    styles?: CSSProperties;
    className?: string;
};

function Link({ className, children, ...props }: LinkProps) {
    return (
        <NextLink className={`${className}`} {...props} >
            {children}
        </NextLink>
    );
}

export default Link;