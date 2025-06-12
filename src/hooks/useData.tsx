import { use } from "react";
import { DataContext } from "../utils/contexts";

export const useData = () => {
  return use(DataContext);
};
