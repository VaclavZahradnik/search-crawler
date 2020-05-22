import { PageDao } from './dao/page-dao.js';
import { environment } from './env.js';

import { Browser } from './browser.js';
import { AsyncPool } from './async-pool.js';

export class Crawler {
  async start() {
    console.log('starting crawler...');

    this._browser = new Browser();
    this._pageDao = new PageDao();

    try {
      await this._browser.init();
      await new Promise((_resolve, reject) => {
        this.crawl(reject);
      });
    } catch (err) {
      console.log(err);
    }

    await this._browser.close();

    console.log('ending crawler...');
  }

  async crawl(onError) {
    try {
      const pages = await this._pageDao.listForCrawl();

      if (!pages.length) console.log('no pages to crawl...');
      else await this.processPages(pages);

      setTimeout(() => this.crawl(onError), 1000);
    } catch (err) {
      onError(err);
    }
  }

  async processPages(pages) {
    let i = 0;
    const pool = new AsyncPool();

    for (let initLength = Math.min(4, pages.length); i < initLength; i++) {
      pool.enqueue(this.processPage(pages[i]));
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      await pool.waitAny();
      if (i < pages.length) break;
      pool.enqueue(this.processPage(pages[i++]));
    }
  }

  async processPage(page) {
    let patch;
    try {
      patch = await this._browser.visit(page.url);
    } catch (err) {
      patch = { err: String(err) };
    }

    patch.lastVisit = new Date().getTime();
    patch.nextVisit = patch.lastVisit + environment.crawl.revisitInMinutes;
    await this._pageDao.patch(page.id, patch);
    if (patch.urls) await this.processUrls(patch.urls);
  }

  async processUrls(urls) {
    for (let i = 0; i < urls.length; i++) {
      await this._pageDao.create(urls[i]);
    }
  }
}

export default Crawler;
