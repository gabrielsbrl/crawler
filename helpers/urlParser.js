const rp = require('request-promise');
const cheerio = require('cheerio');

const url = require('url');

module.exports = app => {

    return {
        parseUri: uri => url.parse(uri, true),
        getUriOptions: (uri, option) => uri.query[option],
        getIdProductUrl: function(uri) {
            return this.getUriOptions(this.parseUri(uri), 'id');
        },
        getProductUrl: function(uri) {
            return this.getUriOptions(this.parseUri(uri), 'uri');
        } 
    }    

};