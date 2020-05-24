import test from 'ava';

import { AsyncPool } from '../src/async-pool.js';

test('waitAny should return after promise resolve', async t => {
  const pool = new AsyncPool();
  let promiseResolve;
  pool.enqueue(new Promise(resolve => (promiseResolve = resolve)));

  setTimeout(promiseResolve, 100);
  await pool.waitAny();
  t.pass();
});

test('waitAll should return after promise resolve', async t => {
  const pool = new AsyncPool();
  let promiseResolve;
  pool.enqueue(new Promise(resolve => (promiseResolve = resolve)));

  setTimeout(promiseResolve, 100);
  await pool.waitAll();
  t.pass();
});

test('waitAny should return after any promise resolve', async t => {
  const pool = new AsyncPool();
  let promiseResolve;
  pool.enqueue(new Promise(() => {}));
  pool.enqueue(new Promise(resolve => (promiseResolve = resolve)));

  setTimeout(promiseResolve, 100);
  await pool.waitAny();
  t.pass();
});

test('waitAll should return after all promises resolve', async t => {
  const pool = new AsyncPool();
  let promiseResolve1;
  let promiseResolve2;
  pool.enqueue(new Promise(resolve => (promiseResolve1 = resolve)));
  pool.enqueue(new Promise(resolve => (promiseResolve2 = resolve)));

  setTimeout(promiseResolve1, 100);
  setTimeout(promiseResolve2, 100);
  await pool.waitAll();
  t.pass();
});

test('waitAny could be called twice', async t => {
  const pool = new AsyncPool();
  let promiseResolve;
  pool.enqueue(new Promise(resolve => (promiseResolve = resolve)));

  setTimeout(promiseResolve, 100);
  await pool.waitAny();
  await pool.waitAny();
  t.pass();
});

test('waitAll could be called twice', async t => {
  const pool = new AsyncPool();
  let promiseResolve;
  pool.enqueue(new Promise(resolve => (promiseResolve = resolve)));

  setTimeout(promiseResolve, 100);
  await pool.waitAll();
  await pool.waitAll();
  t.pass();
});
