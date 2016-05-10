import stream from 'stream'
import StreamSubject from '../lib/stream-subject'

describe('StreamSubject', () => {
  let duplex

  beforeEach(() => {
    duplex = new stream.PassThrough
  })

  it('Should be able to get data from a duplex stream', done => {
    const subject = new StreamSubject({
      endEvent: 'finish',
      dataEvent: 'data',
      createStream() {
        return duplex
      }
    })

    duplex.write('foo')

    subject.subscribe(data => {
      expect(data.toString()).to.equal('foo')
      done()
    })
  })

  it('Should be able to send to a duplex stream', done => {
    const subject = new StreamSubject({
      endEvent: 'finish',
      dataEvent: 'data',
      createStream() {
        return duplex
      }
    })

    let gotData = false

    subject.next('foo')

    duplex.on('data', data => {
      gotData = true
      expect(data.toString()).to.equal('foo')
    })

    duplex.on('finish', () => {
      expect(gotData).to.be.true
      done()
    })

    process.nextTick(::duplex.end)

    subject.subscribe()
  })

  it('Should call the closingObserver on error', done => {
    const closingObserver = {
      next: done
    }
    const subject = new StreamSubject({
      endEvent: 'finish',
      dataEvent: 'data',
      closingObserver,
      createStream() {
        return duplex
      }
    })

    process.nextTick(() => {
      duplex.emit('error', new Error('foo'))
    })

    subject.subscribe()
  })
})
