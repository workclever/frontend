import { PageHeader } from "@ant-design/pro-components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutRightContent } from "./LayoutRightContent";

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
    <div className="inside-content">
      <PageHeader
        ghost={false}
        onBack={goBack}
        backIcon={hideBackButton}
        title={title}
        subTitle={subTitle}
        extra={[<LayoutRightContent key="1" />]}
      ></PageHeader>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
};
