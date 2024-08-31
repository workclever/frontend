import AtlasKitTooltip from "@atlaskit/tooltip";

type AtlasKitTooltipProps = React.ComponentProps<typeof AtlasKitTooltip>;

type Props = {
  title: AtlasKitTooltipProps["content"];
  placement?: AtlasKitTooltipProps["position"];
  children: React.ReactNode;
};
export const Tooltip: React.FC<Props> = ({ title, children, placement }) => {
  return (
    <AtlasKitTooltip content={title} position={placement}>
      {children}
    </AtlasKitTooltip>
  );
};
