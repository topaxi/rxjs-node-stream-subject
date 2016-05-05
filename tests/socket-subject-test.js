import http from 'http'
import SocketSubject from '../lib/socket-subject'

function httpGet(path) {
  this.next(`GET ${path} HTTP/1.1\r\n`)
  this.next('Host: topaxi.ch\r\n')
  this.next('Connection: close\r\n')
  this.next('\r\n')
}

describe('HTTP', () => {
  let server

  beforeEach(() => {
    server = http.createServer((req, res) => {
      res.end('It works!')
    })
    server.on('clientError', (err, socket) =>
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    )
    server.listen(8042)
  })

  afterEach(done => {
    server.close(done)
  })

  it('Should be able to connect to a HTTP server', () => {
    const subject = new SocketSubject({
      host: 'localhost',
      port: 8042
    })

    subject::httpGet('/')

    let promise = subject.forEach(msg => {
      expect(msg.toString()).to.include('It works!')
    })

    return expect(promise).to.be.fulfilled
  })

  it('Should call the openObserver on connect', () => {
    const openObserver = {
      next: sinon.spy()
    }
    const subject = new SocketSubject({
      host: 'localhost',
      port: 8042,
      openObserver
    })

    subject::httpGet('/')

    let promise = subject.forEach(msg => {
      expect(msg.toString()).to.include('It works!')
    })

    return expect(promise).to.be.fulfilled.then(() =>
      expect(openObserver.next).to.have.been.calledOnce
    )
  })

  it('Should call the closeObserver after request', () => {
    const closeObserver = {
      next: sinon.spy()
    }
    const subject = new SocketSubject({
      host: 'localhost',
      port: 8042,
      closeObserver
    })

    subject::httpGet('/')

    let promise = subject.forEach(msg => {
      expect(msg.toString()).to.include('It works!')
    })

    return expect(promise).to.be.fulfilled.then(() =>
      expect(closeObserver.next).to.have.been.calledOnce
    )
  })
})
