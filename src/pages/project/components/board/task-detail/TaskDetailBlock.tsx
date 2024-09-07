import React from "react";
import styled from "styled-components";
import { Button, ButtonProps } from "@app/components/shared/primitives/Button";
import { Space } from "@app/components/shared/primitives/Space";
import { Text } from "@app/components/shared/primitives/Text";
import {
  ChevronDownCircleIcon,
  ChevronUpCircleIcon,
  PlusIcon,
} from "lucide-react";

const Content = styled.div`
  margin-top: 4px;
`;

const IconedButton: React.FC<Pick<ButtonProps, "onClick" | "icon">> = ({
  icon,
  onClick,
}) => <Button size="small" type="text" icon={icon} onClick={onClick} />;

export const TaskDetailBlock: React.FC<{
  title: string;
  showPlusIcon: boolean;
  onClickPlusIcon?: () => void;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({
  title,
  children,
  showPlusIcon,
  onClickPlusIcon,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const toggleExpand = () => setExpanded((e) => !e);

  const plusButton = showPlusIcon && (
    <IconedButton
      icon={<PlusIcon size={12} />}
      onClick={() => onClickPlusIcon && onClickPlusIcon()}
    />
  );

  const collapseButton = !expanded ? (
    <IconedButton
      icon={<ChevronDownCircleIcon size={12} />}
      onClick={toggleExpand}
    />
  ) : (
    <IconedButton
      icon={<ChevronUpCircleIcon size={12} />}
      onClick={toggleExpand}
    />
  );

  return (
    <>
      <div>
        <Space>
          {collapseButton}
          <Text strong>{title}</Text>
          {plusButton}
        </Space>
      </div>
      {expanded && <Content>{children}</Content>}
    </>
  );
};
