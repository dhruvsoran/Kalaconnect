import type { SVGProps } from 'react';
import Image from 'next/image';

export function KalaConnectIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <Image
      src="https://thumbs.dreamstime.com/b/rainbow-circle-logo-logo-rainbow-circle-symbol-infinite-cycle-color-abstract-isolated-pattern-white-background-120099960.jpg"
      alt="KalaConnect Logo"
      width={props.width ? Number(props.width) : 32}
      height={props.height ? Number(props.height) : 32}
      className={className}
      // The passed props like stroke, fill etc. are for SVG, so we don't spread them to the Image component.
    />
  );
}
