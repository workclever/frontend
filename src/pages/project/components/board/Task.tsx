import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { message } from "antd";
import { TaskType } from "../../../../types/Project";
import { UserAvatar } from "../../../../components/shared/UserAvatar";
import {
  useDeleteTaskMutation,
  useListTaskCommentsQuery,
  useListTaskCustomFieldValuesByBoardQuery,
  useSendTaskToTopOrBottomMutation,
} from "../../../../services/api";
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownCircleOutlined,
  EditOutlined,
  ForkOutlined,
  MessageOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import { CustomField, CustomFieldType } from "../../../../types/CustomField";
import React from "react";
import { EntityClasses, Permissions } from "../../../../types/Roles";
import { useMe } from "../../../../hooks/useMe";
import copy from "copy-to-clipboard";
import { useFormattedDate } from "../../../../hooks/useFormattedDate";
import { EnhancedDropdownMenu } from "../../../../components/shared/EnhancedDropdownMenu";
import { TaskCardKanban } from "./TaskCardKanban";
import { TaskCardCompact } from "./TaskCardCompact";
import { useSelector } from "react-redux";
// import { selectBoardViewType } from "../../../../slices/projectSlice";
import { Confirm } from "../../../../components/shared/Confirm";
import { Tooltip } from "../../../../components/shared/primitives/Tooltip";
import { Space } from "../../../../components/shared/primitives/Space";
import { Tag } from "../../../../components/shared/primitives/Tag";
import { gray } from "@ant-design/colors";
import { MenuProps } from "antd/lib/menu";
import { selectBoardViewType } from "../../../../slices/project/projectSlice";

export type Props = {
  listeners: DraggableSyntheticListeners;
  task: TaskType;
  onTaskClick: () => void;
  findSubtasks: (id: number) => TaskType[];
  customFields: CustomField[];
};

export const TaskCommentsUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  const boardViewType = useSelector(selectBoardViewType);
  const { data: comments } = useListTaskCommentsQuery(task.BoardId);
  const commentsData = comments?.Data || {};
  const taskCommentsCount = (commentsData[task.Id] || []).length;
  const hasTaskComments = taskCommentsCount > 0;

  if (!hasTaskComments) {
    return boardViewType === "kanban" ? null : <>-</>;
  }

  return (
    <Tooltip title={`${taskCommentsCount} comment(s)`}>
      <span style={{ color: gray[8] }}>
        {taskCommentsCount}
        <MessageOutlined style={{ marginLeft: 4 }} />
      </span>
    </Tooltip>
  );
};

export const TaskSubtasksUnit: React.FC<
  Pick<Props, "task" | "findSubtasks">
> = ({ task, findSubtasks }) => {
  const boardViewType = useSelector(selectBoardViewType);
  const subtasks = findSubtasks(task.Id) || [];
  const hasSubtasks = subtasks.length > 0;
  if (!hasSubtasks) {
    return boardViewType === "kanban" ? null : <>-</>;
  }

  return (
    <Tooltip title={`${subtasks.length} subtasks(s)`}>
      <span>
        {subtasks.length}
        <ForkOutlined style={{ marginLeft: 4 }} />
      </span>
    </Tooltip>
  );
};

export const TaskAssigneeUnit: React.FC<Pick<Props, "task">> = ({ task }) => {
  const boardViewType = useSelector(selectBoardViewType);
  if (!task.AssigneeUserId) {
    return boardViewType === "kanban" ? null : <>-</>;
  }
  return <UserAvatar userId={task.AssigneeUserId} />;
};

const FieldTag: React.FC<{ color?: string; children?: React.ReactNode }> = ({
  color,
  children,
}) => {
  return (
    <Tag
      style={{
        border: "none",
        backgroundColor: color || gray[2],
        color: "#efefef",
      }}
    >
      {children}
    </Tag>
  );
};

const RenderDate = ({ customFieldValue }: { customFieldValue: string }) => {
  const formattedDate = useFormattedDate(customFieldValue);
  if (!formattedDate) {
    return null;
  }
  return <FieldTag>{formattedDate}</FieldTag>;
};

