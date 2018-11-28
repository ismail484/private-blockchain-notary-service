
const compression = require('compression'),
      StarValidation = require('../utils/starValidation'),
      Block = require('../models/block'),
      bodyParser = require('body-parser'),
      Blockchain = require('../models/simpleChain'),
      myBlockChain = new Blockchain();
let blockHeight;

module.exports=function(app){

  
  validateSignatureParameter= async (req, res, next) => {
    try {
      const starValidation = new StarValidation(req)
      starValidation.validateSignatureParameter()

      //next passes control to the next matching route
      next()
    } catch (error) {
      res.status(400).json({
        status: "error",
        success: false,
        message: error.message
      })
    }
  },
  
  validateNewStarRequest = async (req, res, next) => {
    try {
      const starValidation = new StarValidation(req)
      starValidation.validateNewStarRequest()

      //next passes control to the next matching route
      next()
    } catch (error) {
      res.status(400).json({
        status: "error",
        success: false,
        message: error.message
      })
    }
  }


  validateAddressParameter = async (req, res, next) => {
    try {
      const starValidation = new StarValidation(req)
      starValidation.validateAddressParameter()
      
      //next passes control to the next matching route
      next()
    } catch (error) {
      res.status(400).json({
        status: "error",
        success: false,
        message: error.message
      })
    }
  },
  
  app.get('/', (req, res) => res.status(404).json({
    status: 404,
    message: 'Check the README.md for the accepted endpoints'
  }))
  
  /**
   * @description Criteria: Web API post endpoint validates request with JSON response.
   */
  //http://expressjs.com/en/4x/api.html :callback:An array of middleware functions.
  app.post('/requestValidation', [validateAddressParameter], async (req, res) => {
    const starValidation = new StarValidation(req)
    const address = req.body.address
  
    try {
      data = await starValidation.getPendingAddressRequest(address)
    } catch (error) {
      data = await starValidation.saveNewRequestValidation(address)
    }
  
    res.json(data)
  })
  
  /**
   * @description Criteria: Web API post endpoint validates message signature with JSON response.
   */
  //http://expressjs.com/en/4x/api.html :callback:An array of middleware functions.
  app.post('/message-signature/validate', [validateAddressParameter, validateSignatureParameter], async (req, res) => {
    const starValidation = new StarValidation(req)
  
    try {
      const { address, signature } = req.body
      const response = await starValidation.validateMessageSignature(address, signature)
  
      if (response.registerStar) {
        res.json(response)
      } else {
        res.status(401).json(response)
      }
    } catch (error) {
      res.status(404).json({
        status: 404,
        success:false,
        message: error.message
      })
    }
  })
  
  /**
   * @description Criteria: Star registration Endpoint
   */
  app.post('/block', [validateNewStarRequest], async (req, res) => {
    const starValidation = new StarValidation(req)
  
    try {
      const isValid = await starValidation.isValid()
  
      if (!isValid) {
        throw new Error('Sorry,Signature is not valid')
      }
    } catch (error) {
      res.status(404).json({
        status: "error",
        success:false,
        message: error.message
      })
  
    }
  
    const body  ={address, star}=req.body
    const story = star.story
  
    body.star = {
      dec: star.dec,
      ra: star.ra,
      story: new Buffer(story).toString('hex'),
      mag: star.mag,
      con: star.con
    }
    
    await myBlockChain.addBlock(new Block(body))
    const height = await myBlockChain.getBlockHeight()
    const myBlock = await myBlockChain.getBlock(height)
  
    starValidation.deleteAddress(address)

    res.status(201).send(myBlock)
  })
  
  /**
   * @description Criteria: Get star block by star block height with JSON response.
   */
  app.get('/block/:height', async (req, res) => {
    try {
      const response = await myBlockChain.getBlock(req.params.height)
  
      res.send(response)
    } catch (error) {
      res.status(404).json({
        status: 404,
        success:false,
        message: 'Block not found'
      })
    }
  })
  
  /**
   * @description Criteria: Get star block by wallet address (blockchain identity) with JSON response.
   */
  app.get('/stars/address:address', async (req, res) => {
    try {
      const address = req.params.address.slice(1)
      const response = await myBlockChain.getBlocksByAddress(address)
  
      res.send(response)
    } catch (error) {
      res.status(404).json({
        status: 404,
        success:false,
        message: 'Block not found'
      })
    }
  })
  
  /**
   * @description Criteria: Get star block by hash with JSON response.
   */
  app.get('/stars/hash:hash', async (req, res) => {
    try {
      const hash = req.params.hash.slice(1)
      const response = await myBlockChain.getBlockByHash(hash)
  
      res.send(response)
    } catch (error) {
      res.status(404).json({
        status: 404,
        success:false,
        message: 'Block not found'
      })
    }
  })

}
