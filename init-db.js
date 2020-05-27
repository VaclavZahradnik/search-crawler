import arangojs from 'arangojs';

import { PageDao } from './src/dao/page-dao.js';
import { environment } from './src/env.js';

async function initDb() {
  const db = new arangojs.Database({ url: environment.db.url });
  db.useBasicAuth(environment.db.userName, environment.db.password);
  db.useDatabase(environment.db.database);
  const exists = await db.exists();

  if (exists) {
    console.log('database already exists...');
    return;
  }

  try {
    console.log(`creating database ${environment.db.database}`);
    db.useDatabase('_system');
    await db.createDatabase(environment.db.database);
  } catch (err) {
    console.error(`failed to create database ${environment.db.database}`, err);
    return;
  }

  console.log(`created database ${environment.db.database}`);

  db.useDatabase(environment.db.database);

  const collection = db.collection('pages');

  try {
    console.log('creating collection pages');
    await collection.create();
  } catch (err) {
    console.error('failed to create collection pages', err);
    return;
  }

  console.log('created collection pages');

  try {
    console.log('creating indexes');
    await collection.createFulltextIndex('title', 3);
    await collection.createFulltextIndex('text', 3);
    await collection.createPersistentIndex(['depth', 'lastVisit', 'nextVisit']);
    await collection.createPersistentIndex('url');
  } catch (err) {
    console.error('failed to create indexes', err);
    return;
  }

  console.log('created indexes');

  const pageDao = new PageDao();

  try {
    console.log('creating crawler seed pages');
    await pageDao.create('https://www.reddit.com/');
    await pageDao.create('https://www.wikipedia.org/');
    await pageDao.create('https://www.yahoo.com/');
    await pageDao.create('https://www.novinky.cz/');
  } catch (err) {
    console.error('failed to create crawler seed pages', err);
    return;
  }

  console.log('created crawler seed pages');
  console.log('database succesfully initialized');
}

(async () => {
  await initDb();
})();
