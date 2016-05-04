import net from 'net'
import tls from 'tls'
import { Observable } from 'rxjs/Observable'
import StreamSubject from './stream-subject'

export default class SocketSubject extends StreamSubject {
  constructor(optionsOrSource, destination) {
    if (destination instanceof Observable) {
      super(destination, optionsOrSource)

      return
    }

    super({
      dataEvent: 'data',
      endEvent: 'end',
      openEvent: optionsOrSource.tls ? 'secureConnect' : 'connect'
    })
    this.connectOptions = optionsOrSource
  }

  _createStream() {
    return (this.connectOptions.tls ? tls : net)
      .connect(this.connectOptions)
  }
}
