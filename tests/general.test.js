import { test, expect } from 'vitest'

// ─── Stable tests ─────────────────────────────────────────────────────

test('adds two numbers', () => {
  expect(2 + 2).toBe(4)
})

test('string contains expected value', () => {
  expect('FlakeyRadar works').toContain('FlakeyRadar')
})

test('object has correct shape', () => {
  const user = { id: 1, name: 'Ada', active: true }
  expect(user).toMatchObject({ id: 1, active: true })
})

test('array operations are correct', () => {
  const arr = [1, 2, 3, 4, 5]
  expect(arr.filter((n) => n % 2 === 0)).toEqual([2, 4])
})

// ─── Truly flaky tests ────────────────────────────────────────────────

test('flaky - random number in range (fails ~40% of the time)', () => {
  const value = Math.floor(Math.random() * 10)
  expect(value).toBeLessThan(6)
})

test('flaky - random boolean (fails ~50% of the time)', () => {
  const value = Math.random()
  expect(value).toBeGreaterThan(0.5)
})

test('flaky - random array pick (fails ~30% of the time)', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
  const picked = items[Math.floor(Math.random() * items.length)]
  expect(['a', 'b', 'c', 'd', 'e', 'f', 'g']).toContain(picked)
})

test('flaky - random delay timing (fails ~40% of the time)', async () => {
  const start = Date.now()
  await new Promise((res) => setTimeout(res, Math.random() * 200))
  const duration = Date.now() - start
  expect(duration).toBeLessThan(120)
})

// ─── Always failing tests ─────────────────────────────────────────────

test('always fails - wrong value', () => {
  expect(1 + 1).toBe(3)
})
