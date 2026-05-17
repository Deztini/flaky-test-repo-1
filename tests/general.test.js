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

// ─── Flaky tests ──────────────────────────────────────────────────────

test('flaky - random number in range (fails ~40% of the time)', () => {
  const value = Math.floor(Math.random() * 10)
  expect(value).toBeLessThan(6) // fails when value is 6, 7, 8, or 9
})

test('flaky - Date.now() precision (fails ~30% of the time)', () => {
  const start = Date.now()
  // Busy wait — sometimes the clock ticks during this
  let i = 0
  while (i < 1000000) i++
  const end = Date.now()

  // Expects no time to have passed — occasionally it does
  expect(end - start).toBe(0)
})

test('flaky - set iteration order (fails ~25% of the time)', () => {
  // Sets don't guarantee insertion order across all JS engines/versions
  const set = new Set()
  set.add('c')
  set.add('a')
  set.add('b')

  const items = [...set]
  expect(items[0]).toBe('a') // flaky — insertion order is 'c' first
})

test('flaky - object key ordering assumption (fails ~30% of the time)', () => {
  const obj = {}
  const keys = ['z', 'a', 'm', 'b']
  keys.forEach((k) => (obj[k] = true))

  // Key order isn't guaranteed — this is a common real-world flaky pattern
  const firstKey = Object.keys(obj)[0]
  expect(firstKey).toBe('a')
})

// ─── Always failing tests ─────────────────────────────────────────────

test('always fails - wrong value', () => {
  expect(1 + 1).toBe(3)
})
