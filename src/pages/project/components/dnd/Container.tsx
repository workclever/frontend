import React, { forwardRef } from "react";

export interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, style, ...props }: ContainerProps, ref) => {
    return (
      <div
        {...props}
        ref={ref as any}
        style={
          {
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }
);
