import React, { forwardRef } from "react";

export interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  horizontal?: boolean;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    { children, horizontal, onRemove, style, ...props }: ContainerProps,
    ref
  ) => {
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
