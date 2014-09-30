var Virwox = require('..');
var util = Virwox.BasicApiUtil;
var Promise = require('bluebird');
var fx = require('yahoo-currency');

Promise.all([
    fx.fullRate(),
    util.getBitcoinRate()
]).spread(function(c,b){
    b['BTC/JPY'] = b['BTC/USD'].map(function(v){return v * c['USDJPY']});
    var x = {'BTC/USD':c['BTCUSD'],'BTC/JPY':c['BTCJPY']};
    return [x,b];
}).then(console.log)

