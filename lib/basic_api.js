//var rp = require('request-promise');
var lp = require('./system').lp;
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
    return lp.req(
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
var estimateMarketOrder = exports.estimateMarketOrder = function(orderType, amount, pair){
    return query('estimateMarketOrder', {orderType:orderType,amount:amount,instrument:pair})
}
var getTradedPriceVolume = exports.getTradedPriceVolume = function(pair, startDate, endDate, params){
    var p = {
        instrument:pair,
        startDate:startDate,
        endDate:endDate
    };
    if(params){
        Object.keys(params).forEach(function(k){p[k] = params[k];});
    }
    return query('getTradedPriceVolume', p)
}
var getRawTradeData = exports.getRawTradeData = function(pair, timespan){
    var p = {
        instrument:pair,
        timespan:timespan,
    };
    return query('getRawTradeData', p)
}
var getStatistics = exports.getStatistics = function(params){
    if(!params) params = {};
    return query('getStatistics', params)
}
var getTerminalList = exports.getTerminalList = function(){
    var params = {};
    return query('getTerminalList', params)
}
var getGridList = exports.getGridList = function(){
    var params = {};
    return query('getGridList', params)
}
var getGridStatistics = exports.getGridStatistics = function(startDate, endDate, params){
    var p = {
        startDate:startDate,
        endDate:endDate,
    };
    if(params){
        Object.keys(params).forEach(function(k){p[k] = params[k];});
    }
    return query('getGridStatistics', p);
}

