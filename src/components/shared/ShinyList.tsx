import { ArrowRightOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { FlexBasicLayout } from "./FlexBasicLayout";
import { Button } from "./primitives/Button";
import { Empty } from "./primitives/Empty";
import { Space } from "./primitives/Space";
import { Title } from "./primitives/Title";
import { blue } from "@ant-design/colors";

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
  border-top: 1px solid ${blue[2]};
  cursor: pointer;
  display: flex;
  align-items: center;
  background-color: ${blue[0]};

  &:hover {
    background-color: ${blue[1]};
  }

  &:last-child {
    border-bottom: 1px solid ${blue[2]};
  }
`;

export const ShinyList = <T extends { Id: number }>({
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
              <Button type="primary" onClick={onNewClick}>
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
              <Button type="primary" onClick={onNewClick}>
                {newButtonText}
              </Button>
            </Space>
          </>
        </Empty>
      )}
      {dataSource.map((r) => (
        <Item
          key={r.Id}
          onClick={() => {
            if (onClick) {
              onClick(r);
            }
          }}
        >
          <div style={{ flex: 1 }}>
            <div>{r[nameProp] as unknown as string}</div>
            {subtitleProp && <div>{r[subtitleProp] as unknown as string}</div>}
          </div>
          <ArrowRightOutlined />
        </Item>
      ))}
    </Wrapper>
  );
};
