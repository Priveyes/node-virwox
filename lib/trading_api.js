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
var createPostOption = function(url, user_agent, user, pass, appkey, id, method, params){
    var post = {
        method:method,
        id:id,
        params : createPostParam([{user:user, pass:pass, key:appkey}, params]),
    }
    return {
        url: url,
        method: 'POST',
        form: post,
        headers: createHeader(user_agent),
    };
}

var createTradingApi = exports.createTradingApi = function(user, pass, appkey){
    var query = function(id, method, params){
        return rp(
            createPostOption(CONSTANT.VIRWOX_TRADINGAPI_URL,
                CONSTANT.USER_AGENT,
                user, pass, appkey, id,
                method,
                params
            )
        ).then(JSON.parse).then(function(v){
            if(v.error) throw new Error(v.error);
            else return v.result;
        })
    }
    return {
        query : query,
        getBalance : function(){ return query(1, 'getBalance', {}) },
    }
}

