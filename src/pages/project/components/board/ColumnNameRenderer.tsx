import { DeleteColumnOutlined, EditOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { ItemType } from "antd/es/menu/interface";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useMe } from "@app/hooks/useMe";
import { useDeleteColumnMutation } from "@app/services/api";
import {
  selectBoardViewType,
  selectSelectedProjectId,
} from "@app/slices/project/projectSlice";
import { ColumnType } from "@app/types/Project";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { Confirm } from "@app/components/shared/Confirm";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import { FlexBasicLayout } from "@app/components/shared/FlexBasicLayout";
import { EditColumnModal } from "./EditColumnModal";
import { ColumnTreeHeader } from "./ColumnTreeHeader";
import { Title } from "@app/components/shared/primitives/Title";

const ColumnTreeWrapper = styled.div`
  padding: 4px;
  padding-left: 8px;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
`;

const ColumnKanbanWrapper = styled.div`
  background-color: transparent;
  padding: 8px;
  cursor: pointer;
  width: 100%;
`;

export const ColumnNameRenderer: React.FC<{
  column: ColumnType;
}> = ({ column }) => {
  const { hasAccess } = useMe();
  const [deleteColumn] = useDeleteColumnMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [editColumn, showEditColumn] = React.useState(false);
  const hasProjectManagerPermission = hasAccess(
    Number(selectedProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );

  const boardViewType = useSelector(selectBoardViewType);

  const menuItems: ItemType[] = [
    {
      key: "1",
      label: "Edit column",
      icon: <EditOutlined />,
      onClick: () => showEditColumn(true),
    },
    {
      key: "2",
      label: "Delete column",
      icon: <DeleteColumnOutlined />,
      onClick: () => {
        Confirm.Show({
          title: "Are you sure to delete this column?",
          content: "All tasks in this column will be deleted.",
          type: "warning",
          onConfirm: () => deleteColumn(column.Id),
        });
      },
      danger: true,
    },
  ];

  const manageColumnRenderer = hasProjectManagerPermission ? (
    <EnhancedDropdownMenu items={menuItems} />
  ) : undefined;

  const titleRenderer = (
    <Title level={5} style={{ display: "flex", flex: 1, marginBottom: 0 }}>
      <Badge color={column.Color} style={{ marginRight: 8 }} />
      <div
        style={{
          ...(boardViewType === "tree" ? { marginRight: 8 } : { flex: 1 }),
        }}
      >
        {column.Name}
      </div>
      <span style={{ marginLeft: 4 }}> {manageColumnRenderer}</span>
    </Title>
  );

  const Wrapper =
    boardViewType === "tree" ? ColumnTreeWrapper : ColumnKanbanWrapper;

  return (
    <Wrapper>
      <FlexBasicLayout
        left={titleRenderer}
        right={boardViewType === "tree" ? <ColumnTreeHeader /> : undefined}
      />
      {editColumn && (
        <EditColumnModal
          column={column as ColumnType}
          onCancel={() => showEditColumn(false)}
        />
      )}
    </Wrapper>
  );
};
