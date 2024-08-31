import AtlasKitSpinner from "@atlaskit/spinner";

type AtlasKitSpinnerProps = React.ComponentProps<typeof AtlasKitSpinner>;

export const LoadingSpin: React.FC<{
  size?: AtlasKitSpinnerProps["size"];
}> = ({ size }) => <AtlasKitSpinner size={size} />;
