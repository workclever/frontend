import AtlasKitButton from "@atlaskit/button/new";

type AtlasKitButtonProps = React.ComponentProps<typeof AtlasKitButton>;

export type ButtonProps = AtlasKitButtonProps;

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <AtlasKitButton {...rest}>{children}</AtlasKitButton>;
};
