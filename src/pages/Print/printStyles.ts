import { css } from "@emotion/css";

export const printGlobal = {
  '@media print': {
    '@page': {
      size: 'auto',
      margin: '0.25in',
    },
    header: {
      display: 'none !important'
    },
    '.MuiTooltip-popper': {
      display: 'none !important'
    },
  }
};

export const hide = css({
  display: 'none !important',
});

export const noPrint = css({
  '@media print': {
    display: 'none !important',
  }
});

export const printMain = css({
  '@media screen': {
    overflow: 'hidden'
  },
});

export const controls = css({
  display: 'flex',
  flexDirection: 'column',
  /* background-color: #282c34, */
  /* color: white, */
});

export const guild = css({
  boxSizing: 'initial',
  display: 'inline-flex',
  justifyContent: 'space-between',
  backgroundImage: `linear-gradient(
    to right,
    transparent 1em,
    black 1em,
    var(--color) 3em,
    var(--color) 9em,
    black calc(100% - 1em),
    transparent calc(100% - 1em)
  )`,
  textShadow: '0.1em 0.1em 0.1em black',

  '&::after': {
    width: '0.25em',
    borderLeft: '0.75em solid black',
    borderTop: '1em solid transparent',
    borderBottom: '1em solid transparent',
    display: 'inline-block',
    content: '""',
    margin: 0,
    padding: 0,
  },

  svg: {
    filter: 'drop-shadow(0px 0px 2px black)',
  },
});

export const cards = css({
  display: 'block',
  '.card': {
    display: 'inline-block',
    boxSizing: 'content-box',
    breakInside: 'avoid',
    border: 'thin solid black',
    margin: '0.0625in'
  },
  '@media screen': {
    overflowY: 'auto',
  },
  '@media print': {
    padding: '0 !important',
    '.card': {
      display: 'inline-block',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
      margin: '0.0625in',
      border: 'none',
    },
  },
});

export const modelListContainer = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'flex-start',
});

export const modelCheckbox = css({
  margin: '0.25em',
  paddingRight: '0.5em',
  textShadow: '0.1em 0.1em 0.1em black',
  backgroundImage: `linear-gradient(to right, var(--color1) 10%, var(--color2) 90%)`,
  order: 'var(--major-order)',
  '&.minor': {
    order: 'var(--minor-order)',
  },
  '&:is(.Compound, .Lucky)': {
    order: 'calc(var(--major-order) + 1)',
  },
  '.MuiCheckbox-root': {
    padding: '0.25em',
  },
});
