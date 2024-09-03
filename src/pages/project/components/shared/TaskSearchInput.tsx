import { Select } from "antd";
import { debounce, uniqBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { useTask } from "@app/hooks/useTask";
import { useSearchTasksMutation } from "@app/services/api";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { TaskType } from "@app/types/Project";

export const TaskSearchInput: React.FC<{
  value?: number;
  onFind: (foundTask: TaskType) => void;
  disabled?: boolean;
}> = ({ value, onFind, disabled }) => {
  const selectedProjectId = Number(useSelector(selectSelectedProjectId));
  const [search, { data, isLoading, isError }] = useSearchTasksMutation();
  const onSearch = (text: string) => {
    if (!text) {
      return;
    }
    search({
      text,
      ProjectId: selectedProjectId,
    });
  };

  const existingTask = useTask(Number(value));
  const debouncedSearch = debounce(onSearch, 150);
  const foundTasks = data?.Data || [];
  const allTasks = [...foundTasks, existingTask].filter(Boolean) as TaskType[];

  const options = React.useMemo(() => {
    const tempOptions = uniqBy(allTasks, "Id").map((r) => ({
      value: r.Id,
      label: r.Title,
    }));
    return tempOptions;
  }, [allTasks]);

  const onSelect = (value: number) => {
    const foundTask = allTasks.find((r) => r.Id === value);
    onFind(foundTask as TaskType);
  };

  return (
    <Select
      placeholder="Search for a task"
      value={value}
      disabled={disabled}
      filterOption={false}
      onSearch={debouncedSearch}
      options={options}
      showSearch
      style={{ width: 250 }}
      onSelect={onSelect}
      loading={isLoading}
      status={isError ? "error" : undefined}
    />
  );
};
