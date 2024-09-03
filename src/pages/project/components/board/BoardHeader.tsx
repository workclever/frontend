import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { Input, Segmented } from "antd";
import { debounce } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectBoardViewType,
  setBoardFilter,
  setBoardViewType,
} from "@app/slices/project/projectSlice";
import { BoardViewType } from "@app/types/Project";
import { BoardUserAvatars } from "./BoardUserAvatars";
import { LayoutRightContent } from "@app/layout/LayoutRightContent";
import { Space } from "@app/components/shared/primitives/Space";
import { Divider } from "@app/components/shared/primitives/Divider";

const Wrapper = styled.div`
  height: 45px;
  width: calc(100% - 250px);
  display: flex;
  align-items: center;
  padding: 0px 8px;
  position: fixed;
  top: 0px;
  left: 250px;
  z-index: 1;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
`;

const FilterInput = () => {
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
      style={{ width: 180 }}
      placeholder="Filter tasks..."
      variant="borderless"
    />
  );
};

export const BoardHeader: React.FC = () => {
  const dispatch = useDispatch();
  const boardViewType = useSelector(selectBoardViewType);

  const updateBoardViewType = (type: BoardViewType) => {
    setTimeout(() => {
      dispatch(setBoardViewType(type));
    }, 300);
  };

  return (
    <Wrapper>
      <Space>
        <FilterInput />
        <BoardUserAvatars />
      </Space>
      <div style={{ flex: 1 }} />
      <Segmented
        size="small"
        value={boardViewType}
        onChange={(e) => updateBoardViewType(e as BoardViewType)}
        options={[
          {
            value: "kanban",
            icon: <AppstoreOutlined />,
          },
          {
            value: "list",
            icon: <BarsOutlined />,
          },
        ]}
      />
      <Divider type="vertical" style={{ height: "100%" }} />
      <LayoutRightContent />
    </Wrapper>
  );
};
