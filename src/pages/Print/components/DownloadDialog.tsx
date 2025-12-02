import { useCallback, useState } from "react";
import {
  Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle,
  FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField, Tooltip, Typography
} from "@mui/material";
import Link from "@mui/icons-material/Link";
import Download from "@mui/icons-material/Download";

import * as ScreenShot from "modern-screenshot";
import JSZip from "jszip";
import FileSaver from "file-saver";

import { PrintSettingsType } from "./PrintSettingsContext";
import usePrintSettings from "./usePrintSettings";
import { useSearchParams } from "react-router-dom";

import { hide } from "../printStyles";

const MAX_DPI = 300;

export default function DownloadDialog() {
  const [dialogOpen, setDialog] = useState(false);
  const [fileName, setFileName] = useState("GB-cards.zip");
  const [imgType, setImgType] = useState("png");
  const [waiting, setWaiting] = useState(false);

  const [searchParams] = useSearchParams();
  const debug = searchParams.has("debug");

  const settings = usePrintSettings();
  const {
    width, setWidth,
    height, setHeight,
    doubleCard, setDouble,
    withBleed, setBleed
  } = settings;

  const widthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const w = Number(e.target.value);
    if (Number.isNaN(w)) return;
    if (w > (MAX_DPI * (
      doubleCard ?
        (withBleed ? 5.25 : 5) :
        (withBleed ? 2.75 : 2.5)
    ))) return;
    const h = withBleed
      ? w * 15 / (doubleCard ? 21 : 11)
      : w * 7 / (doubleCard ? 10 : 5);
    setWidth(w);
    setHeight(h);
  }, [doubleCard, withBleed, setHeight, setWidth]);

  const heightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const h = Number(e.target.value);
    if (Number.isNaN(h)) return;
    if (h > (MAX_DPI * (withBleed ? 3.75 : 3.5))) return;
    const w = withBleed
      ? h * (doubleCard ? 21 : 11) / 15
      : h * (doubleCard ? 10 : 5) / 7;
    setWidth(w);
    setHeight(h);
  }, [doubleCard, withBleed, setHeight, setWidth]);

  return (<>
    <Tooltip title="Download Images" arrow>
      <IconButton size="small" onClick={() => setDialog(true)} >
        <Download />
      </IconButton>
    </Tooltip>
    <Dialog open={dialogOpen} onClose={() => setDialog(false)} >
      <DialogTitle>Download Card Images</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Box>
            <Typography variant="caption" >
              Card Options:
            </Typography>
            <Box sx={{ border: 1, borderRadius: 1, borderColor: 'action.disabled', p: 1 }}>
              <Stack direction="row" justifyContent={"space-evenly"}>
                <FormControlLabel
                  label="Double Wide"
                  control={
                    <Checkbox
                      checked={doubleCard}
                      onChange={() => setDouble(!doubleCard)}
                    />
                  }
                />
                <FormControlLabel
                  label="Print Bleed"
                  control={
                    <Checkbox
                      checked={withBleed}
                      onChange={() => setBleed(!withBleed)}
                    />
                  }
                />
              </Stack>
            </Box>
          </Box>
          <Stack direction="row" justifyContent='space-between'>
            <Typography variant="caption">
              Image Size:
            </Typography>
            <Typography variant="caption" >
              {`(DPI: ${height / (withBleed ? 3.75 : 3.5)})`}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label="width" size="small"
              value={width.toFixed(0)} onChange={widthChange}
            />
            <Link />
            <TextField
              label="height" size="small"
              value={height.toFixed(0)} onChange={heightChange}
            />
          </Stack>
          <Box>
            <Typography variant="caption">
              Image Type:
            </Typography>
            <Box sx={{ border: 1, borderRadius: 1, borderColor: 'action.disabled', p: 1 }}>
              <RadioGroup row sx={{ justifyContent: "space-evenly" }}
                value={imgType}
                onChange={(e: React.ChangeEvent) => {
                  setImgType((e.target as HTMLInputElement).value);
                }}>
                <FormControlLabel value="png" control={<Radio />} label="PNG" />
                <FormControlLabel value="jpeg" control={<Radio />} label="JPEG" />
              </RadioGroup>
            </Box>
          </Box>
          <Typography variant="caption">
            Download File:
          </Typography>
          <TextField
            label="file name" size="small" value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <Button
            variant="contained"
            disabled={waiting}
            onClick={() => {
              setWaiting(true);
              downloadCards(fileName, imgType, settings, debug).finally(() => {
                setWaiting(false);
                setDialog(false);
              });
            }}
            sx={{ position: 'relative' }}
          >
            Download
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                display: waiting ? 'block' : 'none',
                animationPlayState: waiting ? 'running' : 'paused',
                color: 'success.main',
                top: '50%',
                left: '0%',
                marginTop: '-12px',
                marginLeft: '12px',
              }}
            />
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  </>)
}

