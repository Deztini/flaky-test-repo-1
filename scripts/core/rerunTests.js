const { execCommand } = require('../utils/exec')

function buildRerunCommand (test, framework) {
  switch (framework) {
    case 'jest':
      return `npx jest -t "${test.name}"`

    case 'vitest':
      return `npx vitest run -t "${test.name}"`

    case 'mocha':
      return `npx mocha --grep "${test.name}"`

    case 'playwright':
      return `npx playwright test --grep "${test.name}"`

    case 'cypress':
      return `npx cypress run --env grep="${test.name}"`

    default:
      return 'npm test'
  }
}

function isFailure (cmd) {
  try {
    const { execSync } = require('child_process')
    execSync(cmd, { stdio: 'pipe' })
    return false 
  } catch {
    return true 
  }
}
async function rerunTests (tests, framework) {
  const results = []

  for (const test of tests) {
   let failures = 0
    const runs = 5
    const cmd = buildRerunCommand(test, framework)

    for (let i = 0; i < runs; i++) {
      if (isFailure(cmd)) failures++
    }

    results.push({
      id: test.id,
      name: test.name,
      testCode: test.testCode,
      file: test.file,
      failRate: failures / runs,
      runs,
      isFlaky: failures > 0 && failures < runs,
    })
  }

  return results
}

module.exports = { rerunTests }
