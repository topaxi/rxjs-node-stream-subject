import http from 'http'
import SocketSubject from '../lib/socket-subject'

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

  it('Should be able to connect to a HTTP server', () => {
    const s = new SocketSubject({
      host: 'localhost',
      port: 8042
    })

    s.next('GET / HTTP/1.1\r\n')
    s.next('Host: topaxi.ch\r\n')
    s.next('Connection: close\r\n')
    s.next('\r\n')

    let promise = s.forEach(msg => {
      expect(msg.toString()).to.include('It works!')
    })

    return expect(promise).to.be.fulfilled
  })
})
