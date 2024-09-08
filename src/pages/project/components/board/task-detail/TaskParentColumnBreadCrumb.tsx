import { gray } from "@ant-design/colors";
import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import { TaskType } from "@app/types/Project";
import { ChevronRightIcon } from "lucide-react";

const Arrow = () => (
  <ChevronRightIcon
    size={30}
    style={{
      paddingLeft: 8,
      paddingRight: 8,
      color: gray[0],
    }}
  />
);

export const TaskParentColumnBreadCrumb: React.FC<{ task: TaskType }> = ({
  task,
}) => {
  const boards = useBoards();
  const board = boards.find((r) => r.Id === task.BoardId);

  const { columns } = useColumns(task.BoardId);
  const column = columns.find((r) => r.Id === task.ColumnId);

  return (
    <>
      <span style={{ color: gray[0], whiteSpace: "nowrap", fontSize: 13 }}>
        {board?.Name}
      </span>
      <Arrow />
      <span style={{ color: gray[0], whiteSpace: "nowrap", fontSize: 13 }}>
        {column?.Name}
      </span>
      <Arrow />
    </>
  );
};
