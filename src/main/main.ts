import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import global from '../global.json';
import Func from './Func';
import fs from 'fs';
import open from 'open';
import { exec, execFile } from 'child_process';
import ScrapKeyword from './Class/ScrapKeyword';

// Classes
const scrapKeyword = new ScrapKeyword();
// * Minimize memory usage in electron
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('kiosk');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('in-process-gpu');
app.disableHardwareAcceleration();

if (
  !fs.existsSync(
    'C:\\com.ziqvakampungsongo\\ziqva-lazada-scrapper-remastered\\'
  )
) {
  fs.mkdirSync('C:\\com.ziqvakampungsongo\\ziqva-lazada-scrapper-remastered\\');
}
Func.InitFiles(global);

Func.InitChromeExtensions({
  global,
  onLog: (log) => console.log(`InitChromeExtensions --> `, log),
});
let mainWindow: BrowserWindow | null = null;
var STATE = {
  task: {
    loading: false,
    tasks: [],
    current_type: '',
  },
  collection: {
    cdn_processing: false,
    cdn_progress: {
      processed: 0,
      total: 0,
    },
  },
};

function SEND_COLLECTION_STATE() {
  return mainWindow?.webContents.send('collection state', STATE.collection);
}

ipcMain.on('get collection state', () => SEND_COLLECTION_STATE());

