import Assert from 'assert'
import Path from 'path'
import Fs from 'fs'
const Babel = require('babel-core')

const fixturesDirectory = Path.join(__dirname, 'fixtures')

const babelOptions = {
  plugins: [
    require('babel-plugin-external-helpers'),
    require('../lib').default
  ]
}

Fs.readdirSync(fixturesDirectory).forEach(testDirectory)

function testDirectory(name) {
  const actualCode = Fs.readFileSync(Path.join(fixturesDirectory, name, 'actual.js'), 'utf8')
  const expectedCode = Fs.readFileSync(Path.join(fixturesDirectory, name, 'expected.js'), 'utf8')

  it(name, () => {
    const transformedCode = Babel.transform(actualCode, babelOptions).code
    Assert.equal(transformedCode + '\n', expectedCode)
  })
}
