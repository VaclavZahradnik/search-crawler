import arangojs from 'arangojs';

import { environment } from '../env.js';

export function getDb() {
  let db = new arangojs.Database({ url: environment.db.url });
  db.useDatabase(environment.db.database);
  db.useBasicAuth(environment.db.userName, environment.db.password);
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}
