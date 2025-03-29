import { useContext } from "react";
import { DataContext } from "../utils/contexts";

export const useData = () => {
  return useContext(DataContext);
};
