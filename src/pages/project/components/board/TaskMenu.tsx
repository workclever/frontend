import { Drawer, message } from "antd";
import { BoardType, TaskType } from "@app/types/Project";
import {
  useDeleteTaskMutation,
  useSendTaskToTopOrBottomMutation,
} from "@app/services/api";
import React, { useState } from "react";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { useMe } from "@app/hooks/useMe";
import copy from "copy-to-clipboard";
import {
  EnhancedDropdownMenu,
  EnhancedDropdownMenuItem,
  EnhancedDropdownMenuProps,
} from "@app/components/shared/EnhancedDropdownMenu";
import { Confirm } from "@app/components/shared/Confirm";
import { EditTaskTitleModal } from "./EditTaskTitleModal";
import { TaskDetail } from "./task-detail/TaskDetail";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  EyeIcon,
  PencilIcon,
  ScanEyeIcon,
  TrashIcon,
} from "lucide-react";
import { TaskEditableTitle } from "./task-detail/TaskEditableTitle";
import { useBoardData } from "./hooks/useBoardData";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useBoards } from "@app/hooks/useBoards";

type TaskMenuKeys =
  | "view"
  | "quick-view"
  | "edit-title"
  | "copy-link"
  | "send-to-top"
  | "send-to-bottom"
  | "delete";

export const TaskMenu: React.FC<{
  task: TaskType;
  menuKeys: TaskMenuKeys[];
  triggers: EnhancedDropdownMenuProps["triggers"];
  children?: React.ReactNode;
}> = ({ task, menuKeys, triggers, children }) => {
  const { goToBoard } = useAppNavigate();
  const { hasAccess } = useMe();
  const [deleteTask] = useDeleteTaskMutation();
  const [sendToLocation] = useSendTaskToTopOrBottomMutation();
  const [editingTitle, setEditingTitle] = useState(false);
  const [quickViewing, setQuickViewing] = useState(false);
  const { findSubtasks, onTaskSelect } = useBoardData(task.ProjectId);
  const boards = useBoards();

  const hasProjectManagerPermission = hasAccess(
    Number(task.ProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );
  const menuItems: EnhancedDropdownMenuItem[] = [
    {
      label: "View",
      key: "view",
      onClick: () => onTaskSelect(task),
      icon: <EyeIcon size={12} />,
    },
    {
      label: "Quick view",
      key: "quick-view",
      onClick: () => setQuickViewing(true),
      icon: <ScanEyeIcon size={12} />,
    },
    {
      label: "Edit title",
      key: "edit-title",
      onClick: () => setEditingTitle(true),
      icon: <PencilIcon size={12} />,
    },
    {
      label: "Copy link",
      key: "copy-link",
      onClick: () => {
        copy(`/task/${task.Slug}`, {
          onCopy: () => {
            message.info("Copied");
          },
        });
      },
      icon: <CopyIcon size={12} />,
    },
  ];

  if (!task.ParentTaskItemId) {
    menuItems.push({
      label: "Send to top of column",
      key: "send-to-top",
      onClick: () => {
        sendToLocation({ Location: 1, TaskId: task.Id });
      },
      icon: <ArrowUpIcon size={12} />,
    });
    menuItems.push({
      label: "Send to bottom of column",
      key: "send-to-bottom",
      onClick: () => {
        sendToLocation({ Location: 0, TaskId: task.Id });
      },
      icon: <ArrowDownIcon size={12} />,
    });
  }

  if (hasProjectManagerPermission) {
    const deleteMenuItem = {
      label: "Delete",
      key: "delete",
      onClick: () => {
        Confirm.Show({
          title: "Delete task permanently?",
          onConfirm: () => {
            deleteTask(task.Id);
            goToBoard(boards.find((r) => r.Id === task.BoardId) as BoardType);
          },
        });
      },
      icon: <TrashIcon size={12} />,
      danger: true,
    };
    menuItems.push(deleteMenuItem);
  }

  return (
    <>
      <EnhancedDropdownMenu
        triggers={triggers}
        items={menuItems.filter((m) =>
          menuKeys.includes(m?.key as TaskMenuKeys)
        )}
        triggerElement={children}
      />
      {editingTitle && (
        <EditTaskTitleModal
          task={task}
          onCancel={() => setEditingTitle(false)}
        />
      )}
      {quickViewing && (
        <Drawer
          open
          width="70%"
          onClose={() => setQuickViewing(false)}
          styles={{
            body: { margin: 0, padding: 0 },
          }}
          title={<TaskEditableTitle task={task} onTaskSelect={onTaskSelect} />}
        >
          <TaskDetail task={task} findSubtasks={findSubtasks} />
        </Drawer>
      )}
    </>
  );
};
