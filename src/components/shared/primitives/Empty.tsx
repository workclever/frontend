import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Empty: React.FC<Props> = ({ children }) => (
  <div
    style={{
      textAlign: "center",
      color: "#00000073",
      padding: 12,
      fontSize: 13,
    }}
  >
    {children}
  </div>
);
