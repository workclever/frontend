/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupItem } from "@ozgurrgul/dragulax";
import { FIELD_UNASSIGNED } from "./constants";
import { useListCustomFieldsQuery } from "@app/services/api";
import { useSelector } from "react-redux";
import { selectSelectedProjectId } from "@app/slices/project/projectSlice";
import { CustomFieldPreview } from "../../units/CustomFieldPreview";
import { Tooltip } from "@app/components/shared/primitives/Tooltip";

export const GroupNameCustomField: React.FC<{
  group: GroupItem;
  customFieldId: number;
}> = ({ group, customFieldId }) => {
  const groupValues = (group.data as any)?.groupValues;

  if (typeof groupValues === "number" && groupValues === FIELD_UNASSIGNED) {
    return <>unassigned</>;
  }

  return (
    <GroupNameCustomFieldExists group={group} customFieldId={customFieldId} />
  );
};

export const GroupNameCustomFieldExists: React.FC<{
  group: GroupItem;
  customFieldId: number;
}> = ({ group, customFieldId }) => {
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const { data: customFields } = useListCustomFieldsQuery(
    Number(selectedProjectId)
  );
  const customField = (customFields?.Data || []).find(
    (r) => r.Id === customFieldId
  );

  if (!customField) {
    return null;
  }

  return (
    <Tooltip key={customField.Id} title={customField.FieldName}>
      <CustomFieldPreview
        customField={customField}
        customFieldValue={(group.data as any)?.groupValues}
      />
    </Tooltip>
  );
};