export const RenderTaskCustomField: React.FC<{
  task: TaskType;
  customField: CustomField;
}> = ({ task, customField }) => {
  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(Number(task.BoardId));
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];
  if (!taskCustomFieldValuesData) {
    return null;
  }

  const emptyValue = () => (
    <div style={{ height: 25, width: "100%", minWidth: 150 }}>&nbsp;</div>
  );

  const customFieldValue = taskCustomFieldValuesData[customField.Id];

  if (customField.FieldType === CustomFieldType.Text) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <FieldTag>{customFieldValue}</FieldTag>;
  }
  if (customField.FieldType === CustomFieldType.Number) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <FieldTag>{customFieldValue}</FieldTag>;
  }
  if (customField.FieldType === CustomFieldType.Date) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return <RenderDate customFieldValue={customFieldValue as string} />;
  }
  if (customField.FieldType === CustomFieldType.Bool) {
    return (
      <FieldTag>
        {customFieldValue ? <CheckOutlined /> : <CloseOutlined />}
      </FieldTag>
    );
  }
  if (customField.FieldType === CustomFieldType.SingleSelect) {
    if (!customFieldValue) {
      return emptyValue();
    }
    const optionDefinition = customField.SelectOptions.find(
      (r) => r.Id === customFieldValue
    );
    return (
      <FieldTag color={optionDefinition?.Color}>
        {optionDefinition?.Name}
      </FieldTag>
    );
  }
  if (customField.FieldType === CustomFieldType.MultiSelect) {
    if (!customFieldValue) {
      return emptyValue();
    }
    return (
      <Space wrap>
        {(customFieldValue as number[]).map((id) => {
          const selectOption = customField.SelectOptions.find(
            (r) => r.Id === id
          );
          if (!selectOption) return null;
          return (
            <FieldTag key={selectOption.Id} color={selectOption.Color}>
              {selectOption.Name}
            </FieldTag>
          );
        })}
      </Space>
    );
  }
  return null;
};

export const RenderTaskCustomFieldsUnit: React.FC<{
  task: TaskType;
  customFields: CustomField[];
}> = ({ task, customFields }) => {
  const { data: taskCustomFieldValues } =
    useListTaskCustomFieldValuesByBoardQuery(Number(task.BoardId));
  const taskCustomFieldValuesData = taskCustomFieldValues?.Data[task.Id];
  if (!taskCustomFieldValuesData) {
    return null;
  }
  const filledCustomValues = customFields.filter(
    (r) =>
      taskCustomFieldValuesData[r.Id] ||
      // Get also false values, since Bool type can have false value
      taskCustomFieldValuesData[r.Id] === false
  );
  return (
    <Space wrap>
      {filledCustomValues.map((customField) => {
        return (
          <Tooltip key={customField.Id} title={customField.FieldName}>
            <span>
              <RenderTaskCustomField task={task} customField={customField} />
            </span>
          </Tooltip>
        );
      })}
    </Space>
  );
};

export const Task: React.FC<Props> = ({
  onTaskClick,
  listeners,
  task,
  findSubtasks,
  customFields,
}) => {
  const { hasAccess } = useMe();
  const [deleteTask] = useDeleteTaskMutation();
  const [sendToLocation] = useSendTaskToTopOrBottomMutation();
  const boardViewType = useSelector(selectBoardViewType);

  const hasProjectManagerPermission = hasAccess(
    Number(task.ProjectId),
    Permissions.CanManageProject,
    EntityClasses.Project
  );
  const menuItems: MenuProps["items"] = [
    {
      label: "Edit",
      key: "1",
      onClick: onTaskClick,
      icon: <EditOutlined />,
    },
    {
      label: "Copy link",
      key: "2",
      onClick: () => {
        copy(`/${task.ProjectId}/board/${task.BoardId}/task/${task.Id}`, {
          onCopy: () => {
            message.info("Copied");
          },
        });
      },
      icon: <CopyOutlined />,
    },
    {
      label: "Send to top of column",
      key: "3",
      onClick: () => {
        sendToLocation({ Location: 1, TaskId: task.Id });
      },
      icon: <UpCircleOutlined />,
    },
    {
      label: "Send to bottom of column",
      key: "4",
      onClick: () => {
        sendToLocation({ Location: 0, TaskId: task.Id });
      },
      icon: <DownCircleOutlined />,
    },
  ];
  if (hasProjectManagerPermission) {
    const deleteMenuItem = {
      label: "Delete",
      key: "5",
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

  const Component =
    boardViewType === "kanban" ? TaskCardKanban : TaskCardCompact;

  return (
    <EnhancedDropdownMenu
      triggers={["contextMenu"]}
      items={menuItems}
      triggerElement={
        <div style={{ width: "100%" }} onClick={onTaskClick}>
          <Component
            onTaskClick={onTaskClick}
            customFields={customFields}
            findSubtasks={findSubtasks}
            listeners={listeners}
            task={task}
          />
        </div>
      }
    />
  );
};
