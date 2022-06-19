import { DeleteColumnOutlined, EditOutlined } from "@ant-design/icons";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Badge } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useMe } from "../../../../hooks/useMe";
import { useDeleteColumnMutation } from "../../../../services/api";
import {
  selectBoardViewType,
  selectSelectedProjectId,
} from "../../../../slices/projectSlice";
import { ColumnType } from "../../../../types/Project";
import { EntityClasses, Permissions } from "../../../../types/Roles";
import { Confirm } from "../../../../components/shared/Confirm";
import { EnhancedDropdownMenu } from "../../../../components/shared/EnhancedDropdownMenu";
import { FlexBasicLayout } from "../../../../components/shared/FlexBasicLayout";
import { EditColumnModal } from "./EditColumnModal";
import { ColumnListHeader } from "./ColumnListHeader";
import { Title } from "../../../../components/shared/primitives/Title";

const ColumnListWrapper = styled.div`
  padding: 4px;
  padding-left: 8px;
  cursor: pointer;
  background-color: var(--gray2);
`;

const ColumnKanbanWrapper = styled.div`
  background-color: transparent;
  padding: 8px;
  cursor: pointer;
`;

export const ColumnNameRenderer: React.FC<{
  column: ColumnType;
  listeners?: SyntheticListenerMap;
}> = ({ column, listeners }) => {
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
    <Title level={5} style={{ flex: 1, marginBottom: 0 }}>
      <Badge color={column.Color} />
      {column.Name}
      <span style={{ marginLeft: 4 }}> {manageColumnRenderer}</span>
    </Title>
  );

  const Wrapper =
    boardViewType === "list" ? ColumnListWrapper : ColumnKanbanWrapper;

  return (
    <Wrapper {...listeners}>
      <FlexBasicLayout
        left={titleRenderer}
        right={boardViewType === "list" ? <ColumnListHeader /> : undefined}
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
