import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { SvgProps } from "react-native-svg";

export default function BookIcon(props: SvgProps) {
  const color = props.fill || "#9E9E9E";

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 4.5C4 3.12 5.12 2 6.5 2H20V22H6.5C5.12 22 4 20.88 4 19.5V4.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 19.5C4 18.12 5.12 17 6.5 17H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 12C13.66 12 15 10.21 15 8C15 10.21 16.34 12 18 12C16.34 12 15 13.79 15 16C15 13.79 13.66 12 12 12Z"
        fill={color}
      />
    </Svg>
  );
}
