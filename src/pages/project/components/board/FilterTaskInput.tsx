import { setBoardFilter } from "@app/slices/board/boardSlice";
import { Input } from "antd";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";

export const FilterTaskInput = () => {
  const dispatch = useDispatch();
  const onChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setBoardFilter({
        key: "filterText",
        value: e.target.value,
      })
    );
  }, 200);
  return (
    <Input
      allowClear
      onChange={onChange}
      style={{ width: 120 }}
      placeholder="Filter tasks..."
      variant="borderless"
    />
  );
};
