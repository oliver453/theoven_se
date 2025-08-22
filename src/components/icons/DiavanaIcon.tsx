import React from "react";

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

interface IconProps {
  weight?: IconWeight;
  size?: number | string;
  color?: string;
  mirrored?: boolean;
  className?: string;
}

export const DiavanaIcon: React.FC<
  IconProps & React.SVGProps<SVGSVGElement>
> = ({
  className,
  weight = "regular",
  size = "1em",
  color = "currentColor",
  mirrored = false,
  ...restProps
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      transform={mirrored ? "scale(-1, 1)" : undefined}
      {...restProps}
    >
      <path
        d="M5 2C5 2 10.8333 3.66667 12 3.66667C13.1667 3.66667 19 2 19 2V14.6667C19 18.7168 15.866 22 12 22H5V2Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
