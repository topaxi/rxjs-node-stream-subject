import glob from 'glob'
import Mitm from 'mitm'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

global.expect = expect
global.Mitm = Mitm

for (let test of glob.sync('**/*-test.js', { cwd: __dirname })) {
  require(`./${test}`) //eslint-disable-line
}
