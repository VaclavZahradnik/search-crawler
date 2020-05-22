import arangojs from 'arangojs';

import { getDb, getCollection } from './arango-db.js';

const aql = arangojs.aql;

export class PageDao {
  async create(url) {
    let db = getDb();

    const query = aql`
      upsert { url: ${url} }
      insert { url: ${url} }
      update {}
      in pages
      return { id: NEW._id }  
    `;

    const cursor = await db.query(query);
    const result = await cursor.all();
    return result[0].id;
  }

  async patch(id, data) {
    let collection = getCollection('pages');
    await collection.update(id, data);
  }

  async listForCrawl() {
    let db = getDb();

    const query = aql`
      for p in pages
      filter p.lastVisit == null || p.nextVisit > DATE_NOW()
      limit 1000
      return { id: p._id, url: p.url }
    `;

    const cursor = await db.query(query);
    const result = await cursor.all();
    return result;
  }
}

export default PageDao;
