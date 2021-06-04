// import * as Stuff from '../data/GBData43.json';

// const Guilds = Stuff.Guilds;
// const Models = Stuff.Models;
// const CPlays = Stuff['Character Plays'];
// const CTraits = Stuff['Character Traits'];

function displayName(model) {
  return (
    model.name + (model.veteran ? ' (v)' : '') + (model.seasoned ? ' (s)' : '')
  );
}

function keyName(model) {
  return model.id;
}

// export default Guilds;
// export {Guilds, Models, CPlays, CTraits, displayName, keyName};
export {displayName, keyName};

// import {
//   CachesDirectoryPath,
//   copyFile,
//   copyFileAssets,
//   DocumentDirectoryPath,
//   downloadFile,
//   exists,
//   readFile,
// } from 'react-native-fs';

import FS from 'react-native-fs';

// async function initDataFile() {
//   const manifestPath = `${FS.DocumentDirectoryPath}/manifest.json`;

//   return FS.exists(manifestPath).then((exists) => {
//     if (!exists) {
//       return FS.copyFileAssets('custom/manifest.json', manifestPath);
//     }
//   });
// }

async function initDataFile() {
  const manifestPath = `${FS.DocumentDirectoryPath}/manifest.json`;
  let exists = await FS.exists(manifestPath);
  if (exists) {
    console.log(manifestPath + ' exists');
  } else {
    await FS.copyFileAssets('custom/manifest.json', manifestPath);
    console.log(manifestPath + ' copied');
  }

  let manifestJSON = await FS.readFile(manifestPath);
  let manifest = JSON.parse(manifestJSON);
  manifest.datafiles.forEach(async (entry) => {
    let datafilePath = `${FS.DocumentDirectoryPath}/${entry.filename}`;
    let exists = await FS.exists(datafilePath);
    if (exists) {
      await FS.copyFileAssets(`custom/${entry.filename}`, datafilePath);
      console.log(datafilePath + ' exists');
    } else {
      await FS.copyFileAssets(`custom/${entry.filename}`, datafilePath);
      console.log(datafilePath + ' copied');
    }
  });
}

const MANIFEST_URL =
  'https://drive.google.com/uc?id=1FioqnU5Kz_skv3raLELH7iA15susU1xc';
// 'https://drive.google.com/file/d/1FioqnU5Kz_skv3raLELH7iA15susU1xc/view?usp=sharing';

// async function downloadManifest() {
//   const manifestPath = `${FS.CachesDirectoryPath}/manifest.json`;
//   return FS.downloadFile({
//     fromUrl: MANIFEST_URL,
//     toFile: manifestPath,
//   }).promise.then((res) => {
//     if (res.statusCode === 200 && res.bytesWritten > 0) {
//       console.log('manifest downloaded');
//     } else {
//       console.log('manifest download failed');
//     }
//   });
// }

async function downloadManifest() {
  const manifestPath = `${FS.CachesDirectoryPath}/manifest.json`;
  let res = await FS.downloadFile({fromUrl: MANIFEST_URL, toFile: manifestPath})
    .promise;
  if (res.statusCode !== 200 || res.bytesWritten === 0) {
    throw Error('manifest download failed');
  }
  console.log('manifest file downloaded: ' + manifestPath);
}

export {initDataFile, downloadManifest};
