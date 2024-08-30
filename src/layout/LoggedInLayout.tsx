import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const LoggedInLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};
