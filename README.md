# rxjs-node-stream-subject [![Build Status](https://travis-ci.org/topaxi/rxjs-node-stream-subject.svg?branch=master)](https://travis-ci.org/topaxi/rxjs-node-stream-subject) [![Test Coverage](https://codeclimate.com/github/topaxi/rxjs-node-stream-subject/badges/coverage.svg)](https://codeclimate.com/github/topaxi/rxjs-node-stream-subject/coverage) [![Code Climate](https://codeclimate.com/github/topaxi/rxjs-node-stream-subject/badges/gpa.svg)](https://codeclimate.com/github/topaxi/rxjs-node-stream-subject)

# Installation

```bash
$ npm install rxjs-node-stream-subject
```

## Usage
### StreamSubject
```javascript
var readline = require('readline')
var StreamSubject = require('rxjs-node-stream-subject')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var s = new StreamSubject({
  dataEvent: 'line',
  endEvent: 'end',
  createStream: function() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }
})

s.next('Write to stdout!\n')

// Map stin input
s.map(function(input) {
  return parseInt(input)
})
.forEach(function(integers) {
  // Do something with the entered integers!
})
```
### SocketSubject
```javascript
var SocketSubject = require('rxjs-node-stream-subject/dist/socket-subject').default

var s = new SocketSubject({
  host: 'topaxi.ch',
  port: 443,
  tls: true
})

s.next('GET / HTTP/1.1\r\n')
s.next('Host: topaxi.ch\r\n')
s.next('Connection: close\r\n')
s.next('\r\n')

s.subscribe(function(httpResponse) {
  console.log(httpResponse)
})
```

---

## [License](LICENSE)
