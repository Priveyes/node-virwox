var Virwox = require('..');
var util = Virwox.BasicApiUtil;
var Promise = require('bluebird');
var fx = require('yahoo-currency');

Promise.all([
    fx.fullRate(),
    util.getBitcoinRate()
]).spread(function(c,b){
    var feerate = 1.091;
    b['BTC/USD'] = b['BTC/USD'].map(function(v){return v * feerate});
    b['BTC/JPY'] = b['BTC/USD'].map(function(v){return v * c['USDJPY']});
    b['BTC/CNY'] = b['BTC/USD'].map(function(v){return v * c['USDCNY']});
    var yahoo = {'USD/JPY':c['USDJPY'],'BTC/USD':c['BTCUSD'],'BTC/JPY':c['BTCJPY'],'BTC/CNY':c['BTCCNY']};
    var vw = {'BTC/USD':b['BTC/USD'],'BTC/JPY':b['BTC/JPY'],'BTC/CNY':b['BTC/CNY']};
    return [yahoo,vw];
}).then(console.log)

