import AtlasKitModal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";

type Props = {
  title?: React.ReactNode;
  visible: boolean;
  onCancel?: () => void;
  width?: number;
  children: React.ReactNode;
  maxHeight?: number;
};

// TODOAK close button
export const Modal: React.FC<Props> = ({
  visible,
  onCancel,
  title,
  width,
  children,
  maxHeight,
}) => {
  return (
    <ModalTransition>
      {visible && (
        <AtlasKitModal width={width} height={maxHeight} onClose={onCancel}>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
        </AtlasKitModal>
      )}
    </ModalTransition>
  );
};
