import React, { useEffect, useMemo, useState } from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { type MRT_Column, type MRT_TableInstance } from 'material-react-table';

interface DoubleRangeSliderProps<TData extends Record<string, any>> {
  column: MRT_Column<TData>;
  table: MRT_TableInstance<TData>;
  labels?: [string, string];
}

export const DoubleRangeSlider = <TData extends Record<string, any>>({
  column,
  table,
  labels = ['Range 1', 'Range 2'],
}: DoubleRangeSliderProps<TData>) => {
  const { getPreFilteredRowModel } = table;
  const { id: columnId } = column;

  const [min1, max1, min2, max2] = useMemo(() => {
    let min1 = Infinity, max1 = -Infinity;
    let min2 = Infinity, max2 = -Infinity;

    getPreFilteredRowModel().rows.forEach(row => {
      const [v1, v2] = row.getValue<[number, number]>(columnId);
      if (v1 < min1) min1 = v1;
      if (v1 > max1) max1 = v1;
      if (v2 < min2) min2 = v2;
      if (v2 > max2) max2 = v2;
    });
    return [min1, max1, min2, max2];

  }, [getPreFilteredRowModel, columnId]);

  const columnFilterValue = column.getFilterValue() as [number, number, number, number] | undefined;

  const [filterValues, setFilterValues] = useState<[number, number, number, number]>(
    () =>
      columnFilterValue ?? [min1, max1, min2, max2]
  );

  useEffect(() => {
    setFilterValues(columnFilterValue ?? [min1, max1, min2, max2]);
  }, [columnFilterValue, min1, max1, min2, max2]);

  const handleSliderChange = (
    index: 0 | 1,
    value: number | number[]
  ) => {
    const newFilterValues = [...filterValues] as [number, number, number, number];
    if (index === 0) { // First slider
      newFilterValues[0] = (value as number[])[0];
      newFilterValues[1] = (value as number[])[1];
    } else { // Second slider
      newFilterValues[2] = (value as number[])[0];
      newFilterValues[3] = (value as number[])[1];
    }
    setFilterValues(newFilterValues);
  };
  
  const handleApplyFilter = () => {
    column.setFilterValue(filterValues);
  };

  return (
    <Box sx={{ p: 2, width: 250 }}>
      <Typography>{labels[0]}</Typography>
      <Slider
        value={[filterValues[0], filterValues[1]]}
        onChange={(event, value) => handleSliderChange(0, value)}
        onChangeCommitted={handleApplyFilter}
        valueLabelDisplay="auto"
        min={min1}
        max={max1}
      />
      <Typography>{labels[1]}</Typography>
      <Slider
        value={[filterValues[2], filterValues[3]]}
        onChange={(event, value) => handleSliderChange(1, value)}
        onChangeCommitted={handleApplyFilter}
        valueLabelDisplay="auto"
        min={min2}
        max={max2}
      />
    </Box>
  );
};

export default DoubleRangeSlider;
