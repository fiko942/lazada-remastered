import Browser from './Browser';

export default async function SolveCaptcha(global, callback) {
  const { browser, page } = await Browser({
    headless: false,
    blockImage: false,
    normal: true,
    global,
    userID: 'CAPTCHA_SOLVER',
  });
  browser.on('disconnected', () => {
    callback();
  });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  );
  await page.goto('https://id.aliexpress.com/item/1005005090100544.html', {
    timeout: 0,
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('.product-info', { timeout: 0 });
  await browser.close();
  return 1;
}
