import React from "react";
import { Avatar as AntdAvatar } from "antd";

type Props = {
  src?: string;
  style?: React.CSSProperties;
  alt?: string;
  initials?: string;
};

export const Avatar: React.FC<Props> = ({ src, style, alt, initials }) => {
  return (
    <AntdAvatar src={src} style={style} size={22} alt={alt}>
      {initials}
    </AntdAvatar>
  );
};

export const AvatarGroup: React.FC<{
  children: React.ReactNode[];
  maxVisible: number;
}> = ({ children, maxVisible }) => {
  return (
    <AntdAvatar.Group
      max={{ count: maxVisible, popover: { trigger: "click" } }}
      size={22}
    >
      {children}
    </AntdAvatar.Group>
  );
};
