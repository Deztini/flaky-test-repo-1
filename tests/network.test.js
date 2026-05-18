import { test, expect } from 'vitest'

// ─── Stable network tests ─────────────────────────────────────────────

test('fetches data from public API', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()

  expect(res.status).toBe(200)
  expect(data).toHaveProperty('id', 1)
  expect(data).toHaveProperty('title')
  expect(typeof data.completed).toBe('boolean')
})

test('fetches list and checks length', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  const data = await res.json()

  expect(res.status).toBe(200)
  expect(Array.isArray(data)).toBe(true)
  expect(data.length).toBe(5)
})

test('handles 404 gracefully', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/99999')
  expect(res.status).toBe(404)
})

test('fetches user data and validates shape', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users/1')
  const user = await res.json()

  expect(user).toHaveProperty('name')
  expect(user).toHaveProperty('email')
  expect(user).toHaveProperty('address')
})

// ─── Truly flaky network tests ────────────────────────────────────────

test('flaky - response time threshold (fails ~40% of the time)', async () => {
  const start = Date.now()
  await fetch('https://jsonplaceholder.typicode.com/posts')
  const duration = Date.now() - start
  expect(duration).toBeLessThan(300)
})

test('flaky - random failure on valid request (fails ~50% of the time)', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()
  // Randomly decides to fail even on valid data
  if (Math.random() < 0.5) throw new Error('Simulated flaky assertion')
  expect(data.id).toBe(1)
})

test('flaky - random pick from response (fails ~40% of the time)', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
  const todos = await res.json()
  // Picks a random todo and expects it to be completed — only ~40% are
  const random = todos[Math.floor(Math.random() * todos.length)]
  expect(random.completed).toBe(true)
})

// ─── Always failing network tests ────────────────────────────────────

test('always fails - wrong expected status', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  expect(res.status).toBe(500) // will always fail
})
