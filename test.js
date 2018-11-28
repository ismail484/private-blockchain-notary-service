const test = require('ava'),
      supertest = require('supertest'),
      bitcoin = require('bitcoinjs-lib'),
      bitcoinMessage = require('bitcoinjs-message'),
      keyPair = bitcoin.ECPair.makeRandom(),
      privateKey = keyPair.d.toBuffer(32),
      address = keyPair.getAddress(),
      fs = require('fs'),
      app = require('./app'),
      BASE_URL = 'http://localhost:8000'; 

test.before('Must specify BASE_URL', b => {
  b.truthy(BASE_URL)
})


test.cb('1. /requestValidation: test getting  message with validation window', b=> {
  supertest(BASE_URL)
    .post('/requestValidation')
    .send({address: address})
    .expect(200)
    .expect((res) => {
      b.is(res.status, 200)
      b.is(res.body.address, address)
      b.is(res.body.validationWindow, 300)
      b.hasOwnProperty('requestTimeStamp')
      b.hasOwnProperty('message')

      const message = res.body.message
      const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed).toString('base64')

      fs.writeFileSync('./data/signature.txt', signature)
    })
    .end(b.end)
})

test.cb('2. /message-signature/validate: test getting  a valid register star request', b => {
  setTimeout(() => {
    const signature = fs.readFileSync('./data/signature.txt').toString() 
  
    supertest(BASE_URL)
      .post('/message-signature/validate')
      .send({address: address, signature: signature})
      .expect(200)
      .expect((res) => {
        b.is(res.body.registerStar, true)
        b.hasOwnProperty('status')
      })
      .end(b.end)
  }, 1000)
})

test.cb('3. /block: could not be registered because missing dec property', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .post('/block')
      .send({
        address: address, 
        star: {
          ra: "16h 29m 1.0s", 
          story: `Test story of address ${address}`
        }
      })
      .expect(400)
      .expect((res) => {
        b.is(res.body.message, "Sorry,the star properties should be string")
      })
      .end(b.end)
  }, 2000)
})

test.cb('4. /block: could not be registered because missing ra property', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .post('/block')
      .send({
        address: address, 
        star: {
          dec: "-26° 29' 24.9", 
          story: `Test story of address ${address}`
        }
      })
      .expect(400)
      .expect((res) => {
        b.is(res.body.message, "Sorry,the star properties should be string")
      })
      .end(b.end)
  }, 2000)
})

test.cb('5. /block: could not be registered because missing story prpoerty', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .post('/block')
      .send({
        address: address, 
        star: {
          dec: "-26° 29' 24.9",
          ra: "16h 29m 1.0s"
        }
      })
      .expect(400)
      .expect((res) => {
        b.is(res.body.message, "Sorry,the star properties should be string")
      })
      .end(b.end)
  }, 2000)
})

test.cb('6. /block: test adding the new block', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .post('/block')
      .send({
        address: address, 
        star: {
          dec: "-26° 29' 24.9", 
          ra: "16h 29m 1.0s", 
          story: `Test story of address ${address}`}
        }
      )
      .expect(201)
      .expect((res) => {
        b.hasOwnProperty('hash')
        b.hasOwnProperty('height')
        b.hasOwnProperty('body')
        b.hasOwnProperty('time')
        b.hasOwnProperty('previousBlockHash')

        fs.writeFileSync('./data/hash.txt', res.body.hash)
      })
      .end(b.end)
  }, 2000)
})

test.cb('7. /block/height: test geeing the block by height', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .get('/block/1')
      .expect(200)
      .expect((res) => {
        b.hasOwnProperty('hash')
        b.hasOwnProperty('height')
        b.hasOwnProperty('body')
        b.hasOwnProperty('time')
        b.hasOwnProperty('previousBlockHash')
      })
      .end(b.end)
  }, 3000)
})

test.cb('8. /stars/hash:hash: test getting the block by hash', b => {
  setTimeout(() => {
    const hash = fs.readFileSync('./data/hash.txt').toString() 

    supertest(BASE_URL)
      .get(`/stars/hash:${hash}`)
      .expect(200)
      .expect((res) => {
        b.hasOwnProperty('hash')
        b.hasOwnProperty('height')
        b.hasOwnProperty('body')
        b.hasOwnProperty('time')
        b.hasOwnProperty('previousBlockHash')
      })
      .end(b.end)
  }, 3000)
})

test.cb('9. /stars/address:address: test getting the block by address', b => {
  setTimeout(() => {
    supertest(BASE_URL)
      .get(`/stars/address:${address}`)
      .expect(200)
      .expect((res) => {
        b.hasOwnProperty('hash')
        b.hasOwnProperty('height')
        b.hasOwnProperty('body')
        b.hasOwnProperty('time')
        b.hasOwnProperty('previousBlockHash')
      })
      .end(b.end)
  }, 3000)
})
