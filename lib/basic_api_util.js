var CONSTANT = require('./constant');
var BasicApi = require('./basic_api');
var Promise = require('bluebird');

var s_cache = {};

var getBestPricesFilter = function(r){
    return r.
        filter(function(v){return v.errorCode === 'OK'}).
        reduce(function(ctx,v){
            ctx[v.symbol] = [v.bestSellPrice, v.bestBuyPrice];
            return ctx;
        }, {})
}

var getFullPrices = exports.getFullPrices = function(){
    return getInstruments().
        map(function(pairs){ return pairs.symbol }).
        then(function(pairs){
            return BasicApi.getBestPrices(pairs).
                then(getBestPricesFilter);
        });
}
var getCompositeRate = exports.getCompositeRate = function(pairs){
    var keyCurrency = 'SLL';
    var splitPairs = pairs.map(function(v){
        return v.split('/').map(function(v){
            return v + '/' + keyCurrency;
        });
    });
    return getFullPrices().
        then(function(results){
            var rate = splitPairs.map(function(pair){
                return [
                    results[pair[0]][0] / results[pair[1]][0],
                    results[pair[0]][1] / results[pair[1]][1]
                ];
            });
            return pairs.reduce(function(ctx, pair){
                ctx[pair] = rate.shift();
                return ctx;
            }, {});
        })
}
var getBitcoinRate = exports.getBitcoinRate = function(){
    return getCompositeRate(['BTC/USD','BTC/EUR','BTC/CHF','BTC/GBP']);
}
var getInstruments = exports.getInstruments = function(){
    if('allpairs' in s_cache){
        return Promise.resolve(s_cache.allpairs);
    }
    return BasicApi.getInstruments().then(function(v){
        s_cache.allpairs = Object.keys(v).map(function(k){
            return v[k];
        });
        return s_cache.allpairs;
    });
}
var initialize = exports.initialize = function(callback){
    getInstruments().then(function(){callback()}).catch(function(err){callback(err)})
}

