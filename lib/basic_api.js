var rp = require('request-promise');
var CONSTANT = require('./constant');

var createHeader = function(user_agent){
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': user_agent,
    };
}

var createPostParam = function(objarray){
    var postparams = {};
    objarray.forEach(function(obj){
        Object.keys(obj).forEach(function(key){ postparams[key] = obj[key]; });
    });
    return postparams;
}

var createPostOption = function(url, user_agent, method, params){
    var post = createPostParam([{method:method}, params]);
    return {
        url: url,
        method: 'POST',
        form: post,
        headers: createHeader(user_agent),
    };
}

var query = exports.query = function(method, params){
    return rp(
        createPostOption(CONSTANT.VIRWOX_BASICAPI_URL,
            CONSTANT.USER_AGENT,
            method,
            params
        )
    ).then(JSON.parse).then(function(v){
        if(v.error) throw new Error(v.error);
        else return v.result;
    })
}

var getInstruments = exports.getInstruments = function(){
    return query('getInstruments', {})
}

var getBestPrices = exports.getBestPrices = function(pairs){
    return query('getBestPrices', {symbols:pairs})
}
var getMarketDepth = exports.getMarketDepth = function(pairs, depth){
    if(depth === undefined) depth = 0;
    return query('getMarketDepth', {symbols:pairs,buyDepth:depth,sellDepth:depth})
}
var estimateMarketOrder = exports.estimateMarketOrder = function(orderType, amount, instrument){
    return query('estimateMarketOrder', {orderType:orderType,amount:amount,instrument:instrument})
}
/*
var getFullBestPrices = function(){
    return getBestPrices(['EUR/SLL','USD/SLL','BTC/SLL']).
        then(function(r){
            var w = [];
            r.forEach(function(v){
                var o = {};
                if(v.errorCode !== 'OK') return;
                else o[v.symbol] = [v.bestBuyPrice, v.bestSellPrice];
                w.push(o);
            });
            return w;
        });
}
*/
//getFullBestPrices().then(console.log)
//estimateMarketOrder('BUY', 10, "EUR/SLL").then(console.log)

