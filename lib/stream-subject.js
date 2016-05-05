import { Subject }       from 'rxjs/Subject'
import { Subscriber }    from 'rxjs/Subscriber'
import { Subscription }  from 'rxjs/Subscription'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { Observable }    from 'rxjs/Observable'

export default class StreamSubject extends Subject {
  constructor(optionsOrSource, destination) {
    if (destination instanceof Observable) {
      super(destination, optionsOrSource)

      return
    }

    super()
    this.options = optionsOrSource
    this.stream = null
    this.observers = null
    this.openObserver = optionsOrSource.openObserver
    this.closeObserver = optionsOrSource.closeObserver
    this.closingObserver = optionsOrSource.closingObserver

    this.destination = new ReplaySubject
  }

  lift(operator) {
    let subj = new StreamSubject(this, this.destination)

    subj.operator = operator

    return subj
  }

  _unsubscribe() {
    this.options = null
    this.destination = new ReplaySubject
    this.isStopped = false
    this.hasErrored = false
    this.hasCompleted = false
    this.observers = null
    this.isUnsubscribed = false
  }

  _subscribe(subscriber) {
    if (!this.observers) {
      this.observers = []
    }

    let subscription = super._subscribe(subscriber)
    let hasSource = () =>
      this.source || !subscription || subscription.isUnsubscribed

    if (hasSource()) {
      return subscription
    }

    if (this.options && !this.stream) {
      this.stream = this.options.createStream()
      let createSubscription = () => {
        if (this.openObserver) {
          this.openObserver.next(this.stream)
        }

        let queue = this.destination

        this.destination = Subscriber.create(
          x => this.stream.writable !== false && this.stream.write(x),
          () => {
            if (this.closingObserver) {
              this.closingObserver.next(undefined)
            }

            this.stream.destroy()
          },
          () => {
            if (this.closingObserver) {
              this.closingObserver.next(undefined)
            }
            this.stream.destroy()
          }
        )

        if (queue && queue instanceof ReplaySubject) {
          subscription.add(queue).subscribe(this.destination)
        }
      }

      if (this.options.openEvent) {
        this.stream.on(this.options.openEvent, createSubscription)
      }
      else {
        createSubscription()
      }

      this.stream.on('error', e => this.error(e))
      this.stream.on(this.options.endEvent, () => {
        if (this.closeObserver) {
          this.closeObserver.next(undefined)
        }

        this._finalComplete()
      })
      this.stream.on(this.options.dataEvent, data => this._finalNext(data))
    }

    return new Subscription(() => {
      subscription.unsubscribe()

      if (!this.observers || !this.observers.length) {
        if (this.stream) {
          this.stream.destroy()
        }

        this.stream = undefined
        this.source = undefined
        this.destination = new ReplaySubject
      }
    })
  }
}
