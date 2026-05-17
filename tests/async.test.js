import { test, expect } from 'vitest'

// ─── Stable async tests ───────────────────────────────────────────────

test('resolves a promise correctly', async () => {
  const result = await Promise.resolve(42)
  expect(result).toBe(42)
})

test('handles async delay', async () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))
  await delay(100)
  expect(true).toBe(true)
})

test('async function returns expected value', async () => {
  async function fetchData() {
    return { status: 'ok', value: 99 }
  }
  const data = await fetchData()
  expect(data.status).toBe('ok')
  expect(data.value).toBe(99)
})

test('Promise.all resolves all values', async () => {
  const results = await Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ])
  expect(results).toEqual([1, 2, 3])
})

// ─── Flaky async tests ────────────────────────────────────────────────

test('flaky - async timing race (fails ~40% of the time)', async () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms))

  // Simulates a race condition: sometimes task2 finishes before task1
  let winner = null
  const task1 = delay(Math.random() * 100).then(() => {
    if (!winner) winner = 'task1'
  })
  const task2 = delay(Math.random() * 100).then(() => {
    if (!winner) winner = 'task2'
  })

  await Promise.all([task1, task2])
  expect(winner).toBe('task1') // flaky — task2 often wins
})

test('flaky - async retry simulation (fails ~50% of the time)', async () => {
  async function unstableOperation() {
    await new Promise((res) => setTimeout(res, 50))
    if (Math.random() < 0.5) throw new Error('Transient failure')
    return 'success'
  }

  const result = await unstableOperation()
  expect(result).toBe('success')
})

test('flaky - async queue order (fails ~30% of the time)', async () => {
  const results = []

  async function push(val, delay) {
    await new Promise((res) => setTimeout(res, delay))
    results.push(val)
  }

  // Expects items in order but timing makes it non-deterministic
  await Promise.all([
    push('a', Math.random() * 80),
    push('b', Math.random() * 80),
    push('c', Math.random() * 80),
  ])

  expect(results[0]).toBe('a') // flaky — order depends on random delays
})

// ─── Always failing async tests ───────────────────────────────────────

test('always fails - promise rejects', async () => {
  await expect(Promise.reject(new Error('always broken'))).resolves.toBe('ok')
})
