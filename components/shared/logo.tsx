import Image from "next/image";
import type { FC } from "react";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z-50" style={{ width, height }}>
      <Image
        src="/assets/icons/logo.png"
        alt="Multivendedor"
        width={180}
        height={180}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );
};

export default Logo;