import fs from 'fs';
import https from 'https';
import extract from 'extract-zip';
import Downloader from 'nodejs-file-downloader';

export default async function InitChromeExtensions({ global, onLog }) {
  onLog(global.WEBKIT_EXTENSIONS);
  for (var extension of global.WEBKIT_EXTENSIONS) {
    onLog(`Checking exist extension ${extension.name} on [${extension.path}]`);
    if (!fs.existsSync(extension.path + '\\manifest.json')) {
      onLog(
        `Downloading extension ${extension.name} on ${extension.download_url}`
      );
      const downloadTarget = extension.path + '.zip';
      await DownloadFile(extension.download_url, downloadTarget, () =>
        ExtractFile(downloadTarget, extension.path, onLog)
      );
    } else {
      onLog(`Extension ${extension.name} is already installed`);
    }
  }
  return 1;
}

async function ExtractFile(file, target, onlog) {
  return extract(file, { dir: target }, (err) => {
    if (err) {
      return onlog(err);
    } else {
      onlog('File has been extracted successfully');
    }
  });
}

async function DownloadFile(url, targetpath, callback) {
  const filename = targetpath.split('\\').pop();
  const downloader = new Downloader({
    url,
    directory: targetpath.replace(filename, ''),
    fileName: filename,
  });
  await downloader.download();
  return callback();
}
