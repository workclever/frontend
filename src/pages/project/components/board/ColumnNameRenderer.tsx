import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useMe } from "@app/hooks/useMe";
import {
  useCreateTaskMutation,
  useDeleteColumnMutation,
} from "@app/services/api";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { ColumnType } from "@app/types/Project";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { Confirm } from "@app/components/shared/Confirm";
import {
  EnhancedDropdownMenu,
  EnhancedDropdownMenuItem,
} from "@app/components/shared/EnhancedDropdownMenu";
import { FlexBasicLayout } from "@app/components/shared/FlexBasicLayout";
import { EditColumnModal } from "./EditColumnModal";
import { ColumnTreeHeader } from "./ColumnTreeHeader";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { ColumnColor } from "@app/components/shared/ColumnColor";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  selectBoardViewType,
  selectSelectedBoardId,
} from "@app/slices/board/boardSlice";

const ColumnTreeWrapper = styled.div`
  padding: 8px;
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  background-color: #f7f7f7;
`;

const ColumnKanbanWrapper = styled.div`
  background-color: transparent;
  padding: 8px;
  cursor: pointer;
  width: 100%;
`;

type FormValuesType = {
  Title: string;
};

export const ColumnNameRenderer: React.FC<{
  column: ColumnType;
  toggleOpen?: () => void;
}> = ({ column, toggleOpen }) => {
  const { hasAccess } = useMe();
  const [deleteColumn] = useDeleteColumnMutation();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const [creatingTask, setCreatingTask] = React.useState(false);
  const [editColumn, showEditColumn] = React.useState(false);
  const hasProjectManagerPermission = hasAccess(
    Number(selectedProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );

  const boardViewType = useSelector(selectBoardViewType);

  const menuItems: EnhancedDropdownMenuItem[] = [
    {
      key: "new-task",
      label: "New task",
      icon: <PlusIcon size={12} />,
      onClick: () => setCreatingTask(true),
    },
    {
      key: "edit-col",
      label: "Edit column",
      icon: <PencilIcon size={12} />,
      onClick: () => showEditColumn(true),
    },
    {
      key: "delete-col",
      label: "Delete column",
      icon: <TrashIcon size={12} />,
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
    <div style={{ display: "flex", flex: 1, marginBottom: 0, color: "black" }}>
      <ColumnColor
        columnId={column.Id}
        boardId={column.BoardId}
        style={{ marginRight: 8 }}
      />
      <div
        style={{
          ...(boardViewType === "tree" ? { marginRight: 8 } : { flex: 1 }),
        }}
      >
        {column.Name}
      </div>
      <span style={{ marginLeft: 4 }}> {manageColumnRenderer}</span>
    </div>
  );

  const Wrapper =
    boardViewType === "tree" ? ColumnTreeWrapper : ColumnKanbanWrapper;

  const [createTask] = useCreateTaskMutation();
  const selectedBoardId = useSelector(selectSelectedBoardId);

  const onFinish = async (values: FormValuesType) => {
    await createTask({
      ProjectId: Number(selectedProjectId),
      BoardId: Number(selectedBoardId),
      ColumnId: column.Id,
      Title: values.Title,
      Description: "",
    });
  };

  return (
    <Wrapper onClick={toggleOpen}>
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
      {creatingTask && (
        <ModalForm<FormValuesType>
          initialValues={{
            Title: "",
          }}
          open
          onFinish={onFinish}
          autoComplete="off"
          modalProps={{
            title: "Create a new task",
            width: 300,
            cancelText: "Cancel",
            okText: "Save",
            onCancel: () => setCreatingTask(false),
          }}
        >
          <ProFormText
            name="Title"
            label="Title"
            placeholder="Create a new task..."
            rules={[{ required: true, message: "Title of the task" }]}
          />
        </ModalForm>
      )}
    </Wrapper>
  );
};
