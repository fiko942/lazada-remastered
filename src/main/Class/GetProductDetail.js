import Func from '../Func';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

export default class GetProductDetail {
  constructor() {
    this.stopped = false;
    this.results = [];
    this.browser = undefined;
    this.onComplete = () => {};
    this.onCaptcha = () => {};
  }

  async stop() {
    if (typeof this.browser != 'undefined') {
      try {
        await this.browser.close();
      } catch (err) {}
    }
    this.stopped = true;
    return this.onComplete(this.results);
  }

  async get({ onSuccess, onLog, global, urls, core, onComplete, onCaptcha }) {
    this.results = [];
    this.stopped = false;
    this.onComplete = onComplete;
    const cookies = JSON.parse(fs.readFileSync(global.main_session, 'utf-8'));

    const { browser } = await Func.Browser({
      headless: true,
      global,
      userID: 3,
    });
    this.browser = browser;

    const DISTRIBUTED_ARRAY = Func.Distribute(urls, core);
    var tasks = [];

    for (var _URLS of DISTRIBUTED_ARRAY) {
      const id = DISTRIBUTED_ARRAY.indexOf(_URLS);
      const page = await browser.newPage();
      tasks.push(
        this.single(
          _URLS,
          page,
          (log) => onLog(id, log),
          id,
          onSuccess,
          cookies,
          onCaptcha
        )
      );
    }
    await Promise.all(tasks);
    try {
      await browser.close();
    } catch (err) {}
    if (!this.stopped) {
      onComplete(this.results);
    }
    this.results = [];
    return (this.onComplete = () => {});
  }

  async solveCaptcha(page) {
    try {
      let loop = true;
      do {
        try {
          await page.goto(
            'https://id.aliexpress.com/item/1005004460605620.html',
            {
              waitUntil: 'load',
            }
          );
          //   Solve
          const sliderElement = await page.waitForXPath(
            '/html/body/div/div[2]/div/div[1]/div[2]/center/div[1]/div/div/div/div[2]/span',
            { timeout: 0 }
          );
          const slider = await sliderElement.boundingBox();

          const sliderHandleElement = await page.waitForXPath(
            '/html/body/div/div[2]/div/div[1]/div[2]/center/div[1]/div/div/div/span',
            { timeout: 0 }
          );
          const handle = await sliderHandleElement.boundingBox();

          //   Handling mouse event
          await page.mouse.move(
            handle.x + handle.width / 2,
            handle.y + handle.height / 2
          );
          await page.mouse.down();
          await page.mouse.move(
            handle.x + slider.width,
            handle.y + handle.height / 2,
            {
              steps: 10,
            }
          );
          await page.mouse.up();
          await page.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
          loop = false;
        } catch (err) {
          await new Promise(resolve, setTimeout(resolve, 1000));
        }
      } while (loop);
      // End of solve
    } catch (err) {
      return 0;
    }
    return 1;
  }

  async single(urls, page, onLog, id, onSuccess, cookies, onCaptcha) {
    await page.goto('chrome://settings/clearBrowserData');
    await page.keyboard.down('Enter');
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    );
    for (var url of urls) {
      const state = `[${urls.indexOf(url) + 1}/${urls.length}] `;
      onLog(state + 'processing ...');
      if (this.stopped) return 0;
      var MAIN_LOOP = true;
      do {
        try {
          var captcha_show = true;
          do {
            await page.goto(url, {
              timeout: 30000,
              waitUntil: 'domcontentloaded',
            });
            try {
              await page.evaluate(() => window.runParams.data);
              captcha_show = false;
            } catch (err) {
              onCaptcha();
              if (id === 0) {
                this.solveCaptcha(page);
              }
              await new Promise((resolve) => setTimeout(resolve, 40000));
            }
          } while (captcha_show);
          const module = await page.evaluate(() => window.runParams.data);
          var data = {
            title: '',
            price: 0,
            description: '',
            stock: 0,
            id: url.split('/').pop().split('.')[0],
            images: [],
          };
          // get the detail of page
          data.title = module.titleModule.subject;
          data.price = parseInt(module.priceModule.maxAmount.value);
          // Get the description data
          try {
            const html = (
              await axios.get(module.descriptionModule.descriptionUrl, {
                headers: {
                  'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                  'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                  useragent:
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                },
              })
            ).data;
            const $ = cheerio.load(html);
            data.description = $('body')
              .text()
              .split('window.adminAccountId')[0]
              .trim()
              .replaceAll('\n\n', '\n');
          } catch (err) {
            onLog(state + 'Err: ' + err.message);
          }
          data.stock = module.quantityModule.totalAvailQuantity;
          data.images = module.imageModule.imagePathList;
          // Append result to data
          this.results.push(data);
          MAIN_LOOP = false;
        } catch (err) {
          onLog(state + `Err: ${err.message}`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (this.stopped) return 0;
        }
      } while (MAIN_LOOP);
    }
    try {
      await page.close();
    } catch (err) {}
    onLog('success');
    return onSuccess(id);
  }
}
