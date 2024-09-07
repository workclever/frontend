import React from "react";

type Props = {
  children: React.ReactNode;
  textAlign?: "center" | "left";
};

export const Empty: React.FC<Props> = ({ children, textAlign = "center" }) => (
  <div
    style={{
      textAlign,
      color: "#00000073",
      padding: 12,
      fontSize: 13,
    }}
  >
    {children}
  </div>
);
