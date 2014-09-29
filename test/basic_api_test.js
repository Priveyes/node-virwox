var Virwox = require('../');
var BasicApi = Virwox.BasicApi;
var Promise = require('bluebird');

var DELAY = 100;
Promise.resolve(BasicApi.getInstruments()).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getGridList()}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getTerminalList()}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getStatistics()}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getGridStatistics('2014-01-01 00:00:00', '2014-01-02 00:00:00')}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getRawTradeData('EUR/SLL', 3600)}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.getTradedPriceVolume('EUR/SLL', '2014-01-01 00:00:00', '2014-01-02 00:00:00', {precision:4})}).
    then(console.log).delay(DELAY).
    then(function(){return BasicApi.estimateMarketOrder('BUY', 10, "EUR/SLL")}).
    then(console.log);

