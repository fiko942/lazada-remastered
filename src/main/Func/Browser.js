import fs from 'fs';

import puppeteer from 'puppeteer-extra';
const ps = require('puppeteer-extra-plugin-stealth');
puppeteer.use(ps());

export default async function browser({
  global,
  headless,
  blockImage,
  userID,
  normal,
}) {
  if (typeof userID != 'number') userID = 1;
  if (typeof blockImage == 'undefined') blockImage = true;
  if (typeof normal == 'undefined') normal = false;
  const browser = await puppeteer.launch({
    // headless: typeof headless == 'boolean' ? headless : false,
    headless: false,
    args: normal ? [] : args,
    executablePath: CHROME_PATH(),
    defaultViewport: null,
    userDataDir: global.V8_USER_PREFERENCES + userID + '\\',
  });
  const [page] = await browser.pages();
  await page.setExtraHTTPHeaders({ referer: 'https://www.lazada.co.id' });
  return { browser, page };
}

function CHROME_PATH() {
  const windows_username = require('os').userInfo().username;
  if (
    fs.existsSync(
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    )
  ) {
    return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  } else if (
    fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ) {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (
    fs.existsSync(
      `C:/Users/${windows_username}/AppData/Local/Google/Chrome/Application/chrome.exe`
    )
  ) {
    return `C:/Users/${windows_username}/AppData/Local/Google/Chrome/Application/chrome.exe`;
  } else {
    msgbox({
      message: 'Failed for initialize v8 engine path',
      title: 'Application Error',
    });
    return false;
  }
}

const args = [
  '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  '--disable-setuid-sandbox',
  '--no-sandbox',
  '--enable-automation',
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  // '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
  '--disable-2d-canvas-clip-aa',
  '--disable-2d-canvas-image-chromium',
  '--disable-3d-apis',
  '--disable-accelerated-2d-canvas',
  '--disable-accelerated-mjpeg-decode',
  '--disable-accelerated-video-decode',
  '--disable-accelerated-video-encode',
  '--disable-and-delete-previous-log',
  '--disable-angle-features',
  '--disable-app-content-verification',
  '--disable-arc-cpu-restriction',
  '--disable-arc-opt-in-verification',
  '--disable-audio-output',
  '--disable-audio-input',
  '--disable-backing-store-limit',
  '--disable-best-effort-tasks',
  '--disable-canvas-aa',
  '--disable-checker-imaging',
  '--disable-chrome-tracing-computation',
  '--disable-component-extensions-with-background-pages',
  '--disable-composited-antialiasing',
  '--disable-cookie-encryption',
  '--disable-crash-reporter',
  '--disable-d3d11',
  '--disable-databases',
  '--disable-dev-shm-usage',
  '--disable-direct-composition-video-overlays',
  '--disable-domain-blocking-for-3d-apis',
  '--disable-es3-gl-context',
  '--disable-dwm-composition',
  '--disable-es3-gl-context-for-testing',
  '--disable-explicit-dma-fences',
  '--disable-extensions',
  '--disable-file-system',
  '--disable-fine-grained-time-zone-detection',
  '--disable-font-subpixel-positioning',
  '--disable-frame-rate-limit',
  '--disable-gaia-services',
  '--disable-gl-extensions',
  '--disable-glsl-translator',
  '--disable-gpu',
  '--disable-gpu-compositing',
  '--disable-gpu-driver-bug-workarounds',
  '--disable-gpu-early-init',
  '--disable-gpu-memory-buffer-compositor-resources',
  '--disable-gpu-memory-buffer-video-frames',
  '--disable-gpu-process-crash-limit',
  '--disable-gpu-process-for-dx12-info-collection',
  '--disable-gpu-program-cache',
  '--disable-gpu-rasterization',
  '--disable-gpu-sandbox',
  '--disable-gpu-shader-disk-cache',
  '--disable-gpu-vsync',
  '--disable-gpu-watchdog',
  '--disable-hang-monitor',
  '--disable-hid-detection-on-oobe',
  '--disable-image-animation-resync',
  '--disable-in-process-stack-traces',
  '--disable-layer-tree-host-memory-pressure',
  '--disable-lcd-text',
  '--disable-local-storage',
  '--disable-logging',
  '--disable-login-animations',
  '--disable-mipmap-generation',
  '--disable-media-session-api',
  '--disable-notifications',
  '--disable-nv12-dxgi-video',
  '--disable-pepper-3d',
  '--disable-print-preview',
  '--disable-presentation-api',
  '--disable-ppapi-shared-images-swapchain',
  '--disable-prefer-compositing-to-lcd-text',
  '--disable-reading-from-canvas',
  '--disable-remote-fonts',
  '--disable-remote-playback-api',
  '--disable-renderer-accessibility',
  '--disable-renderer-backgrounding',
  '--disable-rgba-4444-textures',
  '--disable-rollback-option',
  '--disable-rtc-smoothness-algorithm',
  '--disable-running-as-system-compositor',
  '--disable-scroll-to-text-fragment',
  '--disable-shared-workers',
  '--disable-speech-api',
  // ! Render the website
  // '--disable-threaded-animation',
  // '--disable-threaded-compositing',
  // // ! Render the website
  '--disable-threaded-scrolling',
  '--disable-throttle-non-visible-cross-origin-iframes',
  '--disable-usb-keyboard-detect',
  '--disable-touch-drag-drop',
  '--disable-use-mojo-video-decoder-for-pepper',
  '--disable-v8-idle-tasks',
  '--disable-variations-safe-mode',
  '--disable-video-capture-use-gpu-memory-buffer',
  '--disable-variations-seed-fetch-throttling',
  '--disable-virtual-keyboard',
  '--disable-webgl',
  '--disable-webgl-image-chromium',
  '--disable-webgl2',
  '--disable-webrtc-encryption',
  '--disable-webrtc-hw-decoding',
  '--disable-webrtc-hw-encoding',
  '--disable-windows10-custom-titlebar',
  '--disable-yuv-image-decoding',
  '--disable-checker-imaging',
  '--disable-image-animation-resync',
  '--disable-pepper-3d-image-chromium',
  '--disable-ppapi-shared-images-swapchain',
  '--disable-yuv-image-decoding',
];
