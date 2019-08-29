const express = require('express');
const consign = require('consign');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const requestAmericanas = require('./helpers/requestAmericanas');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/', async (req, res) => {
    let uri = req.body.uri;
    let product = await requestAmericanas(uri);
    res.json(product);
}); 

app.listen(port, () => {
    console.log(`Server is running at localhost:${port}`)
});

module.exports = app;