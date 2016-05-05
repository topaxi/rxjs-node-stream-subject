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
      openEvent: optionsOrSource.tls ? 'secureConnect' : 'connect',
      openObserver: optionsOrSource.openObserver,
      closeObserver: optionsOrSource.closeObserver,
      closingObserver: optionsOrSource.closingObserver,
      createStream: () =>
        (this._socketOptions.tls ? tls : net).connect(this._socketOptions)
    })
    this._socketOptions = optionsOrSource
  }
}
