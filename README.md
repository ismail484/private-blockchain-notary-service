 
# Project: private-blockchain-notary-service - [Mohamed Ismail]

# Testing

  [![passing](https://semaphoreci.com/api/v1/ibrunotome/udacity-blockchain-developer-nanodegree/branches/master/badge.svg)](https://semaphoreci.com/api/v1/ibrunotome/udacity-blockchain-developer-nanodegree/branches/master/badge.svg)



# Description
  
  ### First open [[Private Blockchain Notary Service App](http://localhost:8000/book/:id) to discover, how app works .
  - Simply , It acts as a restfull Blockchain API using Nodejs (Express)   .
  - build a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.
  - This web App introduces the fundamentals of web APIs with Node.js frameworks. Using my own private blockchain to create a web API is a huge first step toward developing my own web applications that are consumable by a variety of web clients.
  

  #### How  components do interact with each other:

```
app.js
│     
│
└───models 
│   │  
│   └─── block.js
│   │        
│   └───  simpleChain.js
│     
└───  controllers.js   
|        │
|        └───  blockChainValidationController.js
|
|
|
└───utils   
     | 
     └───  startValidation.js
        
    
 ``` 

# Required Libraries and Dependencies
   - Ava globally  : run ` npm install --global ava`
   - Ava as a development dependency : run ` ava --init`
   - Ava assertion : run `npm install --save ava-assert`
   - Body-parser : run `npm install --save body-parser`
   - Crypto-js : run `npm install --save crypto-js`
   - express : run `npm install --save express`
   - level db : run `npm install level --save`
   - nodemon global : run `npm install -g nodemon`
   - nodemon as a development dependency : run `npm install --save-dev nodemon`
   - Super test   : run `npm install supertest --save-dev` 

   
   

# How to Run Project 
   1.  Download all Project files
   2.  Run `npm install` to install all required dependancies &packages .
   3.  Run `nodemon app.js`
   4.  open browser [Private Blockchain Notary Service App](http://localhost:8000/book/5)
 
 # APIs
   1.  http://localhost:8000/requestValidation.
   2.  http://localhost:8000/message-signature/validate
   3.  http://localhost:8000/block
   4.  http://localhost:8000/stars/hash:[HASH]
   5.  http://localhost:8000/stars/address:[ADDRESS]
   6.  http://localhost:8000/block/[HEIGHT]
  
 
# Test
  - run `ava test.js` .
  - I checked I get &post block data correctly



# Resources
 
   1. [Expressjs](https://www.npmjs.com/package/express)
   2. [Ava-Assertion](https://github.com/avajs/ava-assert)
   3. [AVA Testing](https://github.com/avajs/ava)
   4. [Superr Test](https://www.npmjs.com/package/supertest)
   5. [Nodemon server](https://github.com/remy/nodemon)
   6. [Body Parser](https://www.npmjs.com/package/body-parser)
   7. [Level DB](https://www.npmjs.com/package/level)
   8. [Bitcoin Messages ](https://github.com/bitcoinjs/bitcoinjs-message)
