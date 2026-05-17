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

// ─── Flaky network tests ──────────────────────────────────────────────

test('flaky - response time threshold (fails ~40% of the time)', async () => {
  const start = Date.now()
  await fetch('https://jsonplaceholder.typicode.com/posts')
  const duration = Date.now() - start

  // Tight threshold — sometimes the network is just a bit slow
  expect(duration).toBeLessThan(300)
})

test('flaky - concurrent requests finish in order (fails ~35% of the time)', async () => {
  const order = []

  const req1 = fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(() => order.push('req1'))
  const req2 = fetch('https://jsonplaceholder.typicode.com/todos/2')
    .then(() => order.push('req2'))
  const req3 = fetch('https://jsonplaceholder.typicode.com/todos/3')
    .then(() => order.push('req3'))

  await Promise.all([req1, req2, req3])

  // Assumes req1 finishes first — not guaranteed over the network
  expect(order[0]).toBe('req1')
})

test('flaky - retry on random failure (fails ~50% of the time)', async () => {
  // Simulates an intermittently failing endpoint by randomly throwing
  async function flakyFetch(url) {
    const res = await fetch(url)
    if (Math.random() < 0.5) throw new Error('Simulated network blip')
    return res
  }

  const res = await flakyFetch('https://jsonplaceholder.typicode.com/todos/1')
  expect(res.status).toBe(200)
})

// ─── Always failing network tests ────────────────────────────────────

test('always fails - wrong expected status', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  expect(res.status).toBe(500) // will always fail
})
