import type { SVGProps } from 'react';
import Image from 'next/image';

export function KalaConnectIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <Image
      src="https://e7.pngegg.com/pngimages/11/772/png-clipart-multicolored-woman-face-wall-art-art-graphic-design-creativity-artwork-creative-artwork-logo.png"
      alt="KalaConnect Logo"
      width={props.width ? Number(props.width) : 32}
      height={props.height ? Number(props.height) : 32}
      className={className}
      // The passed props like stroke, fill etc. are for SVG, so we don't spread them to the Image component.
    />
  );
}
