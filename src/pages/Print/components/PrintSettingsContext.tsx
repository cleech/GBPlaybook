import { createContext, useContext } from "react";

export interface PrintSettingsType {
  doubleCard: boolean;
  setDouble: (b: boolean) => void;
  withBleed: boolean;
  setBleed: (b: boolean) => void;
  width: number;
  setWidth: (w: number) => void;
  height: number;
  setHeight: (h: number) => void;
  noFun: boolean;
  setNoFun: (b: boolean) => void;
}

const PrintSettingsContext = createContext<PrintSettingsType | undefined>(undefined);
export default PrintSettingsContext.Provider;

export function usePrintSettings() {
  const context = useContext(PrintSettingsContext);
  if (context === undefined) {
    throw new Error("usePrintSettings must be used within a PrintSettingsProvider");
  }
  return context;
}
