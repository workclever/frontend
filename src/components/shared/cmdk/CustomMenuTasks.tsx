import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useSearchTasksMutation } from "@app/services/api";
import { Command } from "cmdk";
import { debounce } from "lodash";
import { useEffect } from "react";
import { ColumnColor } from "../ColumnColor";

export const CustomMenuTasks: React.FC<{
  search: string;
  onClose: () => void;
}> = ({ search, onClose }) => {
  const { goToTask } = useAppNavigate();

  const [searchTasks, { data: tasks }] = useSearchTasksMutation();

  const searchTasksDebounced = debounce(searchTasks, 300);

  useEffect(() => {
    if (!search || search.length < 2) {
      return;
    }
    searchTasksDebounced({
      // When projectId sent as 0, the API search in all accessed projects of user
      ProjectId: 0,
      text: search,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (tasks?.Data?.length === 0) {
    return null;
  }

  return (
    <Command.Group heading="Tasks">
      {tasks?.Data.map((task) => (
        <Command.Item
          key={task.Id}
          onSelect={() => {
            goToTask(task);
            onClose();
          }}
        >
          <ColumnColor
            columnId={task.ColumnId}
            boardId={task.BoardId}
            style={{ marginRight: 8 }}
          />
          {task.Title}
        </Command.Item>
      ))}
    </Command.Group>
  );
};
