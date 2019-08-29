const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
    uri: '',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'www.pichau.com.br',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    },
    gzip: true,
    transform: body => cheerio.load(body)
}

module.exports = app => {    
    return function(uri) {
        options.uri = uri;
        return rp(options)
            .then($ => {     

                let salesPrice = $(".price-boleto span").text()
                    .replace('à vista R$', '')
                    .split('à')[0]
                    .replace('.', '')
                    .replace(',', '.');

                console.log("PRECO: ", salesPrice);
                /* salesPrice = salesPrice.split('R$ ')
                    .map(s => parseFloat(s.replace('.', '').replace(',', '.')))
                    .filter(s => !isNaN(s)); */

                /* let bigger = salesPrice[0];
                let lower = salesPrice[0]; */

                let title = $(".title h1").text();
                let image = $(".fotorama__img").attr('src');

                console.log("Preço: ", salesPrice)

                /* salesPrice.forEach(s => {
                    if(s >= bigger)
                    {
                        bigger = s;
                    }
                    else
                    {
                        lower = s;
                    }
                });  */    
                
                console.log({
                    title,
                    precoAvista: salesPrice,
                    precoParcelado: salesPrice,
                    image                
                });

                let description = $(".value p").text().replace("'", '');

                return {
                    title,
                    precoAvista: salesPrice,
                    precoParcelado: salesPrice,
                    image,
                    description            
                };                  
            });
    }
}