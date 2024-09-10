import { createContext, useContext } from "react";

import invariant from "tiny-invariant";

export type ColumnContextProps = {
  columnId: number;
  getCardIndex: (id: number) => number;
  getNumCards: () => number;
};

export const ColumnContext = createContext<ColumnContextProps | null>(null);

export function useColumnContext(): ColumnContextProps {
  const value = useContext(ColumnContext);
  invariant(value, "cannot find ColumnContext provider");
  return value;
}
