import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/** next/link with viewport prefetching off by default — routes still prefetch
 *  on hover/touch, but page load isn't spent downloading pages nobody opened. */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
