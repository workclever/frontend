import { uniqBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { useTask } from "../../../../hooks/useTask";
import { useSearchTasksMutation } from "../../../../services/api";
import { selectSelectedProjectId } from "../../../../slices/project/projectSlice";
import { TaskType } from "../../../../types/Project";
import { AsyncSelect as AtlasKitAsyncSelect } from "@atlaskit/select";
import { OptionType } from "@atlaskit/select/dist/types";
import { styled } from "styled-components";
import { TaskIdRenderer } from "../../../../components/shared/TaskIdRenderer";

const CustomOptionWrapper = styled.div`
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;

  &:hover {
    background-color: #fafafa;
    cursor: pointer;
  }
`;

export const TaskSearchInput: React.FC<{
  selectedTaskId?: number;
  onFind: (foundTask: TaskType) => void;
  disabled?: boolean;
}> = ({ selectedTaskId, onFind, disabled }) => {
  const selectedProjectId = Number(useSelector(selectSelectedProjectId));
  const [search, { data, isLoading, isError }] = useSearchTasksMutation();
  const existingTask = useTask(Number(selectedTaskId));
  const foundTasks = data?.Data || [];
  const allTasks = [...foundTasks, existingTask].filter(Boolean) as TaskType[];

  const onSelect = (value: number) => {
    const foundTask = allTasks.find((r) => r.Id === value);
    onFind(foundTask as TaskType);
  };

  const promiseOptions = async (inputValue: string): Promise<OptionType[]> => {
    const foundTasks = await search({
      text: inputValue,
      ProjectId: selectedProjectId,
    }).unwrap();

    const allTasks = [...(foundTasks.Data || []), existingTask].filter(Boolean);
    return uniqBy(allTasks, "Id").map((r) => ({
      value: r.Id,
      label: r.Title,
    }));
  };

  return (
    <AtlasKitAsyncSelect
      placeholder="Search for a task"
      value={{ value: Number(selectedTaskId), label: existingTask?.Title }}
      isDisabled={disabled}
      isSearchable
      style={{ width: "100%" }}
      onChange={(value) =>
        value ? onSelect(Number(value.value)) : onSelect(0)
      }
      isLoading={isLoading}
      isInvalid={isError}
      loadOptions={promiseOptions}
      isClearable
      menuPortalTarget={document.body}
      menuPosition="fixed"
      // zIndex has to be higher than Modal to be visible
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        container: (base) => ({ ...base, width: "250px" }),
      }}
      components={{
        Option: (props) => {
          const relevantTask = allTasks?.find((r) => r.Id === props.data.value);
          return (
            <CustomOptionWrapper onClick={() => props.selectOption(props.data)}>
              {relevantTask && <TaskIdRenderer task={relevantTask} />}
              <span>{props.data.label}</span>
            </CustomOptionWrapper>
          );
        },
      }}
    />
  );
};
