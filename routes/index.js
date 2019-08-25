module.exports = app => {

    app.get('/products', async (req, res) => {

        let db = app.db;

        let products = await db.select('products');

        res.json(products);
                
    });

    app.get('/', async (req, res) => {
        try {
            let db = app.db;
            let products = await db.select("products");
    
            console.log("products: ", products);
            res.json(products);
        }
        catch(ex)
        {
            res.json(ex);
        }
    });

    app.get('/products/total', async (req, res) => {
        let db = app.db;
        let products = await db.select('products');
        products = products
            .map(p => p.price)
            .reduce((anterior, atual) => parseFloat(anterior) + parseFloat(atual), 0);
        res.json(products);
    });

    app.post('/products', async (req, res) => {        

        let db = app.db;
        let request = app.helpers.requestProduct;
        //let insertResult = db.insert('products', );
        let uriQueryParameter = req.body.uri;

        if(uriQueryParameter) 
        {
            try {
                product = await request(uriQueryParameter);
                let result = await db.insert('products', {
                    price: product.preco,
                    title: product.title,
                    image: product.image
                });
                res.json({
                    success: result.affectedRows > 0,
                    data: result.affectedRows >  0 ? [{
                        id: result.insertId
                    }] : []
                });
            }
            catch(ex)
            {
                res.json(ex);
            }
        }
    });

    app.post('/', async (req, res) => {

        let mg = require('../mg');
                
        let request = app.helpers.requestProduct;
        
        let uriQueryParameter = req.body.uri;

        let product = null;

        if(uriQueryParameter) 
        {
            try {
                product = await request(uriQueryParameter);
                /* 
                let db = app.db;
    
                let resultOfProductInsertion = await db.insert('products', {
                    price: product.preco,
                    title: product.title,
                    image: product.image,
                }); */

                let Products = mg.Mongoose.model('productsCollection', mg.ProductSchema, 'productsCollection');
                let products = new Products({ price: product.preco, title: product.title, image: product.image });
                
                products.save(function(err) {
                    if (err) {
                        console.log("Error! " + err.message);
                        res.status(500).json({
                            message: "Product no inserted"
                        });
                    }
                    else {
                        console.log("Post saved");
                        res.status(200).json({
                            message: "Product inserted"
                        });
                    }
                });
    
                /* if('insertId' in resultOfProductInsertion) 
                {
                    console.log('inserted');
    
                    res.status(200).json({
                        message: "Product inserted"
                    });
                }
                else
                {
                    console.log('not inserted');
    
                    res.status(500).json({
                        message: "Product no inserted"
                    });
                } */
            }
            catch(ex)
            {
                console.log(ex);
                res.status(500).json({
                    message: ex.message
                });
            }
        }
    });

    app.delete('/products/:id', async (req, res) => {
        
        let idProduct = req.params.id;

        if(idProduct) 
        {
            try {

                let db = app.db;
                let response = await db.delete('products', idProduct);
                
                console.log(response);

                res.status(200).json({
                    success: response.affectedRows > 0,
                    error: null,
                    data: [] 
                })

            }
            catch(ex)
            {
                console.log(ex);
                res.status(500).json({
                    message: ex.message
                });
            }
        } 
    });

    app.get('/product-insert', async (req, res) => {

        console.log('Requested route: ', req.url);        

    });

}