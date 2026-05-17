# flaky-test-repo

A minimal test repository for validating **FlakeyRadar** — contains intentionally flaky, stable, and always-failing tests across async, network, and general categories.

## Setup

```bash
npm install
npm test
```

## Test breakdown

| File | Stable | Flaky | Always Fails |
|------|--------|-------|--------------|
| `tests/async.test.js` | 4 | 3 | 1 |
| `tests/network.test.js` | 4 | 3 | 1 |
| `tests/general.test.js` | 4 | 4 | 1 |
| **Total** | **12** | **10** | **3** |

## What each test covers

### Async (`async.test.js`)
- Promise resolution and chaining
- Async timing races — simulates real concurrency bugs
- Retry simulation — unstable operations that fail transiently
- Queue ordering — non-deterministic async completion order

### Network (`network.test.js`)
- Real HTTP requests to `jsonplaceholder.typicode.com`
- Response time threshold — tight deadline that occasionally misses
- Concurrent request ordering — assumes network order, which isn't guaranteed
- Retry on random failure — simulates a flaky upstream service

### General (`general.test.js`)
- Math, string, object, array assertions
- Random number range — classic flaky pattern
- Clock precision — busy-wait timing
- Set/object ordering assumptions — subtle real-world flakiness

## Framework

Uses **Vitest** with JSON reporter. Results are written to `vitest-results.json`.
