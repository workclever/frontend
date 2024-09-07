import { Modal as AntdModal } from "antd";

type Props = {
  title?: React.ReactNode;
  visible: boolean;
  onCancel?: () => void;
  width?: number;
  children: React.ReactNode;
  maxHeight?: number;
  noPaddingMode?: boolean;
};

export const Modal: React.FC<Props> = ({
  visible,
  onCancel,
  title,
  width,
  children,
  maxHeight,
  noPaddingMode = false,
}) => (
  <AntdModal
    open={visible}
    onCancel={onCancel}
    title={title}
    width={width}
    footer={null}
    centered
    styles={{
      body: {
        padding: 0,
        margin: 0,
        overflow: "auto",
        maxHeight,
      },
      content: noPaddingMode
        ? { padding: 0, margin: 0, overflow: "auto", maxHeight }
        : {},
    }}
  >
    {children}
  </AntdModal>
);