ipcMain.on('get task state', () => {
  return mainWindow?.webContents.send('task state', STATE.task);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame: false,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    roundedCorners: false,
    webPreferences: {
      devTools: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  return mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// IPC's event

ipcMain.on('login device', async (sender) => {
  // if (process.env.NODE_ENV.trim() == 'development') {
  //   // Pastikan sebelumnya sudah ada session dummy agar bisa terbaca untuk front end
  //   return mainWindow?.webContents.send('login device registered');
  // }
  return Func.Registered({
    global,
    onSuccess: (data) => {
      console.log(data);
      if (data.tobelsoft.data.registered) {
        fs.writeFileSync(global.files.session, JSON.stringify(data), 'utf-8');
        return mainWindow?.webContents.send('login device registered');
      } else {
        return mainWindow?.webContents.send(
          'login device unregistered',
          data.MACHINE_ID
        );
      }
    },
    onError: (msg) => {
      console.log('Error: ' + msg);
      return mainWindow?.webContents.send('login device error', {
        message: msg,
      });
    },
  });
});

ipcMain.on('activate token', async (sender, token) => {
  return Func.ActivateToken({
    global,
    token,
    error: (error) =>
      mainWindow?.webContents.send('activate token result', {
        error: true,
        message: error,
      }),
    success: (msg) =>
      mainWindow?.webContents.send('activate token result', {
        error: false,
        message: msg,
      }),
  });
});

ipcMain.on('get contact', (sender, TYPE) => {
  return Func.Contact({ global, TYPE });
});

ipcMain.on('get current session', () =>
  Func.CurrentSession({
    global,
    callback: (session) =>
      mainWindow?.webContents.send('current session', session),
  })
);

const sendTaskState = () => {
  let s = STATE.task;
  delete s.stop;
  return mainWindow?.webContents.send('task state', s);
};

ipcMain.on('task stop', () => {
  if (STATE.task.current_type == 'KEYWORD') {
    try {
      scrapKeyword.stop();
    } catch (er) {}
  } else {
    // Nothing
  }
  STATE.task.loading = false;
  STATE.task.tasks = [];
  return sendTaskState();
});

ipcMain.on('task start', async (sender, args) => {
  STATE.task.tasks = [];
  STATE.task.loading = true;
  args.global = global;
  STATE.task.current_type = args.type;
  console.log('task start ARGUMENTS: ', args);

  var opts = {};

  var minPrice = 0;
  var maxPrice = 0;
  if (args.minPrice.length >= 1) {
    if (isNaN(args.minPrice) && !parseInt(args.minPrice)) {
      return mainWindow?.webContents.send('message', {
        title: 'Validasi error',
        message: 'Min price yang anda masukkan tidak valid',
      });
    } else {
      minPrice = parseInt(args.minPrice);
    }
  }
  if (args.maxPrice.length >= 1) {
    if (isNaN(args.maxPrice) && !parseInt(args.maxPrice)) {
      return mainWindow?.webContents.send('message', {
        title: 'Validasi error',
        message: 'Min price yang anda masukkan tidak valid',
      });
    } else {
      maxPrice = parseInt(args.maxPrice);
    }
  }
  opts.minPrice = minPrice;
  opts.maxPrice = maxPrice;
  opts.keywords = args.keywords;
  opts.maxPage = args.maxPage;
  opts.global = args.global;
  opts.filterLocation = args.filter_location_state;
  opts.location = args.location;
  opts.rating = args.rating;

  // // Data yang akan berubah terhadap sisi front end
  for (var keywords of opts.keywords) {
    STATE.task.tasks.push({
      name: keywords,
      message: 'waiting...',
      success: false,
    });
    sendTaskState();
  }
  STATE.task.tasks.push({
    name: 'Total',
    message: '0',
    success: false,
  });
  sendTaskState();
  opts.totalChange = (t) => {
    const i = STATE.task.tasks.findIndex((x) => x.name == 'Total');
    if (i >= 0) {
      STATE.task.tasks[i].message = t;
    }
    return sendTaskState();
  };
  opts.onLog = (keyword, log) => {
    const i = STATE.task.tasks.findIndex((x) => x.name == keyword);
    if (i >= 0) {
      STATE.task.tasks[i].message = log;
    }
    return sendTaskState();
  };
  opts.onKeywordSuccess = (keyword) => {
    const i = STATE.task.tasks.findIndex((x) => x.name == keyword);
    if (i >= 0) {
      STATE.task.tasks[i].success = true;
    }
    return sendTaskState();
  };

  opts.onComplete = async (results) => {
    await Func.SaveToCollection({
      results,
      keywords: opts.keywords,
      global,
    });
    STATE.task.tasks = [];
    STATE.task.loading = false;
    sendTaskState();
    SEND_COLLECTION_LIST();
    return mainWindow?.webContents.send('task scrap complete');
  };

  console.log('OPTS: ', opts);
  scrapKeyword.start(opts);

  // var _URLS = [];

  // if (args.type == 'KEYWORD') {
  //   for (var keyword of args.keywords) {
  //     STATE.task.tasks.push({
  //       name: keyword,
  //       message: 'waiting...',
  //       success: false,
  //     });
  //     sendTaskState();
  //   }

  //   await getItemListBykeyword.get(args, (urls) => {
  //     STATE.task.tasks = [];
  //     sendTaskState();
  //     return (_URLS = urls);
  //   });
  // } else {
  //   // Tambahkan semua username toko kedalam task dalam status waiting
  //   for (var username of args.usernames) {
  //     STATE.task.tasks.push({
  //       name: username,
  //       message: 'waiting...',
  //       success: false,
  //     });
  //     sendTaskState();
  //   }

  //   await getItemListByShop.get(args, (urls) => {
  //     STATE.task.tasks = [];
  //     sendTaskState();
  //     return (_URLS = urls);
  //   });
  // }

  // for (var i = 1; i <= args.core; i++) {
  //   STATE.task.tasks.push({
  //     name: 'Tab ' + i,
  //     message: 'waiting',
  //     success: false,
  //   });
  //   sendTaskState();
  // }

  // return getProductDetail.get({
  //   global,
  //   urls: _URLS,
  //   core: args.core,
  //   onSuccess: (id) => {
  //     const tabName = `Tab ${id + 1}`;
  //     const index = STATE.task.tasks.findIndex((x) => x.name == tabName);
  //     if (index >= 0) STATE.task.tasks[index].success = true;
  //     return sendTaskState();
  //   },
  //   onLog: (id, log) => {
  //     const tabName = `Tab ${id + 1}`;
  //     const index = STATE.task.tasks.findIndex((x) => x.name == tabName);
  //     if (index >= 0) STATE.task.tasks[index].message = log;
  //     return sendTaskState();
  //   },
  //   onComplete: async (results) => {
  //     // Save data to collection
  //     await Func.SaveToCollection({
  //       results,
  //       keywords:
  //         typeof args.usernames != 'undefined' ? args.usernames : args.keywords,
  //       global,
  //     });
  //     STATE.task.tasks = [];
  //     STATE.task.loading = false;
  //     sendTaskState();
  //     SEND_COLLECTION_LIST();
  //     return mainWindow?.webContents.send('task scrap complete');
  //   },
  //   onCaptcha: () => {
  //     mainWindow?.webContents.send('message', {
  //       title: 'Terdeteksi captcha',
  //       message:
  //         'Sistem kami sedang melakukan solving captcha secara otomatis, setelah captcha solved, proses akan berjalan lagi 40 detik setelahnya',
  //     });
  //   },
  // });
});

const SEND_COLLECTION_LIST = async () => {
  const data = JSON.parse(
    fs.readFileSync(global.files.collection_list, 'utf-8')
  );
  return mainWindow?.webContents.send('collection list', data);
};

ipcMain.on('get collection list', SEND_COLLECTION_LIST);

ipcMain.on('get collection data', async (sender, path) =>
  Func.GetCollectionData(path, global, (data) => {
    mainWindow?.webContents.send('collection data', data);
  })
);

ipcMain.on('delete collections', (event, collections) => {
  return Func.DeleteCollections({
    global,
    collections,
    onSuccess: (msg) => {
      const title = 'Success';
      mainWindow?.webContents.send('message', { title, message: msg });
      return SEND_COLLECTION_LIST();
    },
    onError: (msg) => {
      const title = 'DeleteCollection_ERROR';
      return mainWindow?.webContents.send('message', { title, message: msg });
    },
  });
});

const SEND_SETTINGS_RUMUS_PROFILE_LIST = () => {
  return mainWindow?.webContents.send(
    'rumus profile list',
    Func.ListRumusProfile(global)
  );
};
ipcMain.on('get rumus profile list', SEND_SETTINGS_RUMUS_PROFILE_LIST);

ipcMain.on('setting rumus add profile', (sender, data) =>
  Func.AddRumusProfile({
    data: data,
    onMessage: (msg) =>
      mainWindow?.webContents.send('message', { title: '', message: msg }),
    onSuccess: () => SEND_SETTINGS_RUMUS_PROFILE_LIST(),
    global,
  })
);

ipcMain.on('delete profile rumus', (sender, profile) =>
  Func.DeleteRumusProfile(global, profile, (msg) => {
    SEND_SETTINGS_RUMUS_PROFILE_LIST();
    mainWindow?.webContents.send('message', { message: msg, title: '' });
  })
);

ipcMain.on('get profile data', (sender, profileName) =>
  Func.ProfileData(global, profileName, (data) => {
    mainWindow?.webContents.send('profile data', data);
  })
);

ipcMain.on('save settings suffle data', (sender, data) =>
  Func.SaveShuffle(global, data, (response) => {
    mainWindow?.webContents.send('message', { title: '', message: response });
  })
);

ipcMain.on('get shuffle data', () =>
  mainWindow?.webContents.send(
    'shuffle data',
    Func.GetShuffleData(global, (err) => {
      return mainWindow?.webContents.send('message', {
        title: 'Error',
        message: err,
      });
    })
  )
);

ipcMain.on('simpan kata melanggar', (sender, kataMelangar) => {
  return Func.SimpanKataMelanggar(global, kataMelangar, (msg) =>
    mainWindow?.webContents.send('message', { title: '', message: msg })
  );
});

ipcMain.on('get kata melanggar', () =>
  mainWindow?.webContents.send('kata melanggar', Func.GetKataMelanggar(global))
);

ipcMain.on('filter kata melanggar', (sender, collections) =>
  Func.FilterKataMelanggar(global, collections, (msg) => {
    mainWindow?.webContents.send('message', { title: '', message: msg });
  })
);

ipcMain.on('update general settings', (sender, data) => {
  Func.UpdateGeneralSettings(global, data);
  console.log(data);
});

ipcMain.on('get general settings', () =>
  mainWindow?.webContents.send(
    'general settings',
    Func.GetGeneralSettings(global)
  )
);

ipcMain.on('toggle random image', () => {
  const state = Func.GetGeneralSettings(global);
  const newState = { random_image: !state.random_image };
  return Func.UpdateGeneralSettings(global, newState);
});

ipcMain.on('toggle split file', () => {
  const state = Func.GetGeneralSettings(global);
  const newState = { split_file: !state.split_file };
  return Func.UpdateGeneralSettings(global, newState);
});

ipcMain.on('export collection', (sender, data) => {
  Func.ExportCollection({
    custom_template: data.custom_template,
    global,
    collections: data.collections,
    onLog: (log) => console.log(log),
    onError: (err) =>
      mainWindow?.webContents.send('message', {
        title: 'Export Error',
        message: err,
      }),
    onSuccess: () => {
      mainWindow?.webContents.send('message', {
        title: 'Export success',
        message: 'Success',
      });
    },
  });
});

ipcMain.on('move collections to cdn', (sender, collections) => {
  STATE.collection.cdn_processing = true;
  STATE.collection.cdn_progress.processed = 0;
  STATE.collection.cdn_progress.total = 0;
  SEND_COLLECTION_STATE();
  return Func.Move2CDN({
    global,
    onProgress: (processed, total) => {
      STATE.collection.cdn_progress = {
        total,
        processed,
      };
      return SEND_COLLECTION_STATE();
    },
    onComplete: () => {
      STATE.collection.cdn_processing = false;
      SEND_COLLECTION_LIST();
      mainWindow?.webContents.send('message', {
        title: 'Berhasil',
        message:
          'Proses memindahkan collection ke cdn berhasil, silahkan refresh halaman ini dengan membuka tab baru lalu kembali ke halaman ini untuk mendapatkan list collection terbaru',
      });
      return SEND_COLLECTION_STATE();
    },
    collections,
  });
});

ipcMain.on('minimize app', () => {
  return mainWindow.minimize();
});

ipcMain.on('maximize app', () => {
  return mainWindow?.isMaximized()
    ? mainWindow?.unmaximize()
    : mainWindow?.maximize();
});

ipcMain.on('close app', () => {
  return mainWindow?.close();
});

ipcMain.on('get current color', () => {
  return mainWindow?.webContents.send(
    'current color',
    fs.readFileSync(global.current_color, 'utf-8') || '#000'
  );
});

ipcMain.on('update current color', (sender, currentColor) =>
  Func.updateCurrentColor(global, currentColor)
);

ipcMain.on('export profile', () =>
  Func.ExportProfile(
    global,
    (msg) =>
      mainWindow?.webContents.send('message', {
        title: 'Success',
        message: msg,
      }),
    (err) =>
      mainWindow?.webContents.send('message', { title: 'Error', message: err })
  )
);

ipcMain.on('import profile', () =>
  Func.ImportProfile(
    global,
    (msg) => {
      mainWindow?.webContents.send('message', {
        title: 'Success',
        message: msg,
      });
      SEND_SETTINGS_RUMUS_PROFILE_LIST();
    },
    (err) =>
      mainWindow?.webContents.send('message', { title: 'Error', message: err })
  )
);

ipcMain.on('login main account', () => {
  return Func.LoginMainAccount({
    global,
    success: () =>
      mainWindow?.webContents.send('message', {
        title: '',
        message: 'Login berhasil!',
      }),
    error: (msg) =>
      mainWindow?.webContents.send('message', {
        title: 'Error',
        message: 'Terjadi kesalahan saat melakukan login: ' + msg,
      }),
  });
});

ipcMain.on('get version', () => {
  return mainWindow?.webContents.send('version', app.getVersion());
});

// * Check for update

ipcMain.on('check for update', () => {
  return Func.Updater({
    global,
    onAvailable: () => mainWindow?.webContents.send('update state', 1),
    onNotAvailable: () => mainWindow?.webContents.send('update state', 3),
    onDownloaded: (filepath: string) => {
      mainWindow?.webContents.send('update state', 2);
      ipcMain.on('install update', async () => {
        // exec('start ' + filepath);
        exec(filepath);
        app.quit();
      });
    },
    onErr: (msg: any) => {
      mainWindow?.webContents.send('message', {
        title: 'CH4UPDT_ERR',
        message: msg,
      });
      mainWindow?.webContents.send('update state', 3);
    },
  });
});

// ! Check for update
