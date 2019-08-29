const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
    uri: '',
    transform: body => cheerio.load(body)
}

module.exports = app => {
    return function(uri) {
        options.uri = uri;
        return rp(options)
            .then($ => {     

                let priceList = [
                    $('.preco_normal-cm span span').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
                    $('.preco_desconto span span strong').text(),
                    $('.openboxbutton-wrapper').attr('data-preco'),
                    $('.preco_desconto_avista-cm').text().replace('R$ ', '').replace('.', '').replace(',', '.'),                        
                    $("meta[itemprop='price']").attr('content'),            
                ]

                priceList = priceList
                    .map(p => parseFloat(p).toFixed(2))
                    .filter(p => !isNaN(p))

                let bigger = priceList[0];
                let lower = priceList[0];

                priceList.forEach(p => {
                    if(p >= bigger)
                        bigger = p
                    else if(p <= lower)
                        lower = p
                })

                let prd_title = $('.titulo_det').text()                
                let description = $('.content_tab p').text().replace("'", '');

                return {
                    title: prd_title,
                    precoAvista: lower,
                    precoParcelado: bigger,
                    image: $('.imagem_produto_descricao').attr('src'),
                    description,                    
                };          
        
            });
    }
}