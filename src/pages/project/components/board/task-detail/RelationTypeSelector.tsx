import { Select } from "antd";
import { useTaskRelationTypeDefs } from "../../../../../hooks/useTaskRelationTypeDefs";
import { TaskRelationType } from "../../../../../types/Project";

export const RelationTypeSelector: React.FC<{
  value?: number;
  onSelect: (relationTypeDefId: number) => void;
  direction?: TaskRelationType["RelationTypeDirection"];
}> = ({ value, onSelect, direction }) => {
  const relationTypeDefs = useTaskRelationTypeDefs();
  return (
    <Select
      value={value}
      placeholder="Relation type"
      onSelect={(option: any) => onSelect(option)}
      style={{ width: 150 }}
    >
      {relationTypeDefs.map((r) => (
        <Select.Option key={r.Id} value={r.Id}>
          {direction === "OUTWARD"
            ? r.OutwardOperationName
            : r.InwardOperationName}
        </Select.Option>
      ))}
    </Select>
  );
};
