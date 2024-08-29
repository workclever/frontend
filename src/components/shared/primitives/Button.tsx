import { Button as AntdButton } from "antd";
import { ButtonHTMLType, ButtonType } from "antd/lib/button";
import { BaseButtonProps } from "antd/lib/button/button";
import { SizeType } from "antd/lib/config-provider/SizeContext";

export declare type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, "type" | "onClick">;

export type ButtonProps = {
  type?: ButtonType;
  icon?: React.ReactNode;
  size?: SizeType;
  loading?: boolean;
  ghost?: boolean;
  danger?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
} & NativeButtonProps;

export const Button: React.FC<ButtonProps> = ({
  type,
  icon,
  size,
  loading,
  ghost,
  danger,
  children,
  style,
  htmlType,
  onClick,
  disabled,
  ...rest
}) => {
  return (
    <AntdButton
      type={type}
      icon={icon}
      size={size}
      danger={danger}
      loading={loading}
      ghost={ghost}
      style={style}
      htmlType={htmlType}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </AntdButton>
  );
};
