import Func from '../Func';
import fs from 'fs';

export default class GetItemListByKeyword {
  constructor() {
    this.browser = undefined;
    this.urls = [];
    this.stopped = false;
  }
  async stop() {
    this.stopped = true;
    if (typeof this.browser != 'undefined') await this.browser.close();
    return 1;
  }
  async get(args, callback) {
    this.stopped = false;
    var urls = [];
    const { browser, page } = await Func.Browser({
      secure: false,
      global: args.global,
      args: [],
      blockImage: true,
      headless: true,
    });
    this.browser = browser;
    const current_main_cookie = JSON.parse(
      fs.readFileSync(args.global.main_session, 'utf-8')
    );
    await page.setCookie(...current_main_cookie);
    console.log(current_main_cookie);
    for (var keyword of args.keywords) {
      args.onLog(keyword, 'Starting...');
      for (var i = 1; i <= args.maxPage; i += 1) {
        args.onLog(keyword, `Scanning page ${i}...`);
        const navUrl = `https://id.aliexpress.com/premium/${keyword
          .toLowerCase()
          .replaceAll(
            ' ',
            '-'
          )}.html?trafficChannel=ppc&d=y&CatId=0&SearchText=${keyword}&ltype=premium&isFreeShip=${
          args.freeOngkir ? 'y' : 'n'
        }&isFavorite=${
          args.fourStar ? 'y' : 'n'
        }&SortType=default&shipFromCountry=CN&page=${i}${
          args.maxPrice.trim().length > 0 ? `&maxPrice=${args.maxPrice}` : ''
        }${
          args.minPrice.trim().length > 0 ? `&minPrice=${args.minPrice}` : ''
        }`;
        // Navigating to the url
        let navLoop = true;
        do {
          try {
            await page.goto(navUrl, {
              timeout: 20000,
              waitUntil: 'domcontentloaded',
            });
            navLoop = false;
          } catch (err) {
            if (this.stopped) return 0;
            args.onLog(keyword, 'Err: ' + err.message);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } while (navLoop);
        // Get the urls
        var multiUrl = [];
        try {
          multiUrl = await page.evaluate(() =>
            window._dida_config_._init_data_.data.data.root.fields.mods.itemList.content.map(
              (x) =>
                'https://id.aliexpress.com/item/' +
                x.productId +
                '.html'.split('?')[0].split('#')[0]
            )
          );
        } catch (err) {
          var errs = [err.message];
          try {
            multiUrl = await page.evaluate(() => {
              var x = [];
              for (var y of window.runParams.mods.itemList.content) {
                x.push(
                  'https://id.aliexpress.com/item/' + y.productId + '.html'
                );
              }
              return x;
            });
          } catch (err) {
            errs.push(err.message);
            console.log(errs);
            args.onLog(keyword, JSON.stringify(errs));
          }
        }
        urls.push(...multiUrl);
      }
      args.onKeywordSuccess(keyword);
    }

    // Close browser and returned the result after process complete
    await page.close();
    await browser.close();
    console.log(urls);
    return this.stopped ? [] : callback(Func.UniqueArray(urls));
  }
}
