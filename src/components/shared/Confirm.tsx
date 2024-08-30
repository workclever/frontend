import { Modal, ModalFuncProps } from "antd";
import React from "react";

type Props = {
  children?: React.ReactNode;
  title: string;
  content?: string;
  onConfirm: () => void;
  type?: ModalFuncProps["type"];
};

export const Show = (props: Props) => {
  Modal.confirm({
    title: props.title,
    content: props.content,
    type: props.type,
    onOk: props.onConfirm,
  });
};

export const Embed: React.FC<Props> = ({
  children,
  title,
  content,
  onConfirm,
  type,
}) => {
  return (
    <span
      onClick={() => {
        Modal.confirm({
          title: title,
          content,
          type,
          onOk: onConfirm,
          icon: null,
        });
      }}
    >
      {children}
    </span>
  );
};

export const Confirm = {
  Show,
  Embed,
};
