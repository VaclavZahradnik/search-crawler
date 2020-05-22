import Crawler from './src/crawler.js';

(async () => {
  await new Crawler().start();
})();
