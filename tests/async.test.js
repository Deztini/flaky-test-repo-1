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

// ─── Truly flaky async tests ──────────────────────────────────────────

test('flaky - async random failure (fails ~50% of the time)', async () => {
  async function unstableOperation() {
    await new Promise((res) => setTimeout(res, 50))
    if (Math.random() < 0.5) throw new Error('Transient failure')
    return 'success'
  }

  const result = await unstableOperation()
  expect(result).toBe('success')
})

test('flaky - async random value check (fails ~40% of the time)', async () => {
  async function fetchRandomScore() {
    await new Promise((res) => setTimeout(res, 30))
    return Math.floor(Math.random() * 10)
  }

  const score = await fetchRandomScore()
  expect(score).toBeLessThan(6)
})

test('flaky - async timeout threshold (fails ~40% of the time)', async () => {
  const start = Date.now()
  await new Promise((res) => setTimeout(res, Math.random() * 200))
  const duration = Date.now() - start
  expect(duration).toBeLessThan(120)
})

// ─── Always failing async tests ───────────────────────────────────────

test('always fails - promise rejects', async () => {
  await expect(Promise.reject(new Error('always broken'))).resolves.toBe('ok')
})
