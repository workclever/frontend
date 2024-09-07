import {
  useListTaskChangeLogQuery,
  useListTaskCommentsQuery,
} from "@app/services/api";
import {
  TaskChangeLogType,
  TaskCommentType,
  TaskType,
} from "@app/types/Project";
import { Timeline } from "antd";
import React from "react";
import { TaskCommentEditor } from "../../task-comments/TaskCommentEditor";
import { TaskChangeLog } from "../task-changelog/TaskChangelog";
import { UserAvatar } from "@app/components/shared/UserAvatar";
import { TaskComment } from "../../task-comments/TaskComment";

type TimelineCommentItem = { type: "comment"; data: TaskCommentType };
type TimelineChangelogItem = { type: "changeLog"; data: TaskChangeLogType };
type TimelineItem = TimelineCommentItem | TimelineChangelogItem;

export const TaskTimeline: React.FC<{ task: TaskType }> = ({ task }) => {
  const { data: boardComments } = useListTaskCommentsQuery(task.BoardId);
  const { data: { Data: taskChangeLogs = [] } = {} } =
    useListTaskChangeLogQuery(task.Id);
  const taskComments = boardComments?.Data[task.Id] || [];
  const combinedItems: TimelineItem[] = [
    ...taskComments.map(
      (r) => ({ type: "comment", data: r } satisfies TimelineCommentItem)
    ),
    ...taskChangeLogs.map(
      (r) => ({ type: "changeLog", data: r } satisfies TimelineChangelogItem)
    ),
  ].sort(
    (a, b) =>
      new Date(a.data.DateCreated).getTime() -
      new Date(b.data.DateCreated).getTime()
  );

  return (
    <div style={{ marginTop: 16, padding: 8 }}>
      <div>
        <Timeline
          items={combinedItems.map((r) => {
            if (r.type === "comment") {
              return {
                children: <TaskComment comment={r.data} task={task} />,
                dot: <UserAvatar userId={r.data.UserId} />,
              };
            }
            if (r.type === "changeLog") {
              return {
                children: <TaskChangeLog item={r.data} />,
                dot: <UserAvatar userId={r.data.UserId} />,
              };
            }
            return { children: "" };
          })}
        />
        <TaskCommentEditor task={task} mode="create" />
      </div>
    </div>
  );
};
