import { useTaskRelationTypeDefs } from "../../../../../hooks/useTaskRelationTypeDefs";
import { TaskRelationType } from "../../../../../types/Project";
import AtlasKitSelect from "@atlaskit/select";

export const RelationTypeSelector: React.FC<{
  value?: number;
  onSelect: (relationTypeDefId: number) => void;
  direction?: TaskRelationType["RelationTypeDirection"];
}> = ({ value, onSelect, direction }) => {
  const relationTypeDefs = useTaskRelationTypeDefs();
  const valueRelationTypeDef = relationTypeDefs?.find((r) => r.Id === value);
  return (
    <AtlasKitSelect
      value={{
        value,
        label:
          direction === "OUTWARD"
            ? valueRelationTypeDef?.OutwardOperationName
            : valueRelationTypeDef?.InwardOperationName,
      }}
      placeholder="Relation type"
      onChange={(option) => onSelect(Number(option?.value))}
      options={relationTypeDefs.map((r) => {
        return {
          value: r.Id,
          label:
            direction === "OUTWARD"
              ? r.OutwardOperationName
              : r.InwardOperationName,
        };
      })}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      // zIndex has to be higher than Modal to be visible
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        container: (base) => ({ ...base, width: "150px" }),
      }}
    />
  );
};
