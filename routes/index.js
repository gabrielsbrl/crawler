module.exports = app => {

    app.get('/products', async (req, res) => {

        try {
            let db = app.db;

            let products = await db.select('products');
            res.json(products);
        }
        catch(ex)
        {
            res.json(ex)
        }
    });

    app.get('/products/total', async (req, res) => {
        let db = app.db;
        let products = await db.select('products');

        products = products
            .map(p => p.priceLower)
            .reduce((anterior, atual) => parseFloat(parseFloat(anterior) + parseFloat(atual)).toFixed(2), 0);

        res.json(products);
    });

    app.post('/products', async (req, res) => {        

        let db = app.db;
        let uriQueryParameter = req.body.uri;
        let request = null;

        if(uriQueryParameter.includes('americanas'))
            request = app.helpers.requestAmericanas;

        if(uriQueryParameter.includes('kabum'))
            request = app.helpers.requestProduct;  
            
        if(uriQueryParameter.includes('pichau'))
            request = app.helpers.requestPichau;

        console.log("has: ", uriQueryParameter.includes('pichau'))

        if(uriQueryParameter) 
        {
            try {
                product = await request(uriQueryParameter);

                let result = await db.insert('products', {
                    priceBigger: product.precoParcelado,
                    priceLower: product.precoAvista,
                    title: product.title,
                    image: product.image,
                    description: product.description,
                    link: uriQueryParameter
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

    app.delete('/products/:id', async (req, res) => {
        
        let idProduct = req.params.id;

        if(idProduct) 
        {
            try {

                let db = app.db;
                let response = await db.delete('products', idProduct);

                res.status(200).json({
                    success: response.affectedRows > 0,
                    error: null,
                    data: [] 
                })

            }
            catch(ex)
            {
                res.status(500).json({
                    message: ex.message
                });
            }
        } 
    });

}