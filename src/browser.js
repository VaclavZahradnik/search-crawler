import path from 'path';
import puppeteer from 'puppeteer';

import { baseDirName } from './env.js';

export class Browser {
  async init() {
    await this.close();
    this._browser = await puppeteer.launch({
      userDataDir: path.join(baseDirName, '.userProfile')
    });
  }

  async visit(url) {
    console.log(`opening page: ${url}`);

    let page = await this._newPage();

    try {
      await page.goto(url);

      console.log(`opened page: ${url}`);

      const title = await page.title();
      const text = await page.$eval('body', el => el.innerText);
      const lang = await page.$eval('html', el => el.lang);
      let urls = await page.$$eval('a:not([rel="nofollow"])', elements => elements.map(a => a.href));
      urls = urls.filter(x => x).map(x => new URL(x, url).href);

      const faviconUrl = await this._findBestFaviconURL(page, url);

      await page.close();
      page = null;

      const favicon = await this.loadFavicon(faviconUrl);

      return { title, text, lang, favicon, urls };
    } catch (err) {
      console.log(`failed to open page: ${url} with the error: ${err}`);
      throw err;
    } finally {
      if (page) await page.close();
    }
  }

  async _findBestFaviconURL(page, url) {
    let faviconUrl;
    try {
      faviconUrl = await page.$eval('link[rel="icon"], link[rel="shortcut icon"]', el => el.href);
    } catch (err) {
      faviconUrl = '/favicon.ico';
    }

    return new URL(faviconUrl, url).href;
  }

  async loadFavicon(faviconUrl) {
    console.info(`loading favicon from ${faviconUrl}`);

    const page = await this._browser.newPage();

    try {
      await page.goto(faviconUrl, { waitUntil: 'networkidle0' });

      const el = await page.$('img, svg');
      if (!el) return;

      const favicon = await el.screenshot({
        type: 'png',
        encoding: 'base64',
        omitBackground: true
      });

      return favicon;
    } catch (err) {
      console.log(`failed to load favicon: ${faviconUrl} with the error: ${err}`);
    } finally {
      await page.close();
    }
  }

  async _newPage() {
    const page = await this._browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      switch (request.resourceType()) {
        //case 'stylesheet':
        case 'image':
        case 'media':
        case 'font':
          request.abort();
          break;
        default:
          request.continue();
          break;
      }
    });
    return page;
  }

  async close() {
    if (!this._browser) return;
    await this._browser.close();
  }
}

export default Browser;
