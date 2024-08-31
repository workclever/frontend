// import {
//   DownCircleOutlined,
//   PlusOutlined,
//   UpCircleOutlined,
// } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";
import { FlexBasicLayout } from "../../../../../components/shared/FlexBasicLayout";
import {
  Button,
  ButtonProps,
} from "../../../../../components/shared/primitives/Button";
import { Space } from "../../../../../components/shared/primitives/Space";
import { Text } from "../../../../../components/shared/primitives/Text";

const Content = styled.div`
  padding: 4px;
  margin-top: 4px;
  border: 1px dotted #cccccc;
`;

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
  const IconedButton: React.FC<Pick<ButtonProps, "onClick" | "iconBefore">> = ({
    iconBefore,
    onClick,
  }) => (
    <Button iconBefore={iconBefore} onClick={onClick}>
      &nbsp;
    </Button>
  );

  const plusButton = showPlusIcon && (
    <IconedButton
      // TODOAK iconBefore={<PlusOutlined style={{ fontSize: 12 }} />}
      onClick={() => onClickPlusIcon && onClickPlusIcon()}
    />
  );

  const collapseButton = !expanded ? (
    <IconedButton
      // TODOAK iconBefore={<DownCircleOutlined style={{ fontSize: 12 }} />}
      onClick={toggleExpand}
    />
  ) : (
    <IconedButton
      // TODOAK iconBefore={<UpCircleOutlined style={{ fontSize: 12 }} />}
      onClick={toggleExpand}
    />
  );

  return (
    <>
      <Text strong>
        <FlexBasicLayout
          left={
            <Space>
              {title}
              {plusButton}
            </Space>
          }
          right={<>{collapseButton}</>}
        />
      </Text>
      {expanded && <Content>{children}</Content>}
    </>
  );
};
