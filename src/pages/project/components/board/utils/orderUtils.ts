import { MovePosition } from "@ozgurrgul/dragulax";

export const reorderArray = (
  arr: number[],
  moveId: number,
  targetId: number,
  position: MovePosition
) => {
  const result = arr.filter((id) => id !== moveId);
  const targetIndex = result.indexOf(targetId);

  if (targetIndex !== -1) {
    if (position === "reorder-above") {
      result.splice(targetIndex, 0, moveId);
    } else if (position === "reorder-below") {
      result.splice(targetIndex + 1, 0, moveId);
    }
  }

  return result;
};
