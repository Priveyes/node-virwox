var fx = require('yahoo-currency');

var feetbl = [
    {
        name:'paypal deposit fee',
        f:function(x){ return (x * 0.034) + 0.35 },
    },
    {
        name:'EUR/SLL exchange fee',
        f:function(x){ return (x * 0.029) },
    },
    {
        name:'BTC/SLL exchange fee',
        f:function(x){ return (x * 0.029) },
    }
];



var simulate = function(deposit){
    var w = [];
    var balance = deposit;
    w.push({balance:balance, fee:0, reason:'eur deposit'});
    feetbl.forEach(function(v){
        var fee = v.f(balance);
        balance -= fee;
        w.push({balance: balance, fee: fee, reason:v.name});
    })
    return {balance : balance, list:w};
}




var max_deposit = 300;
fx.fullRate().then(function(res){
    var w = simulate(max_deposit);
    w.list.push({ finalbalance : w.balance * res['EURJPY'], fee: (max_deposit - w.balance) * res['EURJPY'], reason : 'JPY' });
    w.list.push({ finalbalance : w.balance / res['BTCEUR'], fee: (max_deposit - w.balance) / res['BTCEUR'], reason : 'BTC' });
    console.log(w)
})
