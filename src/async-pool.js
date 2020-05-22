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
    const { index, data } = await Promise.race(this._pool);
    this._pool[index] = null;
    return data;
  }
}

export default AsyncPool;
