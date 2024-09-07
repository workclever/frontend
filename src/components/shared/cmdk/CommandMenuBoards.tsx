import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useListAllBoardsQuery } from "@app/services/api";
import { Command } from "cmdk";
import { SquareDashedKanbanIcon } from "lucide-react";

export const CommandMenuBoards: React.FC<{
  search: string;
  onClose: () => void;
}> = ({ search, onClose }) => {
  const { goToBoard } = useAppNavigate();
  const { data: boards } = useListAllBoardsQuery(null);
  const filteredBoards = boards?.Data.filter((project) =>
    project.Name.toLowerCase().includes(search.toLowerCase())
  );

  if (filteredBoards?.length === 0) {
    return null;
  }

  return (
    <Command.Group heading="Boards">
      {filteredBoards?.map((board) => (
        <Command.Item
          key={board.Id}
          onSelect={() => {
            goToBoard(board);
            onClose();
          }}
        >
          <SquareDashedKanbanIcon
            size={12}
            style={{ marginRight: 8, color: "gray" }}
          />
          {board.Name}
        </Command.Item>
      ))}
    </Command.Group>
  );
};
