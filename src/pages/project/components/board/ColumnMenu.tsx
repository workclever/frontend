import { Confirm } from "@app/components/shared/Confirm";
import {
  EnhancedDropdownMenu,
  EnhancedDropdownMenuItem,
} from "@app/components/shared/EnhancedDropdownMenu";
import { useMe } from "@app/hooks/useMe";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { EntityClasses, Permissions } from "@app/types/Roles";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditColumnModal } from "./EditColumnModal";
import { useDeleteColumnMutation } from "@app/services/api";
import { selectSelectedBoardId } from "@app/slices/board/boardSlice";
import { useColumns } from "@app/hooks/useColumns";

export const ColumnMenu: React.FC<{
  columnId: number;
}> = ({ columnId }) => {
  const { hasAccess } = useMe();
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const [creatingTask, setCreatingTask] = React.useState(false);
  const [editColumn, showEditColumn] = React.useState(false);
  const [deleteColumn] = useDeleteColumnMutation();
  const { columns } = useColumns(Number(selectedBoardId));
  const column = columns.find((r) => r.Id === columnId);

  const hasProjectManagerPermission = hasAccess(
    Number(selectedProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );

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
          onConfirm: () => deleteColumn(Number(column?.Id)),
        });
      },
      danger: true,
    },
  ];

  if (!hasProjectManagerPermission) {
    return null;
  }

  return (
    <>
      <EnhancedDropdownMenu
        items={menuItems}
        triggerElement={<EllipsisVerticalIcon size={12} />}
      />
      {editColumn && column && (
        <EditColumnModal
          column={column}
          onCancel={() => showEditColumn(false)}
        />
      )}
      {creatingTask && (
        <CreateTaskModal
          columnId={columnId}
          onCancel={() => setCreatingTask(false)}
        />
      )}
    </>
  );
};
