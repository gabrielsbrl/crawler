const express = require('express');
const consign = require('consign');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

consign()
    .include('db.js')
    .then('helpers/urlParser.js')
    .then('helpers/requestProduct.js')
    .then('routes')
    .into(app);

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`)
});

module.exports = app;