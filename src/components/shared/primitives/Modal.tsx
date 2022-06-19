import { Modal as AntdModal } from "antd";
import { MASK_BG_COLOR } from "../../constants";

type Props = {
  title?: React.ReactNode;
  visible: boolean;
  onCancel?: () => void;
  width?: number;
  children: any;
  maxHeight?: number;
};

export const Modal: React.FC<Props> = ({
  visible,
  onCancel,
  title,
  width,
  children,
  maxHeight,
}) => (
  <AntdModal
    visible={visible}
    onCancel={onCancel}
    title={title}
    width={width}
    footer={null}
    centered
    maskStyle={{ backgroundColor: MASK_BG_COLOR }}
    bodyStyle={{
      padding: 0,
      overflow: "auto",
      maxHeight,
    }}
  >
    {children}
  </AntdModal>
);
