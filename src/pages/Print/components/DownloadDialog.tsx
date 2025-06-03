import { useCallback, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import Link from "@mui/icons-material/Link";
import Download from "@mui/icons-material/Download";

import * as htmlToImage from "html-to-image";
import JSZip from "jszip";
import FileSaver from "file-saver";

import { PrintSettingsType, usePrintSettings } from "./PrintSettingsContext";

export default function DownloadDialog() {
  const [dialogOpen, setDialog] = useState(false);
  const [fileName, setFileName] = useState("GB-cards.zip");
  const [waiting, setWaiting] = useState(false);

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
        <Stack spacing={2}>
          <Typography variant="caption" >
            Card Options:
          </Typography>
          <Box sx={{ border: 1, borderRadius: 1, borderColor: 'action.disabled', p: 1 }}>
            <Stack direction="row" justifyContent={"space-evenly"}>
              <FormControlLabel
                label="Double Wide Cards"
                control={
                  <Checkbox
                    checked={doubleCard}
                    onChange={() => setDouble(!doubleCard)}
                  />
                }
              />
              <FormControlLabel
                label="With Print Bleed"
                control={
                  <Checkbox
                    checked={withBleed}
                    onChange={() => setBleed(!withBleed)}
                  />
                }
              />
            </Stack>
          </Box>
          <Typography variant="caption">
            Image Sizes:
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField label="width" size="small" value={width.toFixed(0)} onChange={widthChange} />
            <Link />
            <TextField label="height" size="small" value={height.toFixed(0)} onChange={heightChange} />
          </Stack>
          <Typography variant="caption">
            Download File:
          </Typography>
          <TextField label="file name" size="small" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          <Button
            variant="contained"
            disabled={waiting}
            onClick={() => {
              setWaiting(true);
              downloadCards(fileName, settings).finally(() => {
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

async function downloadCards(fileName: string, settings: PrintSettingsType) {
  if (!fileName || !settings) return;
  const { doubleCard, withBleed, width, height } = settings;

  const elements = document.querySelectorAll('.card:not(.hide)');
  if (elements.length === 0) return;

  const zip = new JSZip();

  const promises = Array.from(elements).map(async (el) => {
    const singleWidth = doubleCard
      ? withBleed
        ? (width + (height / 15)) / 2
        : width / 2
      : width;
    const blob = await htmlToImage.toBlob(el.firstElementChild as HTMLElement, {
      canvasWidth: el.classList.contains('double') ? width : singleWidth,
      canvasHeight: height,
    });
    if (blob) {
      zip.file(`${el.id}.png`, blob);
    }
  });

  await Promise.all(promises);

  await zip.generateAsync({ type: "blob" })
    .then((blob) => {
      FileSaver.saveAs(blob, fileName);
    });
}
