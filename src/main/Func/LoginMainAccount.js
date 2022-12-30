import fs from 'fs';
import Browser from './Browser';

export default async function LoginMainAccount({ global, success, error }) {
  try {
    var current_session = JSON.parse(
      fs.readFileSync(global.main_session, 'utf-8')
    );
    const { browser, page } = await Browser({
      headless: false,
      blockImage: false,
      normal: true,
      global,
    });
    browser.on('disconnected', () => {
      return error('Browser ditutup oleh pengguna!');
    });
    await page.setCookie(...current_session);
    await page.goto('https://aliexpress.com/account/index.html', {
      timeout: 0,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('.account-info-box', { timeout: 0 });
    current_session = await page.cookies();
    await fs.writeFileSync(
      global.main_session,
      JSON.stringify(current_session),
      'utf-8'
    );
    await browser.close();
    return success('Login berhasil!');
  } catch (err) {
    return error(err.message);
  }
}
