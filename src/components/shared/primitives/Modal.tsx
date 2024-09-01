import { Modal as AntdModal } from "antd";

type Props = {
  title?: React.ReactNode;
  visible: boolean;
  onCancel?: () => void;
  width?: number;
  children: React.ReactNode;
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
    open={visible}
    onCancel={onCancel}
    title={title}
    width={width}
    footer={null}
    centered
    bodyStyle={{
      padding: 0,
      overflow: "auto",
      maxHeight,
    }}
  >
    {children}
  </AntdModal>
);
