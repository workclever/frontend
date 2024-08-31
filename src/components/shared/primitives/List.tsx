import { styled } from "styled-components";

interface ListProps<T> {
  dataSource: T[];
  renderItem: (item: T) => React.ReactNode;
}

export const HoverableListItem = styled.div`
  &:hover {
    background-color: #f9f8f8;
    cursor: pointer;
  }
`;

export function List<T>({
  dataSource,
  renderItem,
}: ListProps<T>): React.ReactElement {
  return (
    <div>
      {dataSource.map((item, index) => (
        <HoverableListItem key={index}>{renderItem(item)}</HoverableListItem>
      ))}
    </div>
  );
}
