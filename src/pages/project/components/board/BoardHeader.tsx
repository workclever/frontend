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
} from "../../../../slices/projectSlice";
import { BoardViewType } from "../../../../types/Project";
import { BoardUserAvatars } from "./BoardUserAvatars";
import { LayoutRightContent } from "../../../../layout/LayoutRightContent";
import { Space } from "../../../../components/shared/primitives/Space";
import { Divider } from "../../../../components/shared/primitives/Divider";

const Wrapper = styled.div`
  height: 45px;
  width: calc(100% - 250px);
  background-color: var(--gray1);
  display: flex;
  align-items: center;
  padding: 0px 8px;
  position: fixed;
  top: 0px;
  left: 250px;
  z-index: 1;
  border-bottom: 1px solid var(--gray3);
`;

const SearchInput = () => {
  const dispatch = useDispatch();
  const onChange = debounce((e: any) => {
    dispatch(
      setBoardFilter({
        key: "searchText",
        value: e.target.value,
      })
    );
  }, 200);
  return (
    <Input
      allowClear
      onChange={onChange}
      style={{ width: 180 }}
      placeholder="Search tasks"
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
        <SearchInput />
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
