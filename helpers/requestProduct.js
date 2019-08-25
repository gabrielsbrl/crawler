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
                let onDiv = $('.preco_normal-cm span span').text();     
                let span = $('.preco_desconto span span strong').text();
                let priceAttribute = $('.openboxbutton-wrapper').attr('data-preco');
                let onHtmlTag = $('.preco_desconto_avista-cm').text();
                let onMetaTag = $("meta[itemprop='price']").attr('content');               
                let prd_title = $('.titulo_det').text();
                
                onDiv = parseFloat(onDiv.replace('R$', '').replace('.', ''));
                span = parseFloat(span.replace('R$ ', '').replace('.', ''));
                
                console.log('span price: ', span);
                console.log(prd_title);
    
                return {
                    title: prd_title,
                    preco: onDiv ? onDiv : span ? span : priceAttribute ? priceAttribute : onHtmlTag ? onHtmlTag : `R$ ` + onMetaTag,
                    image: $('.imagem_produto_descricao').attr('src')
                };          
        
            });
    }
}