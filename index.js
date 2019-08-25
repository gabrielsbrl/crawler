const rp = require('request-promise');
const cheerio = require('cheerio');

const http = require('http');
const url = require('url');

const options = {
    uri: 'https://www.kabum.com.br/cgi-local/site/produtos/descricao_ofertas.cgi?codigo=90504',
    transform: body => cheerio.load(body)
}

let productsSearched = [];

const server = http.createServer((req, res) => {
   
    let parsedUrl = url.parse(req.url, true);
    options.uri = parsedUrl.query.uri;

    if('uri' in parsedUrl.query) 
    {
        rp(options)
        .then($ => {    
    
            let priceAttribute = $('.openboxbutton-wrapper').attr('data-preco');
            let onHtmlTag = $('.preco_desconto_avista-cm').text();
            let onMetaTag = $("meta[itemprop='price']").attr('content');
    
            let products = {
                title: $('.titulo_det').text(),
                preco: priceAttribute ? priceAttribute : onHtmlTag ? onHtmlTag : `R$ ` + onMetaTag,
                image: $('.imagem_produto_descricao').attr('src')
            };          
        
            productsSearched.push(products)
            
            
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(productsSearched, 'utf8'),
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(productsSearched), 'utf8');
            res.end();
    
        })
        .catch(err => console.log(err)) 
    }
    else
    {
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(JSON.stringify({message: "nenhum produto para listar"}), 'utf8'),
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({message: "nenhum produto para listar"}));
        res.end();
    }

});

server.listen(3200, console.log('Running...'))