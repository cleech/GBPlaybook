import { Box, Breadcrumbs, Typography, useMediaQuery } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import { AppBarContent } from "../AppContent";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

declare module 'material-react-table' {
  interface MRT_ColumnDef<TData extends Record<string, any>> {
    manualRanges?: [[number, number], [number, number]];
  }
}

import { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import GBIcon from "../../components/GBIcon";
import { GBModelExpanded } from "../../models/gbdbTypes";
import { DoubleCard } from '../../components/DoubleCard';
import { DoubleRangeSlider } from './components/DoubleRangeSlider';
import { Playbook } from "./components/Playbook";

const columns: MRT_ColumnDef<GBModelExpanded>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    sortingFn: 'text',
    enableGrouping: false,
    Cell: ({ renderedCellValue, row }) => {
      const m = row.original;
      return <>{renderedCellValue} {`${(m.veteran ? ' (v)' : (m.seasoned ? ' (s)' : ''))}`}</>
    },
    filterVariant: 'autocomplete',
  },
  {
    header: 'Guild',
    id: 'guild',
    // size: 130,
    accessorFn: m => [m.guild1.name, m.guild2?.name].filter(Boolean),
    Cell: ({ cell }) => (
      <div style={{
        display: 'flex',
        alignItems: 'center', justifyContent: 'start',
      }}>
        {cell.getValue<string[]>().map((g) => (
          <div
            key={`${cell.id}-${g}`}
            style={{
              height: '1em', width: '38px',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              overflow: 'visible',
            }}>
            <GBIcon icon={g} className="dark" fontSize={32} />
          </div>
        ))}
      </div >),
    getGroupingValue: (row) => row.guild1.name,
    GroupedCell: ({ row }) => (
      <span style={{
        display: 'flex',
        alignItems: 'center', justifyContent: 'start',
        whiteSpace: 'pre',
      }}>
        <div style={{
          height: '1em', width: '38px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'visible',
        }}>
          <GBIcon icon={row.original.guild1.name} className="dark" fontSize={32} />
        </div >
        {`  (${row.subRows?.length})`}
      </span>
    ),
  },
  {
    header: 'HP',
    accessorKey: 'hp',
    // size: 116,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: { size: 'small' },
    aggregationFn: 'median',
    AggregatedCell: ({ cell }) => `Average: ${cell.getValue<number>().toFixed(0)}`,
  },
  {
    header: 'Recovery',
    accessorKey: 'recovery',
    // size: 156,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: { size: 'small' },
  },
  {
    header: 'MOV',
    id: 'mov',
    // size: 128,
    accessorFn: m => [m.jog, m.sprint],
    Cell: ({ cell }) => {
      const [jog, sprint] = cell.getValue<number[]>();
      return `${jog}″ / ${sprint}″`;
    },
    // manualRanges: [[0, 10], [0, 12]],
    Filter: (props) => <DoubleRangeSlider {...props} labels={['Jog', 'Sprint']}
      manualRanges={props.column.columnDef.manualRanges}
      muiSliderProps={[
        { valueLabelFormat: (value) => `${value}″` },
        { valueLabelFormat: (value) => `${value}″` }
      ]}
    />,
    filterFn: (row, _id, filterValues: [number, number, number, number]) => {
      const jog = row.original.jog;
      const sprint = row.original.sprint;
      return (
        (jog >= filterValues[0] && jog <= filterValues[1]) &&
        (sprint >= filterValues[2] && sprint <= filterValues[3])
      );
    }
  },
  {
    header: 'TAC',
    accessorKey: 'tac',
    // size: 128,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: { size: 'small' },
    aggregationFn: 'median',
    AggregatedCell: ({ cell }) => `Average: ${cell.getValue<number>().toFixed(0)}`
  },
  {
    header: 'KICK',
    id: 'kick',
    // size: 130,
    accessorFn: m => [m.kickdice, m.kickdist],
    Cell: ({ cell }) => {
      const [kickdice, kickdist] = cell.getValue<number[]>();
      return `${kickdice} / ${kickdist}″`;
    },
    // manualRanges: [[1, 5], [4, 8]],
    Filter: (props) => <DoubleRangeSlider {...props} labels={['Dice', 'Dist']} manualRanges={props.column.columnDef.manualRanges}
      muiSliderProps={[{},
      { valueLabelFormat: (value) => `${value}″` }
      ]}
    />,
    filterFn: (row, _id, filterValues: [number, number, number, number]) => {
      const kickdice = row.original.kickdice;
      const kickdist = row.original.kickdist;
      return (
        (kickdice >= filterValues[0] && kickdice <= filterValues[1]) &&
        (kickdist >= filterValues[2] && kickdist <= filterValues[3])
      );
    }
  },
  {
    header: 'DEF',
    accessorKey: 'def',
    // size: 128,
    Cell: ({ renderedCellValue }) => <>{renderedCellValue}+</>,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: {
      size: 'small',
      valueLabelFormat: (value) => `${value}+`,
    },
    aggregationFn: 'median',
    AggregatedCell: ({ cell }) => `Average: ${cell.getValue<number>().toFixed(0)}`
  },
  {
    header: 'ARM',
    accessorKey: 'arm',
    // size: 128,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: { size: 'small' },
    aggregationFn: 'median',
    AggregatedCell: ({ cell }) => `Average: ${cell.getValue<number>().toFixed(0)}`
  },
  {
    header: 'INF',
    id: 'inf',
    // size: 128,
    accessorFn: m => [m.inf, m.infmax],
    Cell: ({ cell }) => {
      const [inf, infmax] = cell.getValue<number[]>();
      return `${inf} / ${infmax}`;
    },
    // manualRanges: [[0, 6], [0, 7]],
    Filter: (props) => <DoubleRangeSlider {...props} labels={['Pool', 'Max']} manualRanges={props.column.columnDef.manualRanges} />,
    filterFn: (row, _id, filterValues: [number, number, number, number]) => {
      const inf = row.original.inf;
      const infmax = row.original.infmax;
      return (
        (inf >= filterValues[0] && inf <= filterValues[1]) &&
        (infmax >= filterValues[2] && infmax <= filterValues[3])
      );
    }
  },
  {
    header: 'Melee',
    id: 'melee',
    // size: 136,
    accessorFn: m => m.reach ? 2 : 1,
    Cell: ({ renderedCellValue }) => <>{renderedCellValue}″</>,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: {
      size: 'small',
      valueLabelFormat: (value) => `${value}″`,
    },
  },
  {
    header: 'Base',
    accessorKey: 'base',
    // size: 130,
    Cell: ({ renderedCellValue }) => <>{renderedCellValue} mm</>,
    filterVariant: 'range-slider',
    filterFn: 'betweenInclusive',
    muiFilterSliderProps: {
      size: 'small', max: 50, min: 30, step: 10,
      valueLabelFormat: (value) => `${value} mm`,
    },
  },
  {
    header: 'Plays',
    id: 'plays',
    size: 215,
    enableGrouping: false,
    accessorFn: m => m.character_plays.map(cp => cp.name),
    filterFn: 'fuzzyArrIncludes',
    Cell: ({ cell }) => (<>
      {cell.getValue<string[]>().map((s, i) => <div key={`${cell.id}-${i}`}>{s}</div>)}
    </>)
  },
  {
    header: 'Traits',
    id: 'traits',
    size: 240,
    enableGrouping: false,
    accessorFn: m => m.character_traits.map(cp => cp.name),
    filterFn: 'fuzzyArrIncludes',
    Cell: ({ cell }) => (<>
      {cell.getValue<string[]>().map((s, i) => <div key={`${cell.id}-${i}`}>{s}</div>)}
    </>)
  },
  {
    header: 'Heroic',
    id: 'heroic',
    size: 215,
    enableGrouping: false,
    accessorFn: m => m.heroic?.split('\n', 1)[0]?.replace(/ \[.*\]/, ''),
  },
  {
    header: 'Legendary',
    id: 'legendary',
    size: 245,
    enableGrouping: false,
    accessorFn: m => m.legendary?.split('\n', 1)[0]?.replace(/ \[.*\]/, ''),
  },
  {
    header: 'tags',
    id: 'tags',
    size: 250,
    enableGrouping: false,
    // accessorFn: m => m.types.split(/, |,\n/),
    accessorFn: m => m.types.split(/\n/),
    filterFn: 'fuzzyArrIncludes',
    Cell: ({ cell }) => (<>
      {cell.getValue<string[]>().map((s, i) => <div key={`${cell.id}-${i}`}>{s}</div>)}
    </>)
  },
  {
    header: 'Playbook',
    id: 'playbook',
    accessorKey: 'playbook',
    Cell: ({ row }) => <Playbook model={row.original} size={30} />,
  },
];

