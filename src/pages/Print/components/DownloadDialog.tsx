import { useCallback, useState } from "react";
import {
  Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle,
  FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography
} from "@mui/material";
import Link from "@mui/icons-material/Link";
import Download from "@mui/icons-material/Download";

import * as ScreenShot from "modern-screenshot";
import JSZip from "jszip";
import FileSaver from "file-saver";

import { PrintSettingsType } from "./PrintSettingsContext";
import usePrintSettings from "./usePrintSettings";
import { useSearchParams } from "react-router-dom";

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
    const h = withBleed
      ? w * 15 / (doubleCard ? 21 : 11)
      : w * 7 / (doubleCard ? 10 : 5);
    setWidth(w);
    setHeight(h);
  }, [doubleCard, withBleed, setHeight, setWidth]);

  const heightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const h = Number(e.target.value);
    if (Number.isNaN(h)) return;
    const w = withBleed
      ? h * (doubleCard ? 21 : 11) / 15
      : h * (doubleCard ? 10 : 5) / 7;
    setWidth(w);
    setHeight(h);
  }, [doubleCard, withBleed, setHeight, setWidth]);

  return (<>
    <IconButton size="small" onClick={() => setDialog(true)} >
      <Download />
    </IconButton>
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
          <Typography variant="caption">
            Image Size:
          </Typography>
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

async function downloadCards(
  fileName: string, type: string,
  settings: PrintSettingsType, debug?: boolean) {
  if (!fileName || !settings) return;

  const { withBleed, height } = settings;

  const elements = document.querySelectorAll('.card:not(.hide)');
  if (elements.length === 0) return;

  const files: { file: string, blob: Blob }[] = [];

  const promises = Array.from(elements).map(async (el) => {

    const copiedNode = el.cloneNode(true) as HTMLElement;
    const container = copiedNode.firstElementChild as HTMLElement;

    container.style.visibility = 'hidden';
    const isDouble = el.classList.contains('double');
    container.style.width =
      isDouble
        ? withBleed ? '1050px' : '1000px'
        : withBleed ? '550px' : '500px';
    container.style.height = withBleed ? '750px' : '700px';
    container.style.setProperty('--scale', '1');

    document.body.appendChild(copiedNode);

    const context = await ScreenShot.createContext(container, {
      debug: debug,
      type: `image/${type}`,
      scale: (height / (withBleed ? 750 : 700)),
    })
    // modern-screenshot trys to do everything with applied styles,
    //  but it misses ::first-letter pseudo-elements
    // Just inject the CSS rule and it will get applied again in the SVG
    context.svgStyleElement?.appendChild(document.createTextNode(
      '.dropcap span::first-letter { vertical-align: -7.5%; }'
    ));

    const blob = await ScreenShot.domToBlob(context);
    document.body.removeChild(copiedNode);

    if (debug) {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onclick = () => document.body.removeChild(img);
      document.body.appendChild(img);
    } else {
      files.push({ file: `${el.id}.${type}`, blob });
    }
  });

  await Promise.all(promises);

  if (files.length !== 0) {
    const zip = new JSZip();
    for (const { file, blob } of files) {
      zip.file(file, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(blob, fileName);
  }
}
