import glob from 'glob'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(chaiAsPromised)
chai.use(sinonChai)

global.sinon = sinon
global.expect = expect

for (let test of glob.sync('**/*-test.js', { cwd: __dirname })) {
  require(`./${test}`) //eslint-disable-line
}
