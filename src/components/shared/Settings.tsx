import styled from "styled-components";
import React, { useState } from "react";

export const Wrapper = styled.div`
  display: flex;
`;

export const Left = styled.div`
  min-width: 250px;
  background-color: #f6f6f6;
`;

export const LeftMenuItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  width: 100%;
  background-color: ${(props) => (props.$selected ? "#eaeaea" : "inherit")};
  transition: all 100ms ease-in;
  flex-shrink: 0;
  color: #444444;

  div {
    margin-left: 10px;
    flex: 1;
  }

  &:hover {
    cursor: pointer;
    background-color: #eaeaea;
  }
`;

export const Right = styled.div`
  flex: 1;
  min-height: 500px;
  padding: 16px;
`;

export const RightTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 16px;
  color: #444444;
`;

export type SettingsProps = {
  containerType: "modal" | "page";
  items: { name: string; icon: React.ReactNode; element: React.ReactNode }[];
};

export const Settings: React.FC<SettingsProps> = ({ items, containerType }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  return (
    <Wrapper>
      <Left
        style={{
          height: containerType === "modal" ? "700px" : "calc(100vh - 45px)",
          overflowY: containerType === "modal" ? "auto" : "hidden",
        }}
      >
        {items.map((item, i) => (
          <LeftMenuItem
            key={item.name}
            onClick={() => setActiveItemIndex(i)}
            $selected={activeItemIndex === i}
          >
            <span>{item.icon}</span>
            <div>{item.name}</div>
          </LeftMenuItem>
        ))}
      </Left>
      <Right>
        <RightTitle>{items[activeItemIndex].name}</RightTitle>
        {items[activeItemIndex].element}
      </Right>
    </Wrapper>
  );
};
