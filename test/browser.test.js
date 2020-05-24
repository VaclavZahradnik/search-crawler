import test from 'ava';

import { Browser } from '../src/browser.js';

let browser;

test.before(async () => {
  browser = new Browser();
  await browser.init();
});

test.after(async () => {
  await browser.close();
});

test('visit should return meta info', async t => {
  const browser = new Browser();
  await browser.init();
  const info = await browser.visit('https://www.google.com/');
  await browser.close();
  t.truthy(info);
  t.truthy(info.title);
  t.truthy(info.text);
  t.truthy(info.lang);
  t.truthy(info.favicon);
  t.assert(Array.isArray(info.urls));
});

test('loadFavicon should return favicon', async t => {
  const browser = new Browser();
  await browser.init();
  const favicon = await browser.loadFavicon('https://www.google.com/favicon.ico');
  await browser.close();
  t.truthy(favicon);
});
