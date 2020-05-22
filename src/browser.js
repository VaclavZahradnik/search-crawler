import puppeteer from 'puppeteer';

export class Browser {
  async init() {
    await this.close();
    this._browser = await puppeteer.launch();
  }

  async visit(url) {
    const page = await this.newPage();
    try {
      await page.goto(url);
      console.log(`opened the page: ${url}`);
    } catch (err) {
      console.log(`failed to open the page: ${url} with the error: ${err}`);
      throw err;
    }

    const title = await page.title();
    const text = await page.$eval('body', node => node.innerText);
    let urls = await page.$$eval('a:not([rel="nofollow"])', nodes => nodes.map(a => a.href));
    urls = urls.filter(x => x).map(x => new URL(x, url).href);

    await page.close();

    return { title, text, urls };
  }

  async newPage() {
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
