import { Modal } from "./primitives/Modal";
import React from "react";
import { Settings, SettingsProps } from "./Settings";

type Props = SettingsProps & {
  onCancel: () => void;
};

export const SettingsModal: React.FC<Props> = ({ onCancel, ...restProps }) => {
  return (
    <Modal visible noPaddingMode width={800} onCancel={onCancel}>
      <Settings {...restProps} />
    </Modal>
  );
};
