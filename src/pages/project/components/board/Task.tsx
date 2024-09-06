import { Drawer, message } from "antd";
import { TaskType } from "@app/types/Project";
import {
  useDeleteTaskMutation,
  useSendTaskToTopOrBottomMutation,
} from "@app/services/api";
import {
  CopyOutlined,
  DeleteOutlined,
  DownCircleOutlined,
  EditOutlined,
  EyeOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import { CustomField } from "@app/types/CustomField";
import React, { useState } from "react";
import { EntityClasses, Permissions } from "@app/types/Roles";
import { useMe } from "@app/hooks/useMe";
import copy from "copy-to-clipboard";
import { EnhancedDropdownMenu } from "@app/components/shared/EnhancedDropdownMenu";
import { Confirm } from "@app/components/shared/Confirm";
import { MenuProps } from "antd/lib/menu";
import { EditTaskTitleModal } from "./EditTaskTitleModal";
import { TaskDetail } from "./task-detail/TaskDetail";

export type Props = {
  task: TaskType;
  onTaskClick: () => void;
  findSubtasks: (id: number) => TaskType[];
  customFields: CustomField[];
  children?: React.ReactNode;
};

export const Task: React.FC<Props> = ({
  onTaskClick,
  task,
  findSubtasks,
  children,
}) => {
  const { hasAccess } = useMe();
  const [deleteTask] = useDeleteTaskMutation();
  const [sendToLocation] = useSendTaskToTopOrBottomMutation();
  const [editingTitle, setEditingTitle] = useState(false);
  const [quickViewing, setQuickViewing] = useState(false);

  const hasProjectManagerPermission = hasAccess(
    Number(task.ProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );
  const menuItems: MenuProps["items"] = [
    {
      label: "View",
      key: "view",
      onClick: onTaskClick,
      icon: <EyeOutlined />,
    },
    {
      label: "Quick view",
      key: "quick-view",
      onClick: () => setQuickViewing(true),
      icon: <EyeOutlined />,
    },
    {
      label: "Edit title",
      key: "edit-title",
      onClick: () => setEditingTitle(true),
      icon: <EditOutlined />,
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
      icon: <CopyOutlined />,
    },
  ];

  if (!task.ParentTaskItemId) {
    menuItems.push({
      label: "Send to top of column",
      key: "send-to-top",
      onClick: () => {
        sendToLocation({ Location: 1, TaskId: task.Id });
      },
      icon: <UpCircleOutlined />,
    });
    menuItems.push({
      label: "Send to bottom of column",
      key: "send-to-bottom",
      onClick: () => {
        sendToLocation({ Location: 0, TaskId: task.Id });
      },
      icon: <DownCircleOutlined />,
    });
  }

  if (hasProjectManagerPermission) {
    const deleteMenuItem = {
      label: "Delete",
      key: "delete",
      onClick: () => {
        Confirm.Show({
          title: "Delete task permanently?",
          onConfirm: () => deleteTask(task.Id),
        });
      },
      icon: <DeleteOutlined />,
      danger: true,
    };
    menuItems.push(deleteMenuItem);
  }

  return (
    <>
      <EnhancedDropdownMenu
        triggers={["contextMenu"]}
        items={menuItems}
        triggerElement={
          <div style={{ width: "100%" }} onClick={onTaskClick}>
            {children}
          </div>
        }
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
        >
          <TaskDetail
            task={task}
            onTaskDelete={() => {}}
            findSubtasks={findSubtasks}
          />
        </Drawer>
      )}
    </>
  );
};
