import Func from '../Func';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

export default class GetItemListByKeyword {
  constructor() {
    this.urls = [];
    this.stopped = false;
    this.browser = undefined;
  }
  async stop() {
    if (typeof this.browser != 'undefined') await this.browser.close();
    this.stopped = true;
    return 1;
  }

  async get(args, callback) {
    this.stopped = false;
    var urls = [];
    const { browser, page } = await Func.Browser({
      headless: true,
      secure: false,
      blockImage: true,
      global: args.global,
    });
    const current_main_cookie = JSON.parse(
      fs.readFileSync(args.global.main_session, 'utf-8')
    );
    await page.setCookie(...current_main_cookie);
    for (var username of args.usernames) {
      args.onLog(username, 'Starting...');
      for (var i = 1; i <= args.max_page; i += 1) {
        args.onLog(username, `Scanning page ${i}...`);
        const navUrl = `https://hi5group.aliexpress.com/store/${username}/search/${i}.html?origin=n&isFreeShip=${
          args.free_shipping ? 'y' : 'n'
        }&SortType=bestmatch_sort`;
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
            args.onLog(username, 'Err: ' + err.message);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } while (navLoop);
        // Get the urls
        try {
          const _URL_ELEMENTS = await page.$$('.pic .pic-rind');
          for (var _URL_ELEMENT of _URL_ELEMENTS) {
            urls.push(
              await _URL_ELEMENT.evaluate(
                (x) => 'https:' + x.getAttribute('href')
              )
            );
          }
          if (_URL_ELEMENTS.length <= 0) break;
        } catch (err) {
          args.onLog('Err: ' + err.message);
        }
      }
      args.onLog(username, 'success');
      args.onKeywordSuccess(username);
    }
    // Close browser and returned the result after process complete
    await page.close();
    await browser.close();
    return this.stopped ? [] : callback(Func.UniqueArray(urls));
  }
}
