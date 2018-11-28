const express = require('express');
const compression = require('compression');
const bodyParser= require('body-parser');
const app = express();
const blockChainValidationController = require('./controllers/blockChainValidationController');
let   port = process.env.PORT || 8000;

app.use(compression());
app.use(bodyParser.json());
blockChainValidationController(app);

app.listen(port),() => console.log(`server run in ${port}`);