const fuzzyArrIncludes: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  const value = row.getValue(columnId);
  if (Array.isArray(value)) {
    const ranks = value.map(item => rankItem(item, filterValue));
    const best = ranks.find(rank => rank.passed);
    if (best) {
      addMeta({ itemRank: best });
      return true;
    }
  }
  return false;
}

export default function DataScreen() {
  const data = useLoaderData<GBModelExpanded[]>();

  /* these need to match material-data-table/MRT_TopToolbar */
  const isTablet = useMediaQuery('(max-width:1024px)');
  const isMobile = useMediaQuery('(max-width:720px)');
  /* had to figure this out one myself */
  const willSearchWrap = useMediaQuery('(max-width:551px)');

  const table = useMaterialReactTable({
    data,
    columns,
    // layoutMode: 'grid-no-grow',
    renderDetailPanel: ({ row }) => (
      <Box sx={{ position: 'sticky', left: '16px', zIndex: 1, width: 'fit-content', }}>
        <DoubleCard model={row.original} />
      </Box>
    ),

    defaultColumn: {
      size: 0,
    },

    /* Things I want on */
    enableSorting: true,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableFacetedValues: true,
    // enableColumnFilterModes: true,

    /* Things I want off */
    enablePagination: false,
    enableBottomToolbar: false,
    enableRowOrdering: false,
    enableColumnDragging: false,

    filterFns: {
      fuzzyArrIncludes: fuzzyArrIncludes,
    },

    initialState: {
      sorting: [{ id: 'name', desc: false }],
      // grouping: ['guild'],
      // expanded: true,
      columnPinning: { left: ['mrt-row-expand'] },
      columnVisibility: {
        'playbook': false,
        'plays': false,
        'traits': false,
        'heroic': false,
        'legendary': false,
        'tags': false,
      },
    },

    muiTablePaperProps: ({ table }) => (
      table.getState().isFullScreen ? {} : {
        sx: {
          margin: '1rem',
          borderRadius: '1em',
        }
      }
    ),
    muiTableContainerProps: ({ table }) => {
      const state = table.getState();
      /* I really hate this */
      let toolbarHeight = 56;
      if (state.showAlertBanner || state.grouping.length) {
        toolbarHeight += 8;
        if (isMobile || (isTablet && state.showGlobalFilter)) {
          toolbarHeight += 56;
        }
      }
      if (state.showGlobalFilter && willSearchWrap) { toolbarHeight += 48; }
      return table.getState().isFullScreen ? {} : {
        sx: { maxHeight: `calc(100dvh - 48px - ${toolbarHeight}px - 2rem)`, }
      }
    },
    // muiToolbarAlertBannerProps: { slotProps: { message: { sx: { padding: 0 } } } },
  });

  return (
    <Box component={"main"}>
      <AppBarContent>
        <Breadcrumbs>
          <Typography>Data Table</Typography>
        </Breadcrumbs>
      </AppBarContent>
      <MaterialReactTable table={table} />
    </Box>
  )
}
