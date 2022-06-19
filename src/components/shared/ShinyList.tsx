import { ArrowRightOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { FlexBasicLayout } from "./FlexBasicLayout";
import { Button } from "./primitives/Button";
import { Empty } from "./primitives/Empty";
import { Space } from "./primitives/Space";
import { Title } from "./primitives/Title";

type Props<T> = {
  title?: string;
  nameProp: keyof T;
  subtitleProp?: keyof T;
  dataSource: T[];
  onClick?: (r: T) => void;
  newButtonText?: string;
  onNewClick?: () => void;
  noDataText?: string;
};

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Item = styled.div`
  padding: 16px;
  border-top: 2px solid var(--gray3);
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--mauve12);
  background-color: var(--purple2);

  &:hover {
    background-color: var(--purple3);
  }

  &:last-child {
    border-bottom: 2px solid var(--gray4);
  }
`;

const Subtitle = styled.div`
  color: var(--mauve10);
`;

export const ShinyList = <T,>({
  title,
  dataSource,
  nameProp,
  subtitleProp,
  onClick,
  newButtonText,
  onNewClick,
  noDataText,
}: Props<T>) => {
  return (
    <Wrapper>
      <div style={{ marginBottom: 16 }}>
        <FlexBasicLayout
          left={<Title level={4}>{title}</Title>}
          right={
            dataSource.length > 0 ? (
              <Button type="primary" size="large" onClick={onNewClick}>
                {newButtonText}
              </Button>
            ) : (
              <></>
            )
          }
        />
      </div>
      {dataSource.length === 0 && (
        <Empty>
          <>
            <Space direction="vertical">
              <span>{noDataText}</span>
              <Button type="primary" size="large" onClick={onNewClick}>
                {newButtonText}
              </Button>
            </Space>
          </>
        </Empty>
      )}
      {dataSource.map((r) => (
        <Item
          key={(r as any)["Id"]}
          onClick={() => {
            onClick && onClick(r);
          }}
        >
          <div style={{ flex: 1 }}>
            <div>{r[nameProp] as any}</div>
            <Subtitle>
              {subtitleProp && <div>{r[subtitleProp] as any}</div>}
            </Subtitle>
          </div>
          <ArrowRightOutlined style={{ color: "var(--mauve10)" }} />
        </Item>
      ))}
    </Wrapper>
  );
};
