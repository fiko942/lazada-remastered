import axios from 'axios';
import { app } from 'electron';
import Downloader from 'nodejs-file-downloader';
import fs from 'fs';

export default async function updater({
  global,
  onAvailable,
  onNotAvailable,
  onDownloaded,
  onErr,
}) {
  var installed_version = parseInt(onlyNumber(app.getVersion()));
  log('INSTALLED_VERSION: ' + installed_version);

  // const filepath = global.dirs.tmp + '\\INSTALLER_0.0.9.exe';
  // return onDownloaded(filepath);

  // Get the latest version from api
  try {
    const response = (await axios.get(global.api.updates)).data;
    const latest_version = parseInt(onlyNumber(response.version));

    if (latest_version > installed_version) {
      onAvailable();
      const filepath =
        global.dirs.tmp + '\\INSTALLER_' + response.install.split('/').pop();
      if (isExist(filepath)) {
        return onDownloaded(filepath);
      }
      // Download the update
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return await downloadUpdate(response.install, global, (filepath) => {
        return onDownloaded(filepath);
      });
    }
    return onNotAvailable();
  } catch (err) {
    return onErr(err.message);
  }
}

function log(l) {
  return console.log(`Func::Updater: `, l);
}

function onlyNumber(str) {
  return str.replace(/[^0-9]/g, '');
}

const downloadUpdate = async (url, global, callback) => {
  const generatedfileName = 'INSTALLER_' + url.split('/').pop();
  const downloader = new Downloader({
    url,
    directory: global.dirs.tmp,
    fileName: generatedfileName,
  });
  await downloader.download();
  return callback(global.dirs.tmp + '\\' + generatedfileName);
};

function isExist(path) {
  if (fs.existsSync(path) && fs.statSync(path).size <= 0) {
    fs.unlinkSync(path);
  }
  return fs.existsSync(path) && fs.statSync(path).size > 0;
}
