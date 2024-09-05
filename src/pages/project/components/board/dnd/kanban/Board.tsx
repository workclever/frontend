import React, { forwardRef, memo, type ReactNode, useEffect } from "react";

import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

import { useBoardContext } from "./board-context";

type BoardProps = {
  children: ReactNode;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children }: BoardProps, ref) => {
    const { instanceId } = useBoardContext();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      });
    }, [instanceId]);

    return (
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "250px",
          gap: "8px",
          height: "calc(100vh - 90px)",
          overflowX: "auto",
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default memo(Board);
