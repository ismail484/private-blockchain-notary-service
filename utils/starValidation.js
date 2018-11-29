const level = require('level');
const starDB = '../data/star';
const db = level(starDB);
const bitcoinMessage = require('bitcoinjs-message')



class StarValidation {
  constructor (req) {
    this.req = req
  }

  validateAddressParameter() {
    if (this.req.body.address){
      console.log("the address is vaild")
      return true
    }else{
      throw new Error('please enter a valid address')
    }
   
  }

  validateSignatureParameter() {
    if (this.req.body.signature){
      console.log("the signature is vaild")
      return true
    }else{
      throw new Error('please enter a valid signature')
    }
  }

  validateNewStarRequest() {
    const maxStoryPerBytes = 500
    const { star } = this.req.body
    // dec, ra coordinates , story:shared story with max 500 Bytes 
    const { dec, ra, story} = star

    
    if (!this.validateAddressParameter() || !this.req.body.star) {
      throw new Error('please enter vaild address and star parameters')
    }

    if ((!dec && typeof dec !== 'string') || (!ra && typeof ra !== 'string') || (!story && typeof story !== 'string')) {
      throw new Error("Sorry,the star properties should be string")
    }

    if (new Buffer(story).length > maxStoryPerBytes) {
      throw new Error('Sorry,the  story should be not greater than  500 bytes')
    }

    const isASCIIData = ((str) => /^[\x00-\x7F]*$/.test(str))

    if (!isASCIIData(story)) {
      throw new Error('sorry, the story should contain ASCII symbols only ')
    }
  }

  isValid() {
    return db.get(this.req.body.address)
      .then((res) => {
        res = JSON.parse(res)
        return res.messageSignature === 'valid'
      })
      .catch(() => {throw new Error('Opps,it\'s Not authorized')})
  }

  deleteAddress(address) {
    db.del(address)
  }

  async validateMessageSignature(address, signature) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, res) => {
        if (res === undefined) {
          return reject(new Error('Adress is not found'))
        } else if (error) {
          return reject(error)
        }

        res = JSON.parse(res)

        if (res.messageSignature === 'valid') {
          return resolve({
            registerStar: true,
            status: res
        }) 
        } else {
          const expirationDate = Date.now() - (5 * 60 * 1000)
          const isExpired = res.requestTimeStamp < expirationDate
          let isValid = false
  
          if (isExpired) {
              res.validationWindow = 0
              res.messageSignature = 'Validation window was expired'
          } else {
              res.validationWindow = Math.floor((res.requestTimeStamp - expirationDate) / 1000) 
  
              try {
                isValid = bitcoinMessage.verify(res.message, address, signature)
              } catch (error) {
                isValid = false
              }
            
              res.messageSignature = isValid ? 'valid' : 'invalid'
          }
  
          db.put(address, JSON.stringify(res))
  
          return resolve({
              registerStar: !isExpired && isValid,
              status: res
          }) 
        }
      })
    })
  }

  saveNewRequestValidation (address) {
    const timestamp = Date.now()
    const message = `${address}:${timestamp}:starRegistry`
    const validationWindow = 300
  
    const data = {
      address: address,
      message: message,
      requestTimeStamp: timestamp,
      validationWindow: validationWindow
    }
  
    db.put(data.address, JSON.stringify(data))

    return data
  }

  async getPendingAddressRequest(address) {
    return new Promise((resolve, reject) => {
      db.get(address, (error, res) => {
        if (res === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        res = JSON.parse(res)

        const expirationDate = Date.now() - (5 * 60 * 1000)
        const isExpired = res.requestTimeStamp < expirationDate

        if (isExpired) {
            resolve(this.saveNewRequestValidation(address))
        } else {
          const data = {
            address: address,
            message: res.message,
            requestTimeStamp: res.requestTimeStamp,
            validationWindow: Math.floor((res.requestTimeStamp - expirationDate) / 1000)
          }

          resolve(data)
        }
      })
    })
  }
}
  
module.exports = StarValidation
