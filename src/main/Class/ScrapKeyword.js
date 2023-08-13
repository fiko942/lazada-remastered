import fs from 'fs';
import cheerio from 'cheerio';
import axios from 'axios';
import Browser from '../Func/Browser';
import Func from '../Func';

console.log(process.argv)

export default class {
  constructor() {
    this.stopped = false;
    this.results = [];
    this.onComplete = () => {};
    this.browser;
  }

  async stop() {
    if (this.browser != undefined) {
      await this.browser.close();
    }
    return this.onComplete(this.results);
  }

  async handleCaptcha(page) {
    return new Promise(async (resolve) => {
      const element = await page.$x(
        '/html/body/div/div[2]/div/div[1]/div[2]/center/div[1]/div/div/div'
      );
      if (element.length < 1) {
        console.log('captcha tidak terdeteski');
        resolve();
      } else {
        let nav_loop = true;
        do {
          try {
            console.log('captcha terdeteksi');
            // ! Solve the captcha
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
            resolve();
            nav_loop = false;
          } catch (err) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await page.reload();
          }
        } while (nav_loop);
        // * End of solve the captcha
      }
    });
  }

  async start(args) {
    this.results = [];
    const {
      keywords,
      minPrice,
      maxPrice,
      maxPage,
      global,
      filterLocation,
      location,
      rating,
      onLog,
      onKeywordSuccess,
      onComplete,
      totalChange,
      sortBy,
      lazMall
    } = args;

    this.stopped = false;
    this.onComplete = onComplete;
    const { browser, page } = await Browser({
      secure: false,
      blockImage: true,
      normal: false,
      headless: false,
      userID: 1,
      global,
    });
    this.browser = browser;

    for (var keyword of keywords) {
      if (this.stopped) {
        return 1;
      }
      for (var i = 0; i < maxPage; i++) {
        if (this.stopped) {
          return 1;
        }
        onLog(keyword, 'Scan halaman ' + (i + 1));
        var navUrl = `https://www.lazada.co.id/catalog/?ajax=true&from=input${
          filterLocation ? `&location=${location}` : ''
        }${
          minPrice > 0 || maxPrice > 0 ? `&price=${minPrice}-${maxPrice}` : ''
        }&q=${keyword.replaceAll(' ', '%20')}&rating=${rating}&page=${i + 1}`;
        
        if(lazMall){
          navUrl+= '&service=official'
        }

        if(sortBy !== 'default') {
          navUrl+= '&sort='+sortBy
        }

        var loop_fetch = true;
        do {
          try {
            await page.goto(navUrl, {
              timeout: 10000,
              waitUntil: 'networkidle2',
            });
            loop_fetch = false;
          } catch (err) {
            if (this.stopped) {
              return 1;
            }
            console.log(`Fetch error: ${err.message}`);
            onLog(keyword, 'Err: ' + err.message);
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } while (loop_fetch);
        await this.handleCaptcha(page);
        const html = await page.content();
        const json = cheerio.load(html)('body').text();
        try {
          var res = [];
          const data = JSON.parse(json);
          const items = data.mods.listItems;
          for (var item of items) {
            res.push({
              title: item.name,
              description: item.description.join('\n').trim().length < 1 ? item.name : item.description.join('\n'),
              price: parseInt(item.price),
              stock: Func.RandomNumberofRange(10, 99),
              images: item.thumbs.map((x) => x.image + '._webp'),
              sku: item.sku,
            });
          }
          this.results.push(...res);
          totalChange(this.results.length);
        } catch (err) {
          if (this.stopped) {
            return 1;
          }
          onLog(keyword, 'Err: ' + err.message);
          console.log('Failed parse: ' + err.message);
        }

        // onLog(keyword, 'Berhenti 0.1 detik untukmenghindari captcha');
        // await new Promise((resolve) => setTimeout(resolve, getRandomNumber(4, 6) * 1000));
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      onKeywordSuccess(keyword);
    }
    if (!this.stopped) {
      await browser.close();
      return onComplete(this.results);
    }
    return 0;
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}