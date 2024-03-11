import { useContext } from "react";
import { DataContext } from "../components/DataContext";

export const useData = () => {
  return useContext(DataContext);
};