// import workerUrl from 'modern-screenshot/worker?url';

async function getCanvasBlob(canvas: HTMLCanvasElement, type?: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create image from canvas.'));
      }
    }, type);
  });
}

const MAX_WINDOW = 25;

async function downloadCards(
  fileName: string, type: string,
  settings: PrintSettingsType, debug?: boolean) {
  if (!fileName || !settings) return;

  const { doubleCard, withBleed, height, width } = settings;

  const elements = Array.from(document.querySelectorAll(`#Cards .card:not(.${hide})`));
  if (elements.length === 0) return;

  const root = document.querySelector<HTMLElement>('#root');

  const windowSize = Math.min(
    MAX_WINDOW,
    Math.floor(32767 / width),
    Math.floor(32767 / height),
    Math.floor((4096 * 4096) / (width * height))
  );

  const container = document.createElement('div');
  container.style.width =
    doubleCard
      ? withBleed ? '1050px' : '1000px'
      : withBleed ? '550px' : '500px';
  container.style.height = `${(withBleed ? 750 : 700) * Math.min(elements.length, windowSize)}px`;
  container.style.display = 'flex';
  container.style.flexDirection = "column";

  const saved_root_overflow = root!.style.overflow;
  root!.style.overflow = 'hidden';
  root!.appendChild(container);

  const context = await ScreenShot.createContext(container, {
    debug: debug,
    // workerUrl,
    // workerNumber: 1,
    scale: (height / (withBleed ? 750 : 700)),
  })

  const zip = new JSZip();

  for (let i = 0; i < elements.length; i += windowSize) {

    context.svgStyleElement?.appendChild(document.createTextNode(
      '.dropcap span::first-letter { vertical-align: -7.5%; }'
    ));

    const window = elements.slice(i, i + windowSize);

    for (const el of window) {
      const innerCard = el.firstElementChild!.cloneNode(true) as HTMLElement;

      const isDouble = el.classList.contains('double');
      innerCard.style.width =
        isDouble
          ? withBleed ? '1050px' : '1000px'
          : withBleed ? '550px' : '500px';
      innerCard.style.height = withBleed ? '750px' : '700px';
      innerCard.style.setProperty('--scale', '1');

      container.appendChild(innerCard);
    };

    const canvas = await ScreenShot.domToCanvas(context).catch((err) => console.error(err));

    while (container.lastElementChild) {
      container.removeChild(container.lastElementChild);
    }

    for (let j = 0; j < window.length; j++) {
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = width;
      cardCanvas.height = height;
      const cardContext = cardCanvas.getContext('2d');
      cardContext!.drawImage(canvas!, 0, j * height, width, height, 0, 0, width, height);
      const blob = await getCanvasBlob(cardCanvas, `image/${type}`);
      if (debug) {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onclick = () => {
          root!.removeChild(img);
        }
        root!.appendChild(img);
      } else {
        zip.file(`${window[j].id}.${type}`, blob);
      }
    }
  }

  ScreenShot.destroyContext(context);
  root!.removeChild(container);
  root!.style.overflow = saved_root_overflow;

  if (!debug) {
    const blob = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(blob, fileName);
  }
}
