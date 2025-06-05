import { useContext } from "react";
import PrintSettingsContext from "./PrintSettingsContext";

function usePrintSettings() {
  const context = useContext(PrintSettingsContext);
  if (context === undefined) {
    throw new Error("usePrintSettings must be used within a PrintSettingsProvider");
  }
  return context;
}

export default usePrintSettings;
