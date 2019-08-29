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
        'Host': 'www.americanas.com.br',
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

                let salesPrice = $(".sales-price").text();
                console.log(salesPrice);
                salesPrice = salesPrice.split('R$ ')
                    .map(s => parseFloat(s.replace('.', '').replace(',', '.')))
                    .filter(s => !isNaN(s));

                let bigger = salesPrice[0];
                let lower = salesPrice[0];

                let title = $("#product-name-default").text();
                let image = $(".image-gallery-image img").attr('src');

                console.log(salesPrice)

                salesPrice.forEach(s => {
                    if(s >= bigger)
                    {
                        bigger = s;
                    }
                    else
                    {
                        lower = s;
                    }
                });     
                
                console.log({
                    title,
                    precoAvista: lower,
                    precoParcelado: bigger,
                    image                
                });

                let description = $(".info-description-frame-inside div").text().replace("'", '');

                return {
                    title,
                    precoAvista: lower,
                    precoParcelado: bigger,
                    image,
                    description            
                };                  
            });
    }
}