export class AsyncPool {
  constructor() {
    this._pool = [];
  }

  enqueue(promise) {
    let index = this._pool.findIndex(x => !x);
    if (index == -1) index = this._pool.length;
    const wrapped = new Promise(async resolve => {
      const data = await promise;
      resolve({ index, data });
    });
    this._pool[index] = wrapped;
  }

  async waitAny() {
    const pool = this._pool.filter(x => x);
    if (!pool.length) return;
    const { data, index } = await Promise.race(pool);
    this._pool[index] = null;
    return data;
  }

  async waitAll() {
    const pool = this._pool.filter(x => x);
    if (!pool.length) return;
    const data = await Promise.all(pool);
    data.forEach(x => (this._pool[x] = null));
    return data.map(x => x.data);
  }
}

export default AsyncPool;
