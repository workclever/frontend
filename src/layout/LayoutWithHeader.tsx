import React from "react";
import { useNavigate } from "react-router-dom";
import { HeaderRightContent } from "./HeaderRightContent";
import styled from "styled-components";
import { ArrowLeftIcon } from "lucide-react";

const Header = styled.div`
  height: 45px;
  width: 100%;
  display: flex;
  padding: 0px 16px;
  align-items: center;
  gap: 8px;
  box-shadow: var(--box-shadow);
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: gray;
`;

const BackIcon = styled.span`
  width: 30px;
  cursor: pointer;
`;

export const LayoutWithHeader: React.FC<{
  children: React.ReactElement;
  title?: string;
  subTitle?: string;
  hideBackButton?: boolean;
}> = ({ children, title, subTitle, hideBackButton }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        overflowX: "auto",
        overflowY: "auto",
        height: "calc(100vh - 20px)",
      }}
    >
      <Header>
        {hideBackButton !== true && (
          <BackIcon onClick={goBack}>
            <ArrowLeftIcon size={20} />
          </BackIcon>
        )}
        <TitleWrapper>
          <Title>{title}</Title>
          <Subtitle>{subTitle}</Subtitle>
        </TitleWrapper>
        <HeaderRightContent key="1" />
      </Header>
      <div></div>
      <div>{children}</div>
    </div>
  );
};
